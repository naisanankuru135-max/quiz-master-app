import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const quizzesDir = path.join(ROOT_DIR, 'src/data/quizzes');
const files = fs.readdirSync(quizzesDir);
console.log('src/data/quizzes のファイル一覧:', files);
