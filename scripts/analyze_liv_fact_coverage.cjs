/**
 * 暮らしクイズの「ファクトが実際に正解選択肢として使われているか」を簡易検証する。
 *
 * coveredFactIds は生成側の自己申告なので、
 * ファクト本文と各選択肢本文の類似度から、正解選択肢との対応が弱いファクトを炙り出す。
 *
 * 使い方:
 *   node scripts/analyze_liv_fact_coverage.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT_DIR, 'data', 'facts_index_liv.json');
const QUIZ_FILE = path.join(ROOT_DIR, 'src', 'data', 'quizzes', 'livelihood.json');

const facts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));
const quizzes = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf8'));

const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });

function normalize(text) {
  return String(text || '')
    .normalize('NFKC')
    .replace(/[「」『』（）()【】\[\]・、。，．,.\s]/g, '')
    .toLowerCase();
}

function words(text) {
  const set = new Set();
  for (const item of segmenter.segment(String(text || '').normalize('NFKC'))) {
    if (!item.isWordLike) continue;
    const w = item.segment.trim().toLowerCase();
    if (w.length < 2) continue;
    set.add(w);
  }
  return set;
}

function ngrams(text, n) {
  const s = normalize(text);
  const set = new Set();
  if (s.length < n) {
    if (s) set.add(s);
    return set;
  }
  for (let i = 0; i <= s.length - n; i++) set.add(s.slice(i, i + n));
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function containment(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / Math.min(a.size, b.size);
}

function longestCommonSubstring(a, b) {
  const s = normalize(a);
  const t = normalize(b);
  if (!s || !t) return 0;
  let best = 0;
  const dp = new Array(t.length + 1).fill(0);
  for (let i = 1; i <= s.length; i++) {
    let prev = 0;
    for (let j = 1; j <= t.length; j++) {
      const tmp = dp[j];
      if (s[i - 1] === t[j - 1]) {
        dp[j] = prev + 1;
        if (dp[j] > best) best = dp[j];
      } else {
        dp[j] = 0;
      }
      prev = tmp;
    }
  }
  return best;
}

function bestSentenceMatch(factText, optionText) {
  const sentences = String(factText || '')
    .split(/[。\n]/)
    .map(s => s.trim())
    .filter(Boolean);
  if (!sentences.length) return 0;
  let best = 0;
  for (const sentence of sentences) {
    const score = Math.max(
      jaccard(words(sentence), words(optionText)),
      jaccard(ngrams(sentence, 3), ngrams(optionText, 3)),
      longestCommonSubstring(sentence, optionText) / Math.max(1, normalize(optionText).length)
    );
    if (score > best) best = score;
  }
  return best;
}

function scoreFactAgainstOption(factText, optionText) {
  return Math.max(
    jaccard(words(factText), words(optionText)),
    jaccard(ngrams(factText, 3), ngrams(optionText, 3)),
    containment(ngrams(factText, 3), ngrams(optionText, 3)) * 0.85,
    bestSentenceMatch(factText, optionText)
  );
}

const allOptions = [];
for (const q of quizzes) {
  for (const option of q.options) {
    allOptions.push({
      quizId: q.id,
      section: q.sourceSection,
      question: q.question,
      key: option.key,
      text: option.text,
      isCorrect: q.correctAnswers.includes(option.key),
      coveredFactIds: q.coveredFactIds,
    });
  }
}

const results = facts.map(fact => {
  let bestCorrect = null;
  let bestWrong = null;
  for (const option of allOptions) {
    const score = scoreFactAgainstOption(fact.factText, option.text);
    if (option.isCorrect) {
      if (!bestCorrect || score > bestCorrect.score) bestCorrect = { ...option, score };
    } else {
      if (!bestWrong || score > bestWrong.score) bestWrong = { ...option, score };
    }
  }
  return {
    id: fact.id,
    section: fact.section,
    factText: fact.factText,
    bestCorrect,
    bestWrong,
  };
});

results.sort((a, b) => (a.bestCorrect?.score ?? 0) - (b.bestCorrect?.score ?? 0));

const thresholds = [0.15, 0.20, 0.25, 0.30, 0.35, 0.40];
console.log('=== 類似度しきい値ごとの件数 ===');
for (const t of thresholds) {
  const low = results.filter(r => (r.bestCorrect?.score ?? 0) < t);
  console.log(`bestCorrect < ${t.toFixed(2)}: ${low.length}件`);
}

const suspicious = results.filter(r => {
  const c = r.bestCorrect?.score ?? 0;
  const w = r.bestWrong?.score ?? 0;
  return c < 0.28 || (w > c + 0.05);
});

console.log(`\n=== 要確認候補: ${suspicious.length}件 ===`);
for (const r of suspicious) {
  const c = r.bestCorrect;
  const w = r.bestWrong;
  console.log(`\n[${r.id}] ${r.section}`);
  console.log(`FACT: ${r.factText}`);
  console.log(`正解候補: ${c ? `${c.quizId} ${c.key} score=${c.score.toFixed(3)}` : 'なし'}`);
  if (c) console.log(`  ${c.text}`);
  console.log(`誤答候補: ${w ? `${w.quizId} ${w.key} score=${w.score.toFixed(3)}` : 'なし'}`);
  if (w) console.log(`  ${w.text}`);
}

console.log('\n=== 全ファクトのベスト正解スコア下位30件 ===');
for (const r of results.slice(0, 30)) {
  const c = r.bestCorrect;
  console.log(`${r.id}\t${(c?.score ?? 0).toFixed(3)}\t${c?.quizId ?? '-'}\t${c?.key ?? '-'}\t${r.section}\t${r.factText.slice(0, 80)}`);
}
