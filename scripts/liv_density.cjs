const fs = require('fs');
const path = require('path');
const facts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'facts_index_liv.json'), 'utf8'));
const quizzes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'quizzes', 'livelihood.json'), 'utf8'));

const byFact = new Map();
for (const f of facts) byFact.set(f.section, (byFact.get(f.section) || 0) + 1);
const byQuiz = new Map();
for (const q of quizzes) byQuiz.set(q.sourceSection, (byQuiz.get(q.sourceSection) || 0) + 1);

const sections = [...new Set([...byFact.keys(), ...byQuiz.keys()])];
console.log('section\tfacts\tquizzes\tratio');
for (const s of sections) {
  const f = byFact.get(s) || 0;
  const q = byQuiz.get(s) || 0;
  console.log(`${s}\t${f}\t${q}\t${q ? (f / q).toFixed(2) : '-'}`);
}
