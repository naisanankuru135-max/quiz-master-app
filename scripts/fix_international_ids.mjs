import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const jsonPath = path.join(ROOT_DIR, 'data/new_facts_international.json');
const facts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const fixedFacts = facts.map((fact, index) => {
  const idNum = (index + 1).toString().padStart(3, '0');
  const { id, _taskKey, ...rest } = fact;
  return {
    id: `INT-${idNum}`,
    ...rest,
  };
});

fs.writeFileSync(jsonPath, JSON.stringify(fixedFacts, null, 2), 'utf8');
console.log(`💾 JSONのIDを INT-001 〜 INT-${fixedFacts.length.toString().padStart(3, '0')} に正常付与しました。`);

// Markdownも再生成
const mdLines = [
  `# ニュース検定 国際分野 新FactID一覧（INT-001 〜 INT-${fixedFacts.length.toString().padStart(3, '0')}）`,
  `\n作成日時: ${new Date().toLocaleString('ja-JP')}`,
  `総ファクト数: ${fixedFacts.length} 件\n`,
];

let currentSection = '';
for (const f of fixedFacts) {
  if (f.section !== currentSection) {
    currentSection = f.section;
    mdLines.push(`\n## ${currentSection}\n`);
  }
  mdLines.push(`- **[${f.id}]** ${f.factText} （${f.charCount}文字）`);
}

const mdPath = path.join(ROOT_DIR, 'data/new_facts_international.md');
fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf8');
console.log(`📄 Markdown再生成完了: ${mdPath}`);
