import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(BASE_DIR, 'src', 'data', 'quizzes');

export function appendQuizzes(category, newQuizzes) {
  const file = path.join(OUTPUT_DIR, category === '政治' ? 'politics.json' : 'economics.json');
  let existing = [];
  if (fs.existsSync(file)) {
    try {
      existing = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch (e) {}
  }

  // 既存IDの確認とアペンド
  const idSet = new Set(existing.map(q => q.id));
  let addedCount = 0;

  for (const q of newQuizzes) {
    if (!idSet.has(q.id)) {
      existing.push(q);
      idSet.add(q.id);
      addedCount++;
    } else {
      console.warn(`[WARN] ID重複のためスキップ: ${q.id}`);
    }
  }

  fs.writeFileSync(file, JSON.stringify(existing, null, 2), 'utf-8');
  console.log(`✓ 【${category}】 ${addedCount}問 追加完了！ 現在の総問題数: ${existing.length}問`);
}
