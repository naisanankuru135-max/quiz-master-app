import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const facts = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/new_facts_social.json'), 'utf8'));

console.log('=== 新・社会環境ファクト集計 ===');
console.log('総ファクト数:', facts.length);

// セクション別件数
const sectionCounts = {};
facts.forEach(f => {
  sectionCounts[f.section] = (sectionCounts[f.section] || 0) + 1;
});
console.log('\n=== セクション別ファクト件数 (上位・主要) ===');
Object.entries(sectionCounts).forEach(([sec, cnt], idx) => {
  console.log(`${idx + 1}. ${sec}: ${cnt} 件`);
});

// 文字数統計
const lengths = facts.map(f => f.charCount);
const avg = (lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(1);
console.log('\n=== 文字数統計 ===');
console.log(`平均文字数: ${avg} 字`);
console.log(`最小文字数: ${Math.min(...lengths)} 字 (ID: ${facts[lengths.indexOf(Math.min(...lengths))].id})`);
console.log(`最大文字数: ${Math.max(...lengths)} 字 (ID: ${facts[lengths.indexOf(Math.max(...lengths))].id})`);

// 文末チェック
const notEndingWithPeriod = facts.filter(f => !f.factText.endsWith('。'));
console.log('\n「。」で終わっていないファクト数:', notEndingWithPeriod.length);

// サンプル表示
console.log('\n=== サンプルファクト（抜粋） ===');
[0, 50, 100, 200, 300, 400, facts.length - 1].forEach(idx => {
  if (facts[idx]) {
    const f = facts[idx];
    console.log(`\n[${f.id}] 【${f.section}】 (${f.charCount}字)`);
    console.log(f.factText);
  }
});
