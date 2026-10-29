import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const filePath = path.join(ROOT_DIR, 'sources/ニュース検定　国際.md');
const text = fs.readFileSync(filePath, 'utf8');

const rawSections = text.split(/^##\s+/m);
const tasks = [];

for (const sec of rawSections) {
  const trimmed = sec.trim();
  if (!trimmed || trimmed.includes('# ニュース検定　国際')) continue;
  const firstLineEnd = trimmed.indexOf('\n');
  const secTitle = firstLineEnd > 0 ? trimmed.slice(0, firstLineEnd).trim() : trimmed;
  const cleanSecTitle = secTitle.replace(/^\d+[\.\s]*/, '').trim();
  const secBody = firstLineEnd > 0 ? trimmed.slice(firstLineEnd).trim() : '';

  const lines = secBody.split('\n').filter(l => l.trim().length > 0);
  const MAX_CHUNK = 20;

  if (lines.length > MAX_CHUNK) {
    const numParts = Math.ceil(lines.length / MAX_CHUNK);
    const chunkSize = Math.ceil(lines.length / numParts);
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunkLines = lines.slice(i, i + chunkSize);
      tasks.push({
        section: cleanSecTitle,
        part: Math.floor(i / chunkSize) + 1,
        totalParts: numParts,
        lineCount: chunkLines.length,
        lines: chunkLines,
        preview: chunkLines[0].slice(0, 40) + '...',
      });
    }
  } else {
    tasks.push({
      section: cleanSecTitle,
      part: 1,
      totalParts: 1,
      lineCount: lines.length,
      lines: lines,
      preview: lines[0] ? lines[0].slice(0, 40) + '...' : '',
    });
  }
}

console.log(`📋 国際ソース最適化解析結果: 全 ${tasks.length} タスクブロック`);
tasks.forEach((t, i) => {
  const partInfo = t.totalParts > 1 ? ` (Part ${t.part}/${t.totalParts})` : '';
  console.log(`[${(i + 1).toString().padStart(2, ' ')}] ${t.section}${partInfo}: ${t.lineCount}行 - ${t.preview}`);
});
