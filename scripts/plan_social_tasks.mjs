import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const filePath = path.join(ROOT_DIR, 'sources/ニュース検定　社会環境.md');
const text = fs.readFileSync(filePath, 'utf8');

// ## で大セクション分割
const rawSections = text.split(/^##\s+/m);
console.log(`大セクション数: ${rawSections.length}`);

const tasks = [];

for (const sec of rawSections) {
  const trimmed = sec.trim();
  if (!trimmed || trimmed.includes('# ニュース検定　社会環境')) continue;
  const firstLineEnd = trimmed.indexOf('\n');
  const secTitle = firstLineEnd > 0 ? trimmed.slice(0, firstLineEnd).trim() : trimmed;
  // 番号の除去: "1. 教育・子ども" -> "教育・子ども"
  const cleanSecTitle = secTitle.replace(/^\d+[\.\s]*/, '').trim();
  const secBody = firstLineEnd > 0 ? trimmed.slice(firstLineEnd).trim() : '';

  // ### でサブセクション分割
  const rawSubSections = secBody.split(/^###\s+/m);
  for (const sub of rawSubSections) {
    const subTrimmed = sub.trim();
    if (!subTrimmed) continue;
    const subFirstLineEnd = subTrimmed.indexOf('\n');
    const subTitle = subFirstLineEnd > 0 ? subTrimmed.slice(0, subFirstLineEnd).trim() : '全般';
    const subContent = subFirstLineEnd > 0 ? subTrimmed.slice(subFirstLineEnd).trim() : subTrimmed;

    const lines = subContent.split('\n').filter(l => l.trim().length > 0);
    const CHUNK_SIZE = 16;

    if (lines.length > CHUNK_SIZE) {
      for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
        const chunkLines = lines.slice(i, i + CHUNK_SIZE);
        tasks.push({
          section: cleanSecTitle,
          subSection: subTitle,
          part: Math.floor(i / CHUNK_SIZE) + 1,
          totalParts: Math.ceil(lines.length / CHUNK_SIZE),
          content: chunkLines.join('\n'),
        });
      }
    } else {
      tasks.push({
        section: cleanSecTitle,
        subSection: subTitle,
        part: 1,
        totalParts: 1,
        content: subContent,
      });
    }
  }
}

console.log(`抽出タスクブロック総数: ${tasks.length}`);
tasks.slice(0, 10).forEach((t, i) => {
  console.log(`[タスク ${i + 1}] 【${t.section} / ${t.subSection}】 (Part ${t.part}/${t.totalParts}) 内容文字数: ${t.content.length}`);
});
