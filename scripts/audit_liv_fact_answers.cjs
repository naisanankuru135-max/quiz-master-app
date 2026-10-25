/**
 * 暮らしクイズの「ファクトが正解選択肢で明示されているか」を監査する。
 *
 * 類似度ではなく、
 *  - ファクトに含まれる数値トークンが正解選択肢に含まれるか
 *  - ファクトの主要語（2文字以上）のうち何割が正解選択肢に含まれるか
 * を見て、正解選択肢で言い切れていないファクトを洗い出す。
 *
 * 使い方:
 *   node scripts/audit_liv_fact_answers.cjs            # レポート生成
 *   node scripts/audit_liv_fact_answers.cjs --list     # 未カバー候補のIDのみ
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT_DIR, 'data', 'facts_index_liv.json');
const QUIZ_FILE = path.join(ROOT_DIR, 'src', 'data', 'quizzes', 'livelihood.json');
const OUT_FILE = path.join(ROOT_DIR, 'data', 'reviews', 'liv_fact_answer_audit.md');
const OUT_JSON = path.join(ROOT_DIR, 'data', 'reviews', 'liv_fact_answer_audit.json');

const facts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));
const quizzes = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf8'));

const STOP = new Set(
  'こと もの ため よう こちら それ これ 場合 以上 以下 現在 今回 今後 一方 また さらに そして しかし ところ について による として など という ことで されて している している。 する した あり ある いる なる される れる られ および または 及び 又は 年度 年 月 日 割 人 円 万 億 兆 %'.split(/\s+/)
);

function normalize(text) {
  return String(text || '')
    .normalize('NFKC')
    .replace(/[「」『』（）()【】\[\]・、。，．,.!?！？:：;；\s]/g, '')
    .toLowerCase();
}

const NUM_RE = /\d+(?:\.\d+)?(?:年度|年|月|日|時間|分|秒|%|％|割|兆|億|万|人|円|件|カ国|都道府県|府県|県|回|倍|階|歳|品目|種類|位|カ月|週間|日間)?/g;

function numbers(text) {
  const set = new Set();
  for (const m of normalizeNumbers(text).matchAll(NUM_RE)) set.add(m[0]);
  return set;
}

function normalizeNumbers(text) {
  return String(text || '')
    .normalize('NFKC')
    .replace(/[「」『』（）()【】\[\]・。，．,\s]/g, '')
    .replace(/、/g, '|')
    .replace(/％/g, '%');
}

/** 漢字・カタカナ・英字の連続を語として抽出（簡易） */
function keywords(text) {
  const s = String(text || '').normalize('NFKC');
  const set = new Set();
  const re = /[一-龥]{2,}|[ァ-ヶー]{3,}|[A-Za-z]{3,}/g;
  for (const m of s.matchAll(re)) {
    const w = m[0];
    if (STOP.has(w)) continue;
    set.add(w);
  }
  return set;
}

function ratio(part, whole) {
  if (!whole.size) return 1;
  let hit = 0;
  for (const x of part) if (whole.has(x)) hit++;
  return hit / part.size;
}

function containsToken(haystack, token) {
  return haystack.includes(token);
}

const correctOptions = [];
for (const q of quizzes) {
  for (const opt of q.options) {
    if (!q.correctAnswers.includes(opt.key)) continue;
    correctOptions.push({
      quizId: q.id,
      section: q.sourceSection,
      question: q.question,
      key: opt.key,
      text: opt.text,
      norm: normalizeNumbers(opt.text),
      keywords: keywords(opt.text),
      coveredFactIds: q.coveredFactIds,
    });
  }
}

const rows = facts.map(fact => {
  const factNums = numbers(fact.factText);
  const factWords = keywords(fact.factText);
  // そのファクトを coveredFactIds に含む問題の「正解選択肢すべて」を結合して見る。
  // 長いファクトは複数の正解選択肢にまたがって表現されることがあるため。
  const declared = correctOptions.filter(o => (o.coveredFactIds || []).includes(fact.id));
  const pool = declared.length ? declared : correctOptions;
  const unionText = pool.map(o => o.text).join('\n');
  const unionNorm = normalizeNumbers(unionText);
  const numCover = factNums.size
    ? [...factNums].filter(n => containsToken(unionNorm, n)).length / factNums.size
    : 1;
  const wordCover = ratio(factWords, new Set([...factWords].filter(w => unionText.includes(w))));
  const best = {
    quizId: pool[0]?.quizId ?? null,
    key: pool.map(o => o.key).join(''),
    text: unionText,
    norm: unionNorm,
    score: numCover * 0.6 + wordCover * 0.4,
    numCover,
    wordCover,
    factNums,
    factWords,
  };
  const inDeclared = quizzes.filter(q => (q.coveredFactIds || []).includes(fact.id)).length;
  return { fact, best, inDeclared };
});

// 未カバー判定: 数値が8割未満、または主要語カバーが4割未満
const uncovered = rows.filter(r => !r.best || r.best.numCover < 0.8 || r.best.wordCover < 0.4);

if (process.argv.includes('--list')) {
  console.log(uncovered.map(r => r.fact.id).join(','));
  process.exit(0);
}

rows.sort((a, b) => (a.best?.score ?? 0) - (b.best?.score ?? 0));

const lines = [];
lines.push('# 暮らしクイズ 正答明示監査');
lines.push('');
lines.push(`- ファクト数: ${facts.length}`);
lines.push(`- 正解選択肢の総数: ${correctOptions.length}`);
lines.push(`- 正答明示が弱いファクト: ${uncovered.length}`);
lines.push('');
lines.push('判定: ファクト内の数値トークンの8割以上、かつ主要語の4割以上が同一の正解選択肢に含まれること。');
lines.push('数値のないファクトは主要語のみで判定。');
lines.push('');
lines.push('## 未カバー候補');
lines.push('');
lines.push('| ID | セクション | 数値 | 主要語 | 最良の正解選択肢 | ファクト |');
lines.push('|---|---|---:|---:|---|---|');
for (const r of uncovered) {
  const b = r.best;
  lines.push(`| ${r.fact.id} | ${r.fact.section} | ${b ? b.numCover.toFixed(2) : '-'} | ${b ? b.wordCover.toFixed(2) : '-'} | ${b ? `${b.quizId} ${b.key}` : '-'} | ${r.fact.factText.replace(/\|/g, '\\|').slice(0, 70)} |`);
}
lines.push('');
lines.push('## 全ファクト明細（スコア昇順）');
lines.push('');
for (const r of rows) {
  const b = r.best || {};
  lines.push(`### ${r.fact.id}（${r.fact.section}） 数値=${(b.numCover ?? 0).toFixed(2)} 主要語=${(b.wordCover ?? 0).toFixed(2)}`);
  lines.push('');
  lines.push(`**ファクト:** ${r.fact.factText}`);
  lines.push('');
  if (b.text) {
    lines.push(`**最良の正解選択肢:** ${b.quizId} ${b.key}`);
    lines.push('');
    lines.push(`> ${b.text}`);
    lines.push('');
  }
  const missing = [...(b.factNums || [])].filter(n => !String(b.norm || '').includes(n));
  const missingWords = [...(b.factWords || [])].filter(w => !String(b.text || '').includes(w));
  if (missing.length) lines.push(`- 選択肢にない数値: ${missing.join(', ')}`);
  if (missingWords.length) lines.push(`- 選択肢にない主要語: ${missingWords.slice(0, 12).join(', ')}`);
  lines.push('');
}

fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
fs.writeFileSync(OUT_JSON, JSON.stringify(rows.map(r => ({
  id: r.fact.id,
  section: r.fact.section,
  factText: r.fact.factText,
  numCover: r.best?.numCover ?? 0,
  wordCover: r.best?.wordCover ?? 0,
  bestQuiz: r.best?.quizId ?? null,
  bestKey: r.best?.key ?? null,
  bestText: r.best?.text ?? null,
  missingNumbers: [...(r.best?.factNums || [])].filter(n => !String(r.best?.norm || '').includes(n)),
  missingWords: [...(r.best?.factWords || [])].filter(w => !String(r.best?.text || '').includes(w)),
})), null, 2), 'utf8');

console.log('============================================================');
console.log(`ファクト数: ${facts.length}`);
console.log(`正解選択肢の総数: ${correctOptions.length}`);
console.log(`正答明示が弱いファクト: ${uncovered.length}`);
console.log(`レポート: ${OUT_FILE}`);
console.log('============================================================');
for (const r of uncovered) {
  console.log(`${r.fact.id}\t${(r.best?.numCover ?? 0).toFixed(2)}\t${(r.best?.wordCover ?? 0).toFixed(2)}\t${r.best?.quizId ?? '-'} ${r.best?.key ?? '-'}\t${r.fact.section}\t${r.fact.factText.slice(0, 50)}`);
}
