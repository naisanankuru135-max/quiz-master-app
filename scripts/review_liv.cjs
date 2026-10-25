/**
 * 指定IDのクイズを簡潔にダンプする（レビュー用）。
 * 使い方: node scripts/review_liv.cjs liv-001 liv-002 ... > out.md
 */
const fs = require('fs');
const path = require('path');

const QUIZ_FILE = path.join(__dirname, '..', 'src', 'data', 'quizzes', 'livelihood.json');
const quizzes = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf8'));
const byId = new Map(quizzes.map(q => [q.id, q]));

const ids = process.argv.slice(2);
for (const id of ids) {
  const q = byId.get(id);
  if (!q) {
    console.log(`### ${id} は存在しません\n`);
    continue;
  }
  console.log(`### ${q.id}（${q.sourceSection}） 正解: ${q.correctAnswers.join('')}  covered: ${(q.coveredFactIds || []).join(',')}`);
  console.log('');
  console.log(`**Q.** ${q.question}`);
  console.log('');
  for (const opt of q.options) {
    console.log(`- ${q.correctAnswers.includes(opt.key) ? '○' : '×'} **${opt.key}**: ${opt.text}`);
  }
  console.log('');
}
