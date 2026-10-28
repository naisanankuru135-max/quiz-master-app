import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const oldQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/backups/politics_backup_old111.json'), 'utf8'));
const newQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/politics.json'), 'utf8'));

const oldSections = new Set(oldQuizzes.map(q => q.sourceSection));
const newSections = new Set(newQuizzes.map(q => q.sourceSection));

console.log('旧セクション名一覧:');
console.log(Array.from(oldSections));

console.log('\n新セクション名一覧:');
console.log(Array.from(newSections));
