/**
 * 1つの正解選択肢に何ファクト分の内容が詰め込まれているかを集計する。
 * 詰め込み度が高い（=1問あたりの情報量が多く、問題数が不足気味）箇所を抽出。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const facts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'facts_index_liv.json'), 'utf8'));
const quizzes = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'quizzes', 'livelihood.json'), 'utf8'));

function keywords(text) {
  const s = String(text || '').normalize('NFKC');
  const set = new Set();
  for (const m of s.matchAll(/[一-龥]{2,}|[ァ-ヶー]{3,}|[A-Za-z]{3,}/g)) set.add(m[0]);
  return set;
}

const opts = [];
for (const q of quizzes) {
  for (const o of q.options) {
    if (!q.correctAnswers.includes(o.key)) continue;
    opts.push({ quizId: q.id, section: q.sourceSection, key: o.key, text: o.text, words: keywords(o.text) });
  }
}

// 各ファクトを、宣言問題の正解選択肢のうち最も語が重なるものに割り当てる
const buckets = new Map();
for (const f of facts) {
  const pool = opts.filter(o => {
    const q = quizzes.find(x => x.id === o.quizId);
    return q && (q.coveredFactIds || []).includes(f.id);
  });
  if (!pool.length) continue;
  const fw = keywords(f.factText);
  let best = null;
  for (const o of pool) {
    let hit = 0;
    for (const w of fw) if (o.words.has(w)) hit++;
    const score = hit / Math.max(1, fw.size);
    if (!best || score > best.score) best = { o, score };
  }
  const k = `${best.o.quizId}:${best.o.key}`;
  if (!buckets.has(k)) buckets.set(k, { opt: best.o, facts: [] });
  buckets.get(k).facts.push({ id: f.id, score: best.score, section: f.section });
}

const rows = [...buckets.values()].sort((a, b) => b.facts.length - a.facts.length);
console.log('quizId\tkey\tfacts\tavgScore\tsection\ttext');
for (const r of rows.slice(0, 40)) {
  const avg = r.facts.reduce((s, x) => s + x.score, 0) / r.facts.length;
  console.log(`${r.opt.quizId}\t${r.opt.key}\t${r.facts.length}\t${avg.toFixed(2)}\t${r.opt.section}\t${r.opt.text.slice(0, 60)}`);
}

console.log('\n--- 詰め込み上位のファクト候補 ---');
const candidates = rows.filter(r => r.facts.length >= 3).flatMap(r => r.facts.map(f => f.id));
console.log([...new Set(candidates)].join(','));
