import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const filePath = path.join(ROOT_DIR, 'sources/ニュース検定　社会環境.md');
const text = fs.readFileSync(filePath, 'utf8');
const lines = text.split('\n');

console.log('ファイル文字数:', text.length.toLocaleString(), '字');
console.log('総行数:', lines.length.toLocaleString(), '行');

// 大セクション（##）とサブセクション（###）の集計
const sections = [];
let currentSec = null;

lines.forEach((l, idx) => {
  if (l.startsWith('## ')) {
    currentSec = { title: l.replace('## ', '').trim(), subCount: 0 };
    sections.push(currentSec);
  } else if (l.startsWith('### ') && currentSec) {
    currentSec.subCount++;
  }
});

console.log('\n=== セクション構成 (全', sections.length, 'セクション) ===');
sections.forEach((s, i) => {
  console.log(`${i + 1}. ${s.title} (サブセクション: ${s.subCount} 個)`);
});
