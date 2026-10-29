import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const quizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/rebuilt_social_quizzes.json'), 'utf8'));

const q1 = quizzes[0];
const q3 = quizzes.find(q => q.correctAnswers.length === 3);
const q4 = quizzes.find(q => q.correctAnswers.length === 4);

function printQuiz(title, q) {
  console.log(`\n=== ${title} ===`);
  console.log(`[${q.id}] 【${q.category} / ${q.sourceSection}】`);
  console.log(`問題: ${q.question}`);
  q.options.forEach(o => {
    const isCor = q.correctAnswers.includes(o.key);
    console.log(`  ${o.key}: ${o.text} ${isCor ? '✅[正解]' : '[誤答]'}`);
  });
  console.log(`正解: [ ${q.correctAnswers.join(', ')} ] (計 ${q.correctAnswers.length} 個)`);
  console.log(`対象ファクト: ${q.coveredFactIds?.join(', ')}`);
  console.log(`解説: ${q.explanations?.overall}`);
}

printQuiz('第1問サンプル', q1);
printQuiz('正解3問サンプル', q3);
printQuiz('正解4問（全正解トラップ）サンプル', q4);
