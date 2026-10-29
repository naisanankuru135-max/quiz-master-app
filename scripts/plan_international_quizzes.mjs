import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const factsPath = path.join(ROOT_DIR, 'data/new_facts_international.json');
const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

const sectionMap = new Map();
for (const f of facts) {
  if (!sectionMap.has(f.section)) {
    sectionMap.set(f.section, []);
  }
  sectionMap.get(f.section).push(f);
}

function getTargetCountPattern() {
  const pattern = [
    1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
    1, 2, 1, 2, 1, 2, 3, 4, 1, 2
  ];
  for (let i = pattern.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pattern[i], pattern[j]] = [pattern[j], pattern[i]];
  }
  return pattern;
}

const quizSpecs = [];
let specCounter = 1;

for (const [sectionTitle, secFacts] of sectionMap.entries()) {
  let fIdx = 0;
  const pattern = getTargetCountPattern();
  let pIdx = 0;

  while (fIdx < secFacts.length) {
    const remainingFacts = secFacts.length - fIdx;
    let targetCount = pattern[pIdx % pattern.length];
    pIdx++;

    // 末尾のファクト数に応じた配分調整
    if (remainingFacts === 4) {
      // 4個残っている場合は、たまに4個、基本は2個+2個
      targetCount = (Math.random() < 0.25) ? 4 : 2;
    } else if (remainingFacts === 3) {
      // 3個残っている場合は、たまに3個、基本は1個+2個
      targetCount = (Math.random() < 0.35) ? 3 : 1;
    } else if (remainingFacts === 2) {
      targetCount = 2;
    } else if (remainingFacts === 1) {
      targetCount = 1;
    } else if (remainingFacts - targetCount === 1) {
      // 次が1個余ってしまう場合、targetCountを調整
      if (targetCount === 1) targetCount = 2;
      else if (targetCount === 2) targetCount = 1;
      else if (targetCount === 3) targetCount = 2;
    }

    const assignedFacts = secFacts.slice(fIdx, fIdx + targetCount);
    fIdx += targetCount;

    quizSpecs.push({
      quizIndex: specCounter++,
      section: sectionTitle,
      targetCount,
      factCount: assignedFacts.length,
      factIds: assignedFacts.map(f => f.id),
    });
  }
}

console.log(`📋 国際クイズ最適化計画: 全 ${quizSpecs.length} 問 (元ファクト: ${facts.length} 件)`);
const countDist = { 1: 0, 2: 0, 3: 0, 4: 0 };
quizSpecs.forEach(s => countDist[s.targetCount]++);
console.log('📊 正解個数分布:');
console.log(`  正解 1 個: ${countDist[1]} 問 (${Math.round((countDist[1] / quizSpecs.length) * 100)}%)`);
console.log(`  正解 2 個: ${countDist[2]} 問 (${Math.round((countDist[2] / quizSpecs.length) * 100)}%)`);
console.log(`  正解 3 個: ${countDist[3]} 問 (${Math.round((countDist[3] / quizSpecs.length) * 100)}%)`);
console.log(`  正解 4 個: ${countDist[4]} 問 (${Math.round((countDist[4] / quizSpecs.length) * 100)}%)`);

const coveredFacts = new Set();
quizSpecs.forEach(s => s.factIds.forEach(id => coveredFacts.add(id)));
console.log(`ファクト網羅数: ${coveredFacts.size} / ${facts.length} (${(coveredFacts.size / facts.length * 100).toFixed(1)}%)`);
