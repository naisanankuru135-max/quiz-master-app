/**
 * 既存セクションに「追加問題」を生成して追記する。
 *
 * 使い方:
 *   node scripts/generate_liv_extra.cjs --section "年金制度" --facts LIV-100,LIV-101,... --count 2
 *
 * 特徴:
 * - 指定ファクトを必ず「正解選択肢」で言い切らせる
 * - 生成後に数値トークンの網羅率を機械チェックし、不足なら再生成
 * - 既存ステージングファイルの末尾に追記（IDはmerge時に振り直し）
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT, 'data', 'facts_index_liv.json');
const STAGING = path.join(ROOT, 'data', 'rebuilt_quizzes');
const REVIEW = path.join(ROOT, 'data', 'reviews');

const args = process.argv.slice(2);
const get = (flag, def = null) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};

const section = get('--section');
const factIds = String(get('--facts', '')).split(',').map(s => s.trim()).filter(Boolean);
const count = parseInt(get('--count', '2'), 10);
const model = get('--model', 'gemini-4-argon-high');
const dryRun = args.includes('--dry-run');

if (!section || !factIds.length) {
  console.error('--section と --facts は必須です。');
  process.exit(1);
}

const allFacts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));
const facts = factIds.map(id => allFacts.find(f => f.id === id)).filter(Boolean);
if (facts.length !== factIds.length) {
  console.error(`存在しないファクトIDがあります: ${factIds.filter(id => !facts.some(f => f.id === id)).join(', ')}`);
  process.exit(1);
}

function normalizeNumbers(text) {
  return String(text || '')
    .normalize('NFKC')
    .replace(/[「」『』（）()【】\[\]・、。，．,\s]/g, '')
    .replace(/％/g, '%');
}
const NUM_RE = /\d+(?:\.\d+)?(?:年度|年|月|日|時間|分|秒|%|割|兆|億|万|人|円|件|カ国|都道府県|府県|県|回|倍|階|歳|品目|種類|位|カ月|週間|日間)?/g;
const numbers = text => [...new Set([...normalizeNumbers(text).matchAll(NUM_RE)].map(m => m[0]))];

function coverageOfFact(fact, quizzes) {
  const texts = [];
  for (const q of quizzes) {
    for (const o of q.options) if (q.correctAnswers.includes(o.key)) texts.push(o.text);
  }
  const union = texts.join('\n');
  const nums = numbers(fact.factText);
  const numCover = nums.length ? nums.filter(n => normalizeNumbers(union).includes(n)).length / nums.length : 1;
  const words = [...new Set([...String(fact.factText).normalize('NFKC').matchAll(/[一-龥]{2,}|[ァ-ヶー]{3,}|[A-Za-z]{3,}/g)].map(m => m[0]))];
  const wordCover = words.length ? words.filter(w => union.includes(w)).length / words.length : 1;
  return { numCover, wordCover };
}

function buildPrompt(missingHint = '') {
  const factsText = facts.map(f => `[${f.id}] ${f.factText}`).join('\n');
  return `あなたは日本の公務員試験・ニュース検定の専門作問委員です。
以下の【ファクト】だけを根拠に、4肢選択式のクイズを【${count}問】作ってください。

【ファクト】
${factsText}

【最重要ルール】
- 上記ファクトの内容は、必ずいずれかの問題の「正解選択肢」として言い切ってください。誤答選択肢にしか出さないファクトを作ってはいけません。
- 正解選択肢では、ファクトの数値・年号・固有名詞・対象範囲を省略しないでください。
- 1つのファクトを複数の正解選択肢に分割しても構いませんが、その場合も内容を落とさないでください。

【正解数の配分】
${Array.from({ length: count }, (_, i) => `第${i + 1}問: 正解${[2, 2, 3, 3][i % 4]}個`).join('\n')}

【その他のルール】
1. 各問題は選択肢A〜Dの4つ。正解は指定された個数だけ。
2. 誤答は、数値・年号・主語・制度名・例外・対象範囲のすり替えなど、引っかかりのある内容にする。明らかな嘘や幼稚な選択肢は禁止。
3. 解説はA〜Dすべてに「【○ 正しい】」「【× 誤り】」を付け、理由と正しい事実を具体的に書く。
4. 正解選択肢どうしで同じ内容を重複させない。各正解選択肢は、それぞれ別のファクトに対応させる。
5. 選択肢は単体で意味が通る文にし、「同法」「これに対し」など文脈依存の言葉を使わない。
6. 問題文は「〜に関する記述として、適切なものをすべて選べ。」のような自然な文。
7. 総合解説・各解説では選択肢キー（A/B/C/D）に言及しない。
8. 出力はJSON配列のみ。コードフェンスや説明文は禁止。
${missingHint ? `\n【前回の不足】\n${missingHint}\n上記ファクトは必ず正解選択肢で言い切ってください。\n` : ''}
【出力形式】
[
  {
    "category": "暮らし",
    "sourceFile": "ニュース検定　暮らし.md",
    "sourceSection": "${section}",
    "coveredFactIds": ["${facts[0].id}"],
    "question": "〜に関する記述として、適切なものをすべて選べ。",
    "options": [
      { "key": "A", "text": "選択肢A" },
      { "key": "B", "text": "選択肢B" },
      { "key": "C", "text": "選択肢C" },
      { "key": "D", "text": "選択肢D" }
    ],
    "correctAnswers": ["A", "C"],
    "explanations": {
      "overall": "問題全体の解説",
      "details": {
        "A": "【○ 正しい】解説",
        "B": "【× 誤り】解説",
        "C": "【○ 正しい】解説",
        "D": "【× 誤り】解説"
      }
    }
  }
]`;
}

function callAgy(prompt) {
  const agyArgs = ['-p', prompt, '--output-format', 'text'];
  if (model) agyArgs.push('--model', model);
  return execFileSync('agy', agyArgs, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 600000 });
}

function extractJson(text) {
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  let c = fenced ? fenced[1] : text;
  const s = c.indexOf('[');
  const e = c.lastIndexOf(']');
  if (s !== -1 && e > s) c = c.slice(s, e + 1);
  return JSON.parse(c);
}

function normalize(q) {
  const issues = [];
  const options = Array.isArray(q.options) ? q.options : [];
  if (options.length !== 4) issues.push('選択肢が4つではない');
  if (options.map(o => o.key).join('') !== 'ABCD') issues.push('選択肢キーがABCDではない');
  if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length < 1 || q.correctAnswers.length > 4) issues.push('正解数が不正');
  for (const k of q.correctAnswers || []) if (!['A', 'B', 'C', 'D'].includes(k)) issues.push(`不正キー${k}`);
  const texts = options.map(o => String(o.text || '').trim());
  if (texts.some(t => !t)) issues.push('空の選択肢');
  if (new Set(texts).size !== texts.length) issues.push('重複選択肢');
  for (const k of ['A', 'B', 'C', 'D']) {
    const d = String(q.explanations?.details?.[k] || '');
    if (!d) issues.push(`${k}の解説なし`);
    else if (q.correctAnswers.includes(k) && !d.includes('○')) issues.push(`${k}は正解だが○がない`);
    else if (!q.correctAnswers.includes(k) && !d.includes('×')) issues.push(`${k}は誤答だが×がない`);
  }
  if (!q.explanations?.overall) issues.push('総合解説なし');
  if (!String(q.question || '').trim()) issues.push('問題文なし');

  // 正解選択肢どうしの重複をチェック
  const correctTexts = options.filter(o => (q.correctAnswers || []).includes(o.key)).map(o => String(o.text || ''));
  const bigrams = t => {
    const s = String(t).normalize('NFKC').replace(/[\s、。，．「」『』（）()]/g, '');
    const set = new Set();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  for (let i = 0; i < correctTexts.length; i++) {
    for (let j = i + 1; j < correctTexts.length; j++) {
      const a = bigrams(correctTexts[i]);
      const b = bigrams(correctTexts[j]);
      let inter = 0;
      for (const x of a) if (b.has(x)) inter++;
      const jac = inter / Math.max(1, a.size + b.size - inter);
      if (jac > 0.7) issues.push('正解選択肢どうしがほぼ同一');
    }
  }
  return {
    issues,
    value: {
      category: '暮らし',
      sourceFile: 'ニュース検定　暮らし.md',
      sourceSection: section,
      coveredFactIds: [...new Set((q.coveredFactIds || []).filter(id => factIds.includes(id)))],
      question: String(q.question || '').trim(),
      options: options.map((o, i) => ({ key: ['A', 'B', 'C', 'D'][i], text: texts[i] })),
      correctAnswers: [...q.correctAnswers].sort(),
      explanations: {
        overall: String(q.explanations?.overall || '').trim(),
        details: { A: q.explanations.details.A, B: q.explanations.details.B, C: q.explanations.details.C, D: q.explanations.details.D },
      },
    },
  };
}

let best = null;
for (let attempt = 1; attempt <= 3; attempt++) {
  console.log(`作問リクエスト ${attempt}/3 ...`);
  let missingHint = '';
  if (best) {
    const missing = facts.filter(f => {
      const c = coverageOfFact(f, best);
      return c.numCover < 0.8 || c.wordCover < 0.4;
    });
    missingHint = missing.map(f => `- [${f.id}] ${f.factText}`).join('\n');
  }
  try {
    const raw = callAgy(buildPrompt(missingHint));
    const parsed = extractJson(raw);
    const normalized = [];
    const issues = [];
    parsed.slice(0, count).forEach((q, i) => {
      const r = normalize(q);
      r.issues.forEach(x => issues.push(`第${i + 1}問: ${x}`));
      if (r.value) normalized.push(r.value);
    });
    if (parsed.length !== count) issues.push(`問題数が${count}ではない(${parsed.length})`);
    if (issues.length) {
      console.warn(`  [検証NG] ${issues.join(' / ')}`);
      continue;
    }
    const weak = facts.map(f => ({ f, c: coverageOfFact(f, normalized) }))
      .filter(x => x.c.numCover < 0.8 || x.c.wordCover < 0.4);
    console.log(`  カバレッジ: ${facts.length - weak.length}/${facts.length}`);
    if (weak.length) {
      console.warn(`  正解で言い切れていないファクト: ${weak.map(w => w.f.id).join(', ')}`);
    }
    const candidate = { quizzes: normalized, weak };
    const score = weak.length;
    if (!best || score < best.weak.length) best = candidate;
    if (!weak.length) break;
  } catch (err) {
    console.warn(`  [生成NG] ${err.message}`);
  }
}

if (!best) {
  console.error('生成に失敗しました。');
  process.exit(1);
}

if (dryRun) {
  console.log(JSON.stringify(best.quizzes, null, 2));
  process.exit(0);
}

// 追記先: 同セクションで最も問題数が多いステージングファイル
const files = fs.readdirSync(STAGING)
  .filter(n => /^liv_.*\.json$/i.test(n))
  .filter(n => !/_chunk\d+-\d+\.json$/i.test(n));
let target = null;
for (const f of files) {
  const full = path.join(STAGING, f);
  const list = JSON.parse(fs.readFileSync(full, 'utf8'));
  if (list[0]?.sourceSection !== section) continue;
  if (!target || list.length > target.list.length) target = { full, list };
}
if (!target) {
  console.error(`セクション ${section} のステージングファイルがありません。`);
  process.exit(1);
}

const existing = new Set(target.list.map(q => `${q.question}::${q.options.map(o => o.text).join('|')}`));
let added = 0;
for (const q of best.quizzes) {
  const key = `${q.question}::${q.options.map(o => o.text).join('|')}`;
  if (existing.has(key)) continue;
  target.list.push(q);
  existing.add(key);
  added++;
}

fs.writeFileSync(target.full, JSON.stringify(target.list, null, 2) + '\n', 'utf8');

const reviewLines = [
  `# 追加作問: ${section}`,
  '',
  `- 追加: ${added}問`,
  `- 対象ファクト: ${factIds.join(', ')}`,
  `- 生成時の未カバー: ${best.weak.length ? best.weak.map(w => w.f.id).join(', ') : 'なし'}`,
  '',
];
for (const q of best.quizzes) {
  reviewLines.push(`## ${q.question}`);
  reviewLines.push('');
  reviewLines.push(`coveredFactIds: ${q.coveredFactIds.join(', ')} / 正解: ${q.correctAnswers.join('')}`);
  reviewLines.push('');
  for (const o of q.options) reviewLines.push(`- ${q.correctAnswers.includes(o.key) ? '○' : '×'} **${o.key}**: ${o.text}`);
  reviewLines.push('');
}
const safe = section.replace(/[\\/:*?"<>|]/g, '_');
fs.writeFileSync(path.join(REVIEW, `liv_extra_${safe}.md`), reviewLines.join('\n'), 'utf8');

console.log(`追加: ${added}問 → ${target.full}`);
