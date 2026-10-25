/**
 * Step 1: 全論点（Fact）インデックス抽出スクリプト
 * ソースファイルを意味単位（文・箇条書き・段落）に完全分解し、
 * 一意の Fact ID（POL-001, ECO-001, LIV-001 等）を付与した論点チェックリストデータベースを作成します。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { enrichLivFacts, writeLivReports } from './liv_facts_postprocess.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '..');
const SOURCES_DIR = path.join(BASE_DIR, 'sources');
const DATA_DIR = path.join(BASE_DIR, 'data');
const FACTS_FILE = path.join(DATA_DIR, 'facts_index.json');
const LIV_FACTS_FILE = path.join(DATA_DIR, 'facts_index_liv.json');

fs.mkdirSync(DATA_DIR, { recursive: true });

function stripMarkdown(text) {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\*\*/g, '')
    .replace(/^\*+\s*/, '')
    .replace(/\*+$/, '')
    .trim();
}

function extractFactsFromFile(filePath, category, prefix, options = {}) {
  const {
    splitInlineBullets = true,
    cleanMarkdown = false,
    parseTables = false,
    mergeShortNumericLines = false,
    includeSourceMetadata = false,
    minLength = 10,
  } = options;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(line => line.replace(/\r$/, ''));
  const facts = [];

  let currentSection = '基本事項';
  let factIndex = 1;
  let tableHeaders = null;
  let tableHeaderLine = null;
  let tableHeaderText = '';
  let pendingShort = null;
  let pendingLabel = null;

  const addFact = (text, sourceLines = [], sourceText = '') => {
    const item = text.trim();
    if (!item) return;
    const factId = `${prefix}-${String(factIndex).padStart(3, '0')}`;

    let linesForFact = [...sourceLines];
    let textForFact = sourceText;
    if (pendingLabel) {
      linesForFact = [pendingLabel.lineNo, ...linesForFact];
      textForFact = `${pendingLabel.raw}\n${textForFact}`;
      pendingLabel = null;
    }

    const fact = {
      id: factId,
      category: category,
      sourceFile: path.basename(filePath),
      section: currentSection,
      factText: item,
      charCount: item.length
    };

    if (includeSourceMetadata) {
      fact.sourceLines = [...new Set(linesForFact)].sort((a, b) => a - b);
      fact.sourceText = textForFact.trim();
    }

    facts.push(fact);
    factIndex++;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    let line = rawLine.trim();
    if (!line) {
      tableHeaders = null;
      tableHeaderLine = null;
      tableHeaderText = '';
      pendingShort = null;
      pendingLabel = null;
      continue;
    }

    if (line.startsWith('#')) {
      currentSection = line.replace(/^#+\s*/, '').replace(/\*+/g, '').trim();
      tableHeaders = null;
      tableHeaderLine = null;
      tableHeaderText = '';
      pendingShort = null;
      pendingLabel = null;
      continue;
    }

    // Markdownの表を1行1ファクトとして取り込む（暮らし用）
    if (parseTables && line.startsWith('|')) {
      const cells = line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim());

      // 区切り行（| :---- | :---- |）はスキップ
      if (cells.every(cell => !cell || /^:?-{3,}:?$/.test(cell))) continue;

      if (!tableHeaders) {
        tableHeaders = cells;
        tableHeaderLine = i + 1;
        tableHeaderText = rawLine.trim();
        continue;
      }

      const parts = cells.map((cell, j) => {
        const value = cleanMarkdown ? stripMarkdown(cell) : cell;
        if (!value) return '';
        const header = tableHeaders[j] ? stripMarkdown(tableHeaders[j]) : '';
        return header ? `${header}：${value}` : value;
      }).filter(Boolean);

      if (parts.length) {
        const sourceLines = tableHeaderLine ? [tableHeaderLine, i + 1] : [i + 1];
        const sourceText = tableHeaderText ? `${tableHeaderText}\n${rawLine.trim()}` : rawLine.trim();
        addFact(parts.join(' / '), sourceLines, sourceText);
      }
      continue;
    }

    tableHeaders = null;
    tableHeaderLine = null;
    tableHeaderText = '';

    // 全体が太字だけの行は見出し・ラベルなのでファクトにしない。
    // ただし、直後の本文ファクトの sourceLines には含めて、原文対応を切らない。
    if (cleanMarkdown && /^\*\*[^*]+\*\*\s*[：:]?\s*$/.test(line)) {
      pendingLabel = { lineNo: i + 1, raw: rawLine.trim() };
      continue;
    }

    // 箇条書き記号（・、-、*など）を除去して本文を抽出
    let cleaned = line.replace(/^[・\-\*]\s*/, '').trim();
    if (cleanMarkdown) cleaned = stripMarkdown(cleaned);
    if (!cleaned) continue;

    let sourceLines = [i + 1];
    let sourceText = rawLine.trim();

    // 金額だけの短い行は、直後の説明文と結合する
    if (mergeShortNumericLines && cleaned.length < minLength) {
      if (/[\d０-９]/.test(cleaned)) {
        pendingShort = { text: cleaned, lineNo: i + 1, raw: rawLine.trim() };
      }
      continue;
    }

    if (pendingShort) {
      cleaned = `${pendingShort.text}：${cleaned}`;
      sourceLines = [pendingShort.lineNo, i + 1];
      sourceText = `${pendingShort.raw}\n${rawLine.trim()}`;
      pendingShort = null;
    }

    // 短すぎる見出しやゴミを除外
    if (cleaned.length < minLength) continue;
    if (!/[\p{L}\p{N}]/u.test(cleaned)) continue;

    // 既存ソースは文中の「・」を箇条書きの入れ子として分割する
    let targetItems = [cleaned];
    if (splitInlineBullets) {
      const subItems = cleaned.split(/(?=[・])+/).map(s => s.replace(/^[・\s]+/, '').trim()).filter(s => s.length >= minLength);
      if (subItems.length > 1) targetItems = subItems;
    }

    for (const item of targetItems) addFact(item, sourceLines, sourceText);
  }

  return facts;
}

function main() {
  console.log('=== Step 1: 全論点（Fact）インデックス化を開始 ===');

  const polPath = path.join(SOURCES_DIR, 'ニュース検定　政治.md');
  const ecoPath = path.join(SOURCES_DIR, 'ニュース検定　経済.md');
  const livPath = path.join(SOURCES_DIR, 'ニュース検定　暮らし.md');

  const polFacts = extractFactsFromFile(polPath, '政治', 'POL');
  console.log(`[政治] 抽出された論点数: ${polFacts.length} 件`);

  const ecoFacts = extractFactsFromFile(ecoPath, '経済', 'ECO');
  console.log(`[経済] 抽出された論点数: ${ecoFacts.length} 件`);

  const livFacts = extractFactsFromFile(livPath, '暮らし', 'LIV', {
    splitInlineBullets: false,
    cleanMarkdown: true,
    parseTables: true,
    mergeShortNumericLines: true,
    includeSourceMetadata: true,
    minLength: 8,
  });
  enrichLivFacts(livFacts);
  console.log(`[暮らし] 抽出された論点数: ${livFacts.length} 件`);

  const allFacts = [...polFacts, ...ecoFacts, ...livFacts];
  console.log(`\n【合計】 全論点チェックリスト総数: ${allFacts.length} 件`);

  fs.writeFileSync(FACTS_FILE, JSON.stringify(allFacts, null, 2), 'utf-8');
  fs.writeFileSync(LIV_FACTS_FILE, JSON.stringify(livFacts, null, 2), 'utf-8');
  const coverage = writeLivReports(livFacts, livPath);
  console.log(`✓ 論点インデックスDBを保存しました: ${FACTS_FILE}`);
  console.log(`✓ 暮らしファクト単体ファイルも保存しました: ${LIV_FACTS_FILE}`);
  console.log(`✓ 暮らしファクト一覧を更新しました: ${path.join(DATA_DIR, 'facts_index_liv.md')}`);
  console.log(`✓ 暮らしMDカバレッジ: 本文 ${coverage.mappedBodyLines}/${coverage.bodyLines}行、未マップ ${coverage.unmappedBodyLines}行`);
  console.log(`✓ カバレッジレポート: ${path.join(DATA_DIR, 'facts_index_liv_coverage.md')}`);
}

main();
