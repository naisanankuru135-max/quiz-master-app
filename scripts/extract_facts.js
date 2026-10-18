/**
 * Step 1: 全論点（Fact）インデックス抽出スクリプト
 * ソースファイルを意味単位（文・箇条書き・段落）に完全分解し、
 * 一意の Fact ID（POL-001, ECO-001 等）を付与した論点チェックリストデータベースを作成します。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '..');
const SOURCES_DIR = path.join(BASE_DIR, 'sources');
const DATA_DIR = path.join(BASE_DIR, 'data');
const FACTS_FILE = path.join(DATA_DIR, 'facts_index.json');

fs.mkdirSync(DATA_DIR, { recursive: true });

function extractFactsFromFile(filePath, category, prefix) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const facts = [];
  
  let currentSection = '基本事項';
  let factIndex = 1;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith('#')) {
      currentSection = line.replace(/^#+\s*/, '').replace(/\*+/g, '').trim();
      continue;
    }

    // 箇条書き記号（・、-、*など）を除去して本文を抽出
    let cleaned = line.replace(/^[・\-\*]\s*/, '').trim();
    
    // 短すぎる見出しやゴミを除外（10文字以上を有効な論点とする）
    if (cleaned.length < 10) continue;

    // 「・」が文中に複数ある場合、箇条書きの入れ子を分割
    const subItems = cleaned.split(/(?=[・])+/).map(s => s.replace(/^[・\s]+/, '').trim()).filter(s => s.length >= 10);
    const targetItems = subItems.length > 1 ? subItems : [cleaned];

    for (const item of targetItems) {
      const factId = `${prefix}-${String(factIndex).padStart(3, '0')}`;
      facts.push({
        id: factId,
        category: category,
        sourceFile: path.basename(filePath),
        section: currentSection,
        factText: item,
        charCount: item.length
      });
      factIndex++;
    }
  }

  return facts;
}

function main() {
  console.log('=== Step 1: 全論点（Fact）インデックス化を開始 ===');

  const polPath = path.join(SOURCES_DIR, 'ニュース検定　政治.md');
  const ecoPath = path.join(SOURCES_DIR, 'ニュース検定　経済.md');

  const polFacts = extractFactsFromFile(polPath, '政治', 'POL');
  console.log(`[政治] 抽出された論点数: ${polFacts.length} 件`);

  const ecoFacts = extractFactsFromFile(ecoPath, '経済', 'ECO');
  console.log(`[経済] 抽出された論点数: ${ecoFacts.length} 件`);

  const allFacts = [...polFacts, ...ecoFacts];
  console.log(`\n【合計】 全論点チェックリスト総数: ${allFacts.length} 件`);

  fs.writeFileSync(FACTS_FILE, JSON.stringify(allFacts, null, 2), 'utf-8');
  console.log(`✓ 論点インデックスDBを保存しました: ${FACTS_FILE}`);
}

main();
