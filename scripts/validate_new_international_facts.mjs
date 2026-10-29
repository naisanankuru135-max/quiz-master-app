import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const jsonPath = path.join(ROOT_DIR, 'data/new_facts_international.json');
const facts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`========================================`);
console.log(`📊 国際分野 ファクト品質監査レポート`);
console.log(`========================================`);
console.log(`総ファクト数: ${facts.length} 件`);

// 1. ID重複チェック
const ids = new Set();
let dupCount = 0;
for (const f of facts) {
  if (ids.has(f.id)) dupCount++;
  ids.add(f.id);
}
console.log(`ID重複: ${dupCount === 0 ? '✅ なし（完全一意）' : `❌ ${dupCount}件の重複あり`}`);

// 2. 文字数統計
const lengths = facts.map(f => f.charCount || f.factText.length);
const avgLen = (lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(1);
const minLen = Math.min(...lengths);
const maxLen = Math.max(...lengths);
console.log(`文字数統計: 平均 ${avgLen} 文字 (最小: ${minLen}字, 最大: ${maxLen}字)`);

// 3. 文末チェック（「。」で終わっているか）
const noPeriod = facts.filter(f => !f.factText.endsWith('。'));
console.log(`文末句点チェック: ${noPeriod.length === 0 ? '✅ 全件完結（体言止めゼロ）' : `❌ ${noPeriod.length}件が「。」で終わっていません`}`);
if (noPeriod.length > 0) {
  console.log(`  未完結例:`, noPeriod.slice(0, 3).map(f => `${f.id}: ${f.factText}`));
}

// 4. セクション別内訳
const secMap = {};
for (const f of facts) {
  secMap[f.section] = (secMap[f.section] || 0) + 1;
}
console.log(`\n📋 テーマ別ファクト件数内訳:`);
Object.entries(secMap).forEach(([sec, cnt], idx) => {
  console.log(`  ${(idx + 1).toString().padStart(2, ' ')}. ${sec}: ${cnt}件`);
});

// 5. 2024-2026年最新時事キーワード含有チェック
const modernKeywords = [
  '2024', '2025', '2026', 'トランプ', 'マドゥロ', 'ベネズエラ', 'NATO', '5％', 'パリ協定',
  '赤根智子', 'ガザ', 'ハマス', 'アサド', 'ウクライナ', 'ドローン', '310機', '日本被団協'
];
console.log(`\n🔍 最新時事重要キーワード検証:`);
for (const kw of modernKeywords) {
  const matching = facts.filter(f => f.factText.includes(kw));
  console.log(`  - 「${kw}」: ${matching.length} 件`);
}

// 6. サンプル表示 (各テーマから1件ずつ)
console.log(`\n📖 代表サンプル（各テーマより抜粋）:`);
const seenSec = new Set();
for (const f of facts) {
  if (!seenSec.has(f.section)) {
    seenSec.add(f.section);
    console.log(`[${f.id}] (${f.section})\n  ${f.factText}\n`);
  }
}
