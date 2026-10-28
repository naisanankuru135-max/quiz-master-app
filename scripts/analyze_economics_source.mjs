import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const sourcesDir = path.join(ROOT_DIR, 'sources');
const files = fs.readdirSync(sourcesDir);
console.log('sources フォルダ内のファイル:', files);

const ecoFileName = files.find(f => f.includes('経済'));
if (!ecoFileName) {
  console.error('経済のファイルが見つかりません');
  process.exit(1);
}

const ecoFilePath = path.join(sourcesDir, ecoFileName);
const content = fs.readFileSync(ecoFilePath, 'utf8');

console.log(`\nファイル名: ${ecoFileName}`);
console.log(`総文字数: ${content.length.toLocaleString()} 字`);
const lines = content.split('\n');
console.log(`総行数: ${lines.length.toLocaleString()} 行`);

console.log('\n=== 見出し・セクション構造 ===');
lines.forEach((line, idx) => {
  if (line.startsWith('#')) {
    console.log(`行 ${idx + 1}: ${line.trim()}`);
  }
});
