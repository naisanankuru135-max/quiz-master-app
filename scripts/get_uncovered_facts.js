import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(BASE_DIR, 'data', 'facts_index.json');
const OUTPUT_DIR = path.join(BASE_DIR, 'src', 'data', 'quizzes');

const allFacts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf-8'));

function getStatus(category, outputFile) {
  const facts = allFacts.filter(f => f.category === category);
  let quizzes = [];
  if (fs.existsSync(outputFile)) {
    try {
      quizzes = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
    } catch (e) {}
  }

  const coveredSet = new Set(quizzes.flatMap(q => q.coveredFactIds || []));
  const uncovered = facts.filter(f => !coveredSet.has(f.id));

  return {
    category,
    totalFacts: facts.length,
    coveredCount: coveredSet.size,
    coveragePercent: Math.round((coveredSet.size / facts.length) * 100),
    totalQuizzes: quizzes.length,
    uncovered
  };
}

const pol = getStatus('政治', path.join(OUTPUT_DIR, 'politics.json'));
const eco = getStatus('経済', path.join(OUTPUT_DIR, 'economics.json'));

console.log(`=== カバレッジ進捗 ===`);
console.log(`政治: ${pol.coveredCount} / ${pol.totalFacts} 論点 (${pol.coveragePercent}%) | 問題数: ${pol.totalQuizzes}`);
console.log(`経済: ${eco.coveredCount} / ${eco.totalFacts} 論点 (${eco.coveragePercent}%) | 問題数: ${eco.totalQuizzes}`);
console.log(`全体: ${pol.coveredCount + eco.coveredCount} / ${allFacts.length} 論点 (${Math.round(((pol.coveredCount + eco.coveredCount) / allFacts.length) * 100)}%) | 総問題数: ${pol.totalQuizzes + eco.totalQuizzes}`);

// 次に処理すべき未カバーのファクトをセクション別に表示
console.log(`\n--- 次の未出題論点（政治） ---`);
const nextPol = pol.uncovered.slice(0, 15);
nextPol.forEach(f => console.log(`[${f.id}] (${f.section}): ${f.factText}`));

if (pol.uncovered.length === 0) {
  console.log(`\n--- 次の未出題論点（経済） ---`);
  const nextEco = eco.uncovered.slice(0, 15);
  nextEco.forEach(f => console.log(`[${f.id}] (${f.section}): ${f.factText}`));
}
