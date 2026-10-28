import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const ecoFilePath = path.join(ROOT_DIR, 'sources/ニュース検定　経済.md');
const rawText = fs.readFileSync(ecoFilePath, 'utf8');

const rawSections = rawText.split(/^##\s+/m);
console.log(`全セクションブロック数: ${rawSections.length}`);

rawSections.forEach((sec, idx) => {
  const trimmed = sec.trim();
  if (!trimmed || trimmed === 'ニュース検定　経済') return;
  const firstLineEnd = trimmed.indexOf('\n');
  const title = firstLineEnd > 0 ? trimmed.slice(0, firstLineEnd).trim() : trimmed;
  const content = firstLineEnd > 0 ? trimmed.slice(firstLineEnd).trim() : '';
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  console.log(`[セクション ${idx}] ${title}: ${content.length} 字 / ${lines.length} 行`);
});
