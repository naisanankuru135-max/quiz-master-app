/**
 * 厳しめの正答カバレッジ検算。
 *
 * 監査スクリプト（audit_liv_fact_answers.cjs）は「宣言問題の正解選択肢の結合テキスト」で
 * 判定するため、1ファクトの内容が複数の正解選択肢に分割されていても合格になる。
 * このスクリプトはさらに厳しく、
 *   - ファクトの数値トークンが「1つの正解選択肢」に全部入っているか
 *   - ファクトの主要語が「1つの正解選択肢」に60%以上入っているか
 * を確認し、分割・欠落しているファクトを一覧化する。
 *
 * 使い方:
 *   node scripts/audit_liv_single_option.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const facts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'facts_index_liv.json'), 'utf8'));
const quizzes = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'quizzes', 'livelihood.json'), 'utf8'));

const norm = t => String(t || '')
  .normalize('NFKC')
  .replace(/[\s、。，．,「」『』（）()]/g, '')
  .replace(/％/g, '%');

const NUM_RE = /\d+(?:\.\d+)?(?:年度|年|月|日|時間|分|秒|%|割|兆|億|万|人|円|件|カ国|都道府県|府県|県|回|倍|階|歳|品目|種類|位|カ月|週間|日間)?/g;
const numbers = t => [...new Set([...norm(t).matchAll(NUM_RE)].map(m => m[0]))];
const keywords = t => [...new Set([...String(t).normalize('NFKC').matchAll(/[一-龥]{2,}|[ァ-ヶー]{3,}|[A-Za-z]{3,}/g)].map(m => m[0]))];

const correctOptions = [];
for (const q of quizzes) {
  for (const o of q.options) {
    if (!q.correctAnswers.includes(o.key)) continue;
    correctOptions.push({ quizId: q.id, key: o.key, text: o.text, norm: norm(o.text), covered: q.coveredFactIds || [] });
  }
}

const rows = [];
for (const f of facts) {
  const nums = numbers(f.factText);
  const words = keywords(f.factText);

  const missingNums = nums.filter(n => !correctOptions.some(c => c.norm.includes(n)));
  const singleOptionAllNums = nums.length > 0 && correctOptions.some(c => nums.every(n => c.norm.includes(n)));
  const splitNums = nums.length > 0 && !singleOptionAllNums && missingNums.length === 0;

  let bestKw = 0;
  let bestOpt = null;
  for (const c of correctOptions) {
    let hit = 0;
    for (const w of words) if (c.norm.includes(w)) hit++;
    const score = words.length ? hit / words.length : 1;
    if (score > bestKw) {
      bestKw = score;
      bestOpt = c;
    }
  }

  rows.push({
    id: f.id,
    section: f.section,
    totalNums: nums.length,
    missingNums,
    splitNums,
    bestKw,
    bestOpt: bestOpt ? `${bestOpt.quizId} ${bestOpt.key}` : '-',
  });
}

const numMissing = rows.filter(r => r.missingNums.length > 0);
const numSplit = rows.filter(r => r.splitNums);
const kwWeak = rows.filter(r => r.bestKw < 0.6);

console.log('='.repeat(60));
console.log(`ファクト数: ${facts.length}`);
console.log(`数値がどの正解選択肢にもない（欠落）: ${numMissing.length}`);
console.log(`数値は正解選択肢にあるが単一選択肢に揃わない（分割）: ${numSplit.length}`);
console.log(`主要語60%未満の正解選択肢しかない: ${kwWeak.length}`);
console.log('='.repeat(60));
for (const r of numMissing) {
  console.log(`[欠落] ${r.id} (${r.section}) 欠落: ${r.missingNums.join(',')} / 最良 ${r.bestOpt} (${r.bestKw.toFixed(2)})`);
}
for (const r of numSplit) {
  console.log(`[分割] ${r.id} (${r.section}) 数値が複数の正解選択肢に分かれている / 最良 ${r.bestOpt} (${r.bestKw.toFixed(2)})`);
}
for (const r of kwWeak) {
  if (r.missingNums.length) continue;
  console.log(`[語]   ${r.id} (${r.section}) 最良 ${r.bestOpt} (${r.bestKw.toFixed(2)})`);
}

const reportDir = path.join(ROOT, 'data', 'reviews');
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, 'liv_single_option_audit.md');
const lines = [
  '# 暮らし 正答カバレッジ（単一選択肢・厳しめ）',
  '',
  `- ファクト数: ${facts.length}`,
  `- 数値がどの正解選択肢にもない（欠落）: ${numMissing.length}`,
  `- 数値は正解選択肢にあるが単一選択肢に揃わない（分割）: ${numSplit.length}`,
  `- 主要語60%未満: ${kwWeak.length}`,
  '',
  '| ID | セクション | 欠落数値 | 最良の正解選択肢 | 主要語一致 |',
  '| --- | --- | --- | --- | --- |',
  ...rows.map(r => `| ${r.id} | ${r.section} | ${r.missingNums.join(', ') || '-'} | ${r.bestOpt} | ${r.bestKw.toFixed(2)} |`),
  '',
];
fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
console.log(`レポート: ${reportPath}`);
