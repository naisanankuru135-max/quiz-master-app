import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const quizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/rebuilt_economics_quizzes.json'), 'utf8'));
const facts = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/new_facts_economics.json'), 'utf8'));

console.log('=== 基本集計 ===');
console.log('総問題数:', quizzes.length);
console.log('元ファクト数:', facts.length);

// ファクト網羅率
const coveredFactSet = new Set();
quizzes.forEach(q => {
  (q.coveredFactIds || []).forEach(id => coveredFactSet.add(id));
});
console.log(`網羅されたファクト数: ${coveredFactSet.size} / ${facts.length} (${(coveredFactSet.size / facts.length * 100).toFixed(1)}%)`);
const missingFacts = facts.filter(f => !coveredFactSet.has(f.id));
if (missingFacts.length > 0) {
  console.log('❌ 漏れているファクト:', missingFacts.map(f => f.id));
} else {
  console.log('✅ 全ファクト完全網羅 (漏れゼロ: 100%)');
}

// 正解個数分布
const countDist = { 1: 0, 2: 0, 3: 0, 4: 0 };
quizzes.forEach(q => countDist[q.correctAnswers.length]++);
console.log('\n=== 正解個数分布 ===');
for (let c = 1; c <= 4; c++) {
  console.log(`正解 ${c} 個: ${countDist[c]} 問 (${(countDist[c] / quizzes.length * 100).toFixed(1)}%)`);
}

// 正解キーの分布
const keyDist = { A: 0, B: 0, C: 0, D: 0 };
let totalCorrectKeys = 0;
quizzes.forEach(q => {
  q.correctAnswers.forEach(k => {
    keyDist[k]++;
    totalCorrectKeys++;
  });
});
console.log('\n=== 正解キー分布 ===');
for (const k of ['A', 'B', 'C', 'D']) {
  console.log(`キー ${k}: ${keyDist[k]} 回 (${(keyDist[k] / totalCorrectKeys * 100).toFixed(1)}%)`);
}

// 文字数チェック
let correctLengths = [];
let wrongLengths = [];
quizzes.forEach(q => {
  q.options.forEach(opt => {
    if (q.correctAnswers.includes(opt.key)) {
      correctLengths.push(opt.text.length);
    } else {
      wrongLengths.push(opt.text.length);
    }
  });
});
const avg = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
console.log('\n=== 選択肢文字数統計 ===');
console.log(`正解肢 平均文字数: ${avg(correctLengths)} 字 (最小: ${Math.min(...correctLengths)}, 最大: ${Math.max(...correctLengths)})`);
console.log(`誤答肢 平均文字数: ${avg(wrongLengths)} 字 (最小: ${Math.min(...wrongLengths)}, 最大: ${Math.max(...wrongLengths)})`);
