import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const livPath = path.join(ROOT_DIR, 'sources/ニュース検定　暮らし.md');
if (fs.existsSync(livPath)) {
  const content = fs.readFileSync(livPath, 'utf8');
  const lines = content.split('\n');
  console.log('既存 ニュース検定　暮らし.md の見出し:');
  lines.slice(0, 50).forEach((l, i) => {
    if (l.startsWith('#')) console.log(`行${i+1}: ${l.trim()}`);
  });
}
