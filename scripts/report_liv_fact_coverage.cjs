/**
 * 暮らしクイズのファクト別・正答カバレッジ詳細レポート。
 *
 * 各ファクトについて、
 * - そのファクトを coveredFactIds に含む問題
 * - その問題の正解選択肢との類似度
 * - その問題の誤答選択肢との類似度
 * を比較し、正解として使われていない疑いがあるファクトを洗い出す。
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT_DIR, 'data', 'facts_index_liv.json');
const QUIZ_FILE = path.join(ROOT_DIR, 'src', 'data', 'quizzes', 'livelihood.json');
const OUT_FILE = path.join(ROOT_DIR, 'data', 'reviews', 'liv_fact_answer_coverage.md');

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

function score(factText, optionText) {
  return Math.max(
    jaccard(words(factText), words(optionText)),
    jaccard(ngrams(factText, 3), ngrams(optionText, 3)),
    containment(ngrams(factText, 3), ngrams(optionText, 3)) * 0.85,
    bestSentenceMatch(factText, optionText)
  );
}

const quizById = new Map(quizzes.map(q => [q.id, q]));
const factById = new Map(facts.map(f => [f.id, f]));

const factRows = [];
for (const fact of facts) {
  const ownQuizzes = quizzes.filter(q => (q.coveredFactIds || []).includes(fact.id));
  const candidates = [];

  for (const q of ownQuizzes) {
    let bestCorrect = null;
    let bestWrong = null;
    for (const opt of q.options) {
      const s = score(fact.factText, opt.text);
      const item = { ...opt, score: s };
      if (q.correctAnswers.includes(opt.key)) {
        if (!bestCorrect || s > bestCorrect.score) bestCorrect = item;
      } else {
        if (!bestWrong || s > bestWrong.score) bestWrong = item;
      }
    }
    candidates.push({ q, bestCorrect, bestWrong });
  }

  // 全問題の正解選択肢も見て、別問題で正解として出ているかを確認
  let globalCorrect = null;
  let globalWrong = null;
  for (const q of quizzes) {
    for (const opt of q.options) {
      const s = score(fact.factText, opt.text);
      const item = { ...opt, score: s, quizId: q.id };
      if (q.correctAnswers.includes(opt.key)) {
        if (!globalCorrect || s > globalCorrect.score) globalCorrect = item;
      } else {
        if (!globalWrong || s > globalWrong.score) globalWrong = item;
      }
    }
  }

  const ownBestCorrect = candidates.reduce((m, c) => Math.max(m, c.bestCorrect?.score || 0), 0);
  const ownBestWrong = candidates.reduce((m, c) => Math.max(m, c.bestWrong?.score || 0), 0);
  const effective = Math.max(ownBestCorrect, globalCorrect?.score || 0);
  const suspicious = effective < 0.28 || (globalWrong?.score || 0) > effective + 0.08;

  factRows.push({
    fact,
    ownQuizzes,
    candidates,
    ownBestCorrect,
    ownBestWrong,
    globalCorrect,
    globalWrong,
    effective,
    suspicious,
  });
}

const suspicious = factRows.filter(r => r.suspicious);
const counts = {
  total: factRows.length,
  suspicious: suspicious.length,
  ownBelow025: factRows.filter(r => r.ownBestCorrect < 0.25).length,
  effectiveBelow028: factRows.filter(r => r.effective < 0.28).length,
};

const lines = [];
lines.push('# 暮らしクイズ ファクト別・正答カバレッジ詳細');
lines.push('');
lines.push(`- ファクト数: ${counts.total}`);
lines.push(`- 要確認候補: ${counts.suspicious}`);
lines.push(`- 宣言された問題内の正解一致 < 0.25: ${counts.ownBelow025}`);
lines.push(`- 別問題の正解も含めた実効一致 < 0.28: ${counts.effectiveBelow028}`);
lines.push('');
lines.push('> 類似度は文字3-gram・単語Jaccard・最長共通部分文字列から算出した目安です。');
lines.push('> 低いからといって即NGではないため、本文と選択肢を並べて目視確認してください。');
lines.push('');

for (const r of suspicious) {
  lines.push(`## ${r.fact.id}（${r.fact.section}）`);
  lines.push('');
  lines.push(`**ファクト:** ${r.fact.factText}`);
  lines.push('');
  lines.push(`- 宣言問題の正解一致: ${r.ownBestCorrect.toFixed(3)}`);
  lines.push(`- 宣言問題の誤答一致: ${r.ownBestWrong.toFixed(3)}`);
  lines.push(`- 全問題の正解一致: ${(r.globalCorrect?.score || 0).toFixed(3)}${r.globalCorrect ? `（${r.globalCorrect.quizId} ${r.globalCorrect.key}）` : ''}`);
  lines.push(`- 全問題の誤答一致: ${(r.globalWrong?.score || 0).toFixed(3)}${r.globalWrong ? `（${r.globalWrong.quizId} ${r.globalWrong.key}）` : ''}`);
  lines.push('');
  for (const c of r.candidates) {
    lines.push(`### ${c.q.id}「${c.q.question}」`);
    lines.push('');
    lines.push(`正解: ${c.q.correctAnswers.join(', ')}`);
    lines.push('');
    for (const opt of c.q.options) {
      const mark = c.q.correctAnswers.includes(opt.key) ? '✅' : '　';
      const s = score(r.fact.factText, opt.text);
      lines.push(`- ${mark} **${opt.key}**（${s.toFixed(3)}） ${opt.text}`);
    }
    lines.push('');
  }
}

lines.push('## 全ファクトの実効一致スコア下位50件');
lines.push('');
lines.push('| ID | 実効 | 宣言内正解 | 全正解 | 全誤答 | セクション | ファクト冒頭 |');
lines.push('|---|---:|---:|---:|---:|---|---|');
const lower = [...factRows].sort((a, b) => a.effective - b.effective).slice(0, 50);
for (const r of lower) {
  lines.push(`| ${r.fact.id} | ${r.effective.toFixed(3)} | ${r.ownBestCorrect.toFixed(3)} | ${(r.globalCorrect?.score || 0).toFixed(3)} | ${(r.globalWrong?.score || 0).toFixed(3)} | ${r.fact.section} | ${r.fact.factText.slice(0, 60).replace(/\|/g, '\\|')} |`);
}

fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
console.log(`レポート: ${OUT_FILE}`);
console.log(`ファクト数: ${counts.total} / 要確認候補: ${counts.suspicious}`);
console.log(`宣言内正解一致 < 0.25: ${counts.ownBelow025}`);
console.log(`実効一致 < 0.28: ${counts.effectiveBelow028}`);
