import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const eco = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/economics.json'), 'utf8'));
const liv = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/livelihood.json'), 'utf8'));
const pol = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/politics.json'), 'utf8'));
const allFacts = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/facts_index.json'), 'utf8'));

console.log('=== アプリ全クイズデータ集計 ===');
console.log('政治クイズ数:', pol.length);
console.log('経済クイズ数:', eco.length);
console.log('暮らしくいず数:', liv.length);
console.log('総クイズ数:', pol.length + eco.length + liv.length);

console.log('\n=== アプリ全ファクトデータ集計 ===');
const factCat = {};
allFacts.forEach(f => factCat[f.category] = (factCat[f.category] || 0) + 1);
console.log('カテゴリ別ファクト数:', factCat);
console.log('総ファクト数:', allFacts.length);
