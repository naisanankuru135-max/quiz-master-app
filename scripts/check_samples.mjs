import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const quizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/rebuilt_politics_quizzes.json'), 'utf8'));
const q3 = quizzes.find(q => q.correctAnswers.length === 3);
const q4 = quizzes.find(q => q.correctAnswers.length === 4);

console.log('=== 正解3個のサンプル ===');
console.log(q3.id, q3.sourceSection);
console.log(q3.question);
q3.options.forEach(o => console.log(o.key, q3.correctAnswers.includes(o.key) ? '[正解]' : '[誤答]', o.text));
console.log('正解:', q3.correctAnswers);
console.log('対象ファクト:', q3.coveredFactIds);

console.log('\n=== 正解4個のサンプル ===');
console.log(q4.id, q4.sourceSection);
console.log(q4.question);
q4.options.forEach(o => console.log(o.key, q4.correctAnswers.includes(o.key) ? '[正解]' : '[誤答]', o.text));
console.log('正解:', q4.correctAnswers);
console.log('対象ファクト:', q4.coveredFactIds);
