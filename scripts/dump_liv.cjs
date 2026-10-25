/**
 * 指定した暮らしクイズIDを読みやすく出力する。
 * 使い方: node scripts/dump_liv.cjs liv-096 liv-033 ...
 */
const fs = require('fs');
const path = require('path');

const QUIZ_FILE = path.join(__dirname, '..', 'src', 'data', 'quizzes', 'livelihood.json');
const quizzes = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf8'));

const ids = process.argv.slice(2);
for (const id of ids) {
  const q = quizzes.find(x => x.id === id);
  if (!q) {
    console.log(`[${id}] not found`);
    continue;
  }
  console.log('='.repeat(80));
  console.log(`${q.id} / ${q.sourceSection}`);
  console.log(`Q: ${q.question}`);
  console.log(`正解: ${q.correctAnswers.join(', ')}`);
  console.log(`coveredFactIds: ${(q.coveredFactIds || []).join(', ')}`);
  for (const opt of q.options) {
    const mark = q.correctAnswers.includes(opt.key) ? '○' : '×';
    console.log(`  ${mark} ${opt.key}: ${opt.text}`);
  }
  console.log('解説:');
  for (const [k, v] of Object.entries(q.explanations.details || {})) {
    console.log(`  ${k}: ${v}`);
  }
  console.log(`  overall: ${q.explanations.overall}`);
  console.log('');
}
