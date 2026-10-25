import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LIV_TEXT_OVERRIDES, LIV_TOPIC_OVERRIDES } from './liv_fact_overrides.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(SCRIPT_DIR, '..');
const LIV_MARKDOWN_FILE = path.join(BASE_DIR, 'data', 'facts_index_liv.md');
const LIV_COVERAGE_MD_FILE = path.join(BASE_DIR, 'data', 'facts_index_liv_coverage.md');
const LIV_COVERAGE_JSON_FILE = path.join(BASE_DIR, 'data', 'facts_index_liv_coverage.json');

function normalizeForMatch(text) {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\*\*/g, '')
    .replace(/[#>*`|]/g, '')
    .replace(/[\s\u3000]/g, '')
    .replace(/[、。，．・：:；;！!？?「」『』（）()［］\[\]【】〈〉《》…‥\-ー—–/／▽]/g, '')
    .toLowerCase();
}

function makeTopic(fact) {
  // 本文がすでに完結した文になっている場合は、分野名をそのまま話題として使う。
  // 断片的な本文（被保険者区分、年収の壁、表の行など）だけ、下の overrides で
  // 「何の話か」を補う。
  return LIV_TOPIC_OVERRIDES[fact.id] || fact.section;
}

export function enrichLivFacts(facts) {
  const ids = new Set();
  for (const fact of facts) {
    if (ids.has(fact.id)) throw new Error(`重複したファクトID: ${fact.id}`);
    ids.add(fact.id);
  }

  for (const fact of facts) {
    if (LIV_TEXT_OVERRIDES[fact.id]) {
      fact.factText = LIV_TEXT_OVERRIDES[fact.id];
    }
    fact.charCount = fact.factText.length;
    fact.topic = makeTopic(fact);
    if (Array.isArray(fact.sourceLines)) {
      fact.sourceLines = [...new Set(fact.sourceLines)].sort((a, b) => a - b);
    }
  }

  for (const id of Object.keys(LIV_TEXT_OVERRIDES)) {
    if (!ids.has(id)) throw new Error(`本文補正の対象IDが見つかりません: ${id}`);
  }
  for (const id of Object.keys(LIV_TOPIC_OVERRIDES)) {
    if (!ids.has(id)) throw new Error(`話題ラベルの対象IDが見つかりません: ${id}`);
  }

  return facts;
}

function classifyLine(line, index, lines) {
  const trimmed = line.trim();
  if (!trimmed) return '空行';
  if (/^#{1,6}\s/.test(trimmed)) return '見出し';
  if (/^\|?\s*:?-{3,}/.test(trimmed)) return '表区切り';
  if (trimmed.startsWith('|')) {
    const next = lines[index + 1]?.trim() || '';
    if (/^\|?\s*:?-{3,}/.test(next)) return '表ヘッダ';
    return '本文';
  }
  if (/^\*\*[^*]+\*\*\s*[：:]?\s*$/.test(trimmed)) return 'ラベル';
  return '本文';
}

function escapeTable(text, maxLength = 90) {
  const short = text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  return short.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

export function computeCoverage(facts, sourcePath) {
  const source = fs.readFileSync(sourcePath, 'utf8').split('\n').map(line => line.replace(/\r$/, ''));
  const lineToFacts = new Map();
  for (const fact of facts) {
    for (const lineNo of fact.sourceLines || []) {
      if (!lineToFacts.has(lineNo)) lineToFacts.set(lineNo, []);
      lineToFacts.get(lineNo).push(fact.id);
    }
  }

  const rows = source.map((line, index) => {
    const lineNo = index + 1;
    const type = classifyLine(line, index, source);
    let factIds = [...new Set(lineToFacts.get(lineNo) || [])];

    // ラベル行は、本文に同じ語句が現れていれば関連ファクトとして扱う
    if (!factIds.length && (type === 'ラベル' || type === '表ヘッダ')) {
      const norm = normalizeForMatch(line);
      if (norm) {
        factIds = facts.filter(fact => {
          const corpus = normalizeForMatch(`${fact.factText}\n${fact.sourceText || ''}`);
          return corpus.includes(norm);
        }).map(fact => fact.id);
      }
    }

    return { line: lineNo, type, factIds, text: line };
  });

  const bodyRows = rows.filter(row => row.type === '本文');
  const mappedBodyRows = bodyRows.filter(row => row.factIds.length > 0);
  const unmappedBodyRows = bodyRows.filter(row => row.factIds.length === 0);
  const unmappedLabels = rows.filter(row => row.type === 'ラベル' && row.factIds.length === 0);

  return {
    sourceLines: source.length,
    bodyLines: bodyRows.length,
    mappedBodyLines: mappedBodyRows.length,
    unmappedBodyLines: unmappedBodyRows.length,
    unmappedLabels: unmappedLabels.length,
    counts: {
      headings: rows.filter(row => row.type === '見出し').length,
      blanks: rows.filter(row => row.type === '空行').length,
      tableSeparators: rows.filter(row => row.type === '表区切り').length,
      tableHeaders: rows.filter(row => row.type === '表ヘッダ').length,
      labels: rows.filter(row => row.type === 'ラベル').length,
    },
    rows,
    unmappedBodyRows,
    unmappedLabelRows: unmappedLabels,
  };
}

export function writeLivReports(facts, sourcePath) {
  const coverage = computeCoverage(facts, sourcePath);
  const sectionOrder = [];
  const bySection = new Map();
  for (const fact of facts) {
    if (!bySection.has(fact.section)) {
      bySection.set(fact.section, []);
      sectionOrder.push(fact.section);
    }
    bySection.get(fact.section).push(fact);
  }

  const md = [];
  md.push('# 暮らしファクト一覧（LIV）');
  md.push('');
  md.push(`- 総数: **${facts.length}件**`);
  md.push(`- ID範囲: **${facts[0]?.id || '-'} 〜 ${facts[facts.length - 1]?.id || '-'}**`);
  md.push(`- 出典: \`${path.basename(sourcePath)}\``);
  md.push('- 正本: `data/facts_index_liv.json`');
  md.push(`- 本文行カバレッジ: **${coverage.mappedBodyLines} / ${coverage.bodyLines}行（未マップ ${coverage.unmappedBodyLines}行）**`);
  md.push('');
  md.push('> 各ファクトは「分野または話題」を頭に付け、単体でも何の話か分かる形にしています。');
  md.push('> 原文は各ファクトの `sourceText` / `sourceLines` に保持しています。');
  md.push('');

  for (const section of sectionOrder) {
    const sectionFacts = bySection.get(section);
    md.push(`## ${section}（${sectionFacts.length}件）`);
    md.push('');
    for (const fact of sectionFacts) {
      md.push(`- **${fact.id}** 【${fact.topic}】 ${fact.factText}`);
    }
    md.push('');
  }

  fs.writeFileSync(LIV_MARKDOWN_FILE, md.join('\n'), 'utf8');

  const coverageMd = [];
  coverageMd.push('# 暮らしMD ファクト化カバレッジ');
  coverageMd.push('');
  coverageMd.push(`- 原本: \`${path.basename(sourcePath)}\``);
  coverageMd.push(`- 原本行数: **${coverage.sourceLines}行**`);
  coverageMd.push(`- 本文行: **${coverage.bodyLines}行**`);
  coverageMd.push(`- ファクト化済み本文行: **${coverage.mappedBodyLines}行**`);
  coverageMd.push(`- 未マップ本文行: **${coverage.unmappedBodyLines}行**`);
  coverageMd.push(`- 未マップのラベル行: **${coverage.unmappedLabels}行**`);
  coverageMd.push('');
  coverageMd.push('## 構造行の内訳');
  coverageMd.push('');
  coverageMd.push(`- 見出し: ${coverage.counts.headings}行`);
  coverageMd.push(`- 空行: ${coverage.counts.blanks}行`);
  coverageMd.push(`- 表区切り: ${coverage.counts.tableSeparators}行`);
  coverageMd.push(`- 表ヘッダ: ${coverage.counts.tableHeaders}行`);
  coverageMd.push(`- ラベル: ${coverage.counts.labels}行`);
  coverageMd.push('');
  coverageMd.push('> 見出しは各ファクトの `section` として保持しています。空行・表区切りは内容を持たない構造行です。表ヘッダは各行ファクトに列名として反映しています。');
  coverageMd.push('');
  coverageMd.push('## 未マップ本文行');
  coverageMd.push('');
  if (!coverage.unmappedBodyRows.length) {
    coverageMd.push('なし（0行）');
  } else {
    for (const row of coverage.unmappedBodyRows) {
      coverageMd.push(`- L${row.line}: ${row.text}`);
    }
  }
  coverageMd.push('');
  coverageMd.push('## 全行の対応表');
  coverageMd.push('');
  coverageMd.push('| 行 | 種別 | ファクトID | 原文（先頭90文字） |');
  coverageMd.push('| ---: | --- | --- | --- |');
  for (const row of coverage.rows) {
    coverageMd.push(`| ${row.line} | ${row.type} | ${row.factIds.join(', ') || '-'} | ${escapeTable(row.text)} |`);
  }
  coverageMd.push('');
  fs.writeFileSync(LIV_COVERAGE_MD_FILE, coverageMd.join('\n'), 'utf8');

  fs.writeFileSync(LIV_COVERAGE_JSON_FILE, JSON.stringify({
    sourceFile: path.basename(sourcePath),
    summary: {
      sourceLines: coverage.sourceLines,
      bodyLines: coverage.bodyLines,
      mappedBodyLines: coverage.mappedBodyLines,
      unmappedBodyLines: coverage.unmappedBodyLines,
      unmappedLabels: coverage.unmappedLabels,
      counts: coverage.counts,
    },
    rows: coverage.rows,
  }, null, 2), 'utf8');

  return coverage;
}
