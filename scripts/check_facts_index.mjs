import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const facts = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/facts_index.json'), 'utf8'));
const cats = {};
facts.forEach(f => cats[f.category] = (cats[f.category] || 0) + 1);
console.log('現在 src/data/facts_index.json のカテゴリ別件数:', cats);
