import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SRC_DIR = path.join(ROOT_DIR, 'src');

function searchFiles(dir, matchers) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'quizzes_backup_old120') {
        searchFiles(fullPath, matchers);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.json') || entry.name.endsWith('.html'))) {
      if (entry.name.endsWith('.json') && (fullPath.includes('quizzes') || fullPath.includes('facts_index'))) continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        for (const { label, regex } of matchers) {
          if (regex.test(line)) {
            console.log(`[${label}] ${path.relative(ROOT_DIR, fullPath)}:${idx + 1} -> ${line.trim()}`);
          }
        }
      });
    }
  }
}

const matchers = [
  { label: '旧問題数111', regex: /\b111\b/ },
  { label: '旧総問題数435', regex: /\b435\b/ },
  { label: '旧ファクト数180/199', regex: /\b(180|199)\b/ },
  { label: '旧総ファクト数858', regex: /\b858\b/ },
  { label: '政治/ファクト件数', regex: /政治.*(?:問|件|ファクト)/ },
  { label: 'クイズ/ファクト固定数', regex: /(?:全|計)?\s*\d+\s*(?:問|件|項目)/ },
];

console.log('--- 検索開始 ---');
searchFiles(SRC_DIR, matchers);
console.log('--- 検索完了 ---');
