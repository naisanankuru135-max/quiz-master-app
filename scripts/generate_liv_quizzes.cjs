/**
 * 暮らし（LIV）クイズ生成スクリプト
 *
 * 使い方:
 *   node scripts/generate_liv_quizzes.cjs --section-index 1 --from-chunk 1 --to-chunk 1
 *   node scripts/generate_liv_quizzes.cjs --section-index 1
 *   node scripts/generate_liv_quizzes.cjs --section "人口・少子高齢化" --from-chunk 2 --to-chunk 6
 *
 * 特徴:
 * - ファクトを12件前後のチャンクに分け、1チャンクにつき4問を生成
 * - 4問の正解数を「1個・2個・3個・4個」に1問ずつ配分
 * - 選択肢A〜Dをシャッフルし、正解キーの偏りも調整
 * - coveredFactIds でファクトのカバレッジを検証
 * - 未カバーのファクトがあれば補完問題を追加生成
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT_DIR, 'data', 'facts_index_liv.json');
const STAGING_DIR = path.join(ROOT_DIR, 'data', 'rebuilt_quizzes');
const REVIEW_DIR = path.join(ROOT_DIR, 'data', 'reviews');

const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const sectionArg = getArg('--section', null);
const sectionIndex = parseInt(getArg('--section-index', '0'), 10);
const chunkSize = parseInt(getArg('--chunk-size', '12'), 10);
const questionsPerChunk = parseInt(getArg('--questions-per-chunk', '4'), 10);
const fromChunkArg = parseInt(getArg('--from-chunk', '1'), 10);
const model = getArg('--model', 'gemini-4-argon-high');

if (!fs.existsSync(STAGING_DIR)) fs.mkdirSync(STAGING_DIR, { recursive: true });
if (!fs.existsSync(REVIEW_DIR)) fs.mkdirSync(REVIEW_DIR, { recursive: true });

const allFacts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));
const sectionNames = [...new Set(allFacts.map(f => f.section))];

let targetSection = sectionArg;
if (!targetSection && sectionIndex > 0) {
  targetSection = sectionNames[sectionIndex - 1] || null;
}

if (!targetSection) {
  console.error('セクションを指定してください。');
  console.error('例: node scripts/generate_liv_quizzes.cjs --section-index 1');
  console.error('\n利用可能なセクション:');
  sectionNames.forEach((s, i) => console.error(`  ${i + 1}. ${s}`));
  process.exit(1);
}

const sectionFacts = allFacts.filter(f => f.section === targetSection);
if (!sectionFacts.length) {
  console.error(`セクションが見つかりません: ${targetSection}`);
  process.exit(1);
}

const sectionPosition = Math.max(0, sectionNames.indexOf(targetSection));

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

const chunks = chunkArray(sectionFacts, chunkSize);
const fromChunk = Math.max(1, Math.min(fromChunkArg, chunks.length));
const toChunk = Math.max(
  fromChunk,
  Math.min(parseInt(getArg('--to-chunk', String(chunks.length)), 10), chunks.length)
);

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function targetCountsFor(count, startOffset = 0) {
  const base = [1, 2, 3, 4];
  return Array.from({ length: count }, (_, i) => base[(startOffset + i) % base.length]);
}

// 小さいセクションで4問も作ると同じファクトの繰り返しになるため、
// ファクト数に応じて1〜4問に調整する。
function questionsForChunk(factCount, maxQuestions) {
  if (factCount <= 3) return 1;
  if (factCount <= 5) return 2;
  if (factCount <= 8) return 3;
  return maxQuestions;
}

let questionOffset = sectionPosition % 4;

function buildPrompt(section, facts, targetCounts) {
  const factsText = facts.map(f => `[${f.id}] ${f.factText}`).join('\n');
  const countText = targetCounts
    .map((n, i) => `第${i + 1}問: 正解${n}個`)
    .join('\n');

  return `あなたは日本の公務員試験・ニュース検定の専門作問委員です。
以下の【提供ファクト】だけを根拠に、4肢選択式のクイズを【${targetCounts.length}問】作ってください。

【提供ファクト】
${factsText}

【正解数の配分】
${countText}
※ ${targetCounts.length}問全体で、正解1個・2個・3個・4個がそれぞれ指定数になるようにしてください。

【必須ルール】
1. 各問題は選択肢A〜Dの4つ。正解は指定された個数だけにしてください。
2. 提供されたファクトをすべて、いずれかの問題の選択肢（正解・誤答の両方）または解説で1回以上使ってください。できるだけ正解選択肢の根拠として使ってください。
3. 各問題の coveredFactIds には、その問題で実際に使ったファクトIDをすべて記録してください。提供ファクト以外のIDは書かないでください。
4. 誤答は、数値・年号・主語・制度名・例外・対象範囲のすり替えなど、引っかかりのある内容にしてください。明らかな嘘や幼稚な選択肢は禁止です。
5. 解説は A〜D の全選択肢について、「【○ 正しい】」「【× 誤り】」を付け、理由と正しい事実を具体的に書いてください。
6. 選択肢は単体で意味が通る文にし、「同法」「これに対し」「同国」など文脈依存の言葉を使わないでください。
7. 問題文は「〜に関する記述として、適切なものをすべて選べ。」のような自然な文にしてください。
8. 総合解説および各選択肢の解説本文では、選択肢キー（A/B/C/D）に言及しないでください。正解の位置は後でシャッフルされるためです。
9. 出力はJSON配列のみ。Markdownの説明文やコードフェンス以外の文章は書かないでください。

【出力形式】
[
  {
    "category": "暮らし",
    "sourceFile": "ニュース検定　暮らし.md",
    "sourceSection": "${section}",
    "coveredFactIds": ["LIV-001", "LIV-002"],
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

  return execFileSync('agy', agyArgs, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    timeout: 420000
  });
}

function extractJson(text) {
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  let candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('[');
  const end = candidate.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    candidate = candidate.slice(start, end + 1);
  }
  return JSON.parse(candidate);
}

function normalizeQuestion(q, section, chunkFactIds) {
  const issues = [];
  if (!q || typeof q !== 'object') return { issues: ['問題がオブジェクトではありません'] };

  const options = Array.isArray(q.options) ? q.options : [];
  if (options.length !== 4) issues.push(`選択肢が4つではありません (${options.length})`);

  const keys = options.map(o => o.key).join('');
  if (keys !== 'ABCD') issues.push(`選択肢キーがABCDではありません (${keys})`);

  const correctAnswers = Array.isArray(q.correctAnswers) ? q.correctAnswers : [];
  if (correctAnswers.length < 1 || correctAnswers.length > 4) {
    issues.push(`正解数が1〜4の範囲外です (${correctAnswers.length})`);
  }
  for (const key of correctAnswers) {
    if (!['A', 'B', 'C', 'D'].includes(key)) issues.push(`不正な正解キー: ${key}`);
    if (!options.some(o => o.key === key)) issues.push(`正解キー${key}の選択肢がありません`);
  }

  const texts = options.map(o => String(o.text || '').trim());
  if (texts.some(t => !t)) issues.push('空の選択肢があります');
  if (new Set(texts).size !== texts.length) issues.push('同一問題内に重複した選択肢があります');

  const details = q.explanations?.details || {};
  for (const key of ['A', 'B', 'C', 'D']) {
    const detail = String(details[key] || '').trim();
    if (!detail) {
      issues.push(`選択肢${key}の解説がありません`);
      continue;
    }
    const isCorrect = correctAnswers.includes(key);
    if (isCorrect && !detail.includes('○')) {
      issues.push(`正解の選択肢${key}の解説に「○」がありません`);
    }
    if (!isCorrect && !detail.includes('×')) {
      issues.push(`誤答の選択肢${key}の解説に「×」がありません`);
    }
  }
  if (!q.explanations?.overall || !String(q.explanations.overall).trim()) {
    issues.push('問題全体の解説がありません');
  }

  let covered = Array.isArray(q.coveredFactIds) ? q.coveredFactIds : [];
  covered = [...new Set(covered)].filter(id => chunkFactIds.includes(id));
  if (!covered.length) issues.push('coveredFactIdsが空です');

  return {
    issues,
    value: {
      category: '暮らし',
      sourceFile: 'ニュース検定　暮らし.md',
      sourceSection: section,
      coveredFactIds: covered,
      question: String(q.question || '').trim(),
      options: options.map((o, i) => ({ key: ['A', 'B', 'C', 'D'][i], text: texts[i] })),
      correctAnswers: [...correctAnswers].sort(),
      explanations: {
        overall: String(q.explanations?.overall || '').trim(),
        details: {
          A: String(details.A || '').trim(),
          B: String(details.B || '').trim(),
          C: String(details.C || '').trim(),
          D: String(details.D || '').trim()
        }
      }
    }
  };
}

function validateBatch(quizzes, targetCounts, section, chunkFactIds) {
  const issues = [];
  if (!Array.isArray(quizzes)) return { issues: ['JSONが配列ではありません'] };
  if (quizzes.length !== targetCounts.length) {
    issues.push(`問題数が${targetCounts.length}問ではありません (${quizzes.length}問)`);
  }

  const normalized = [];
  quizzes.slice(0, targetCounts.length).forEach((q, i) => {
    const result = normalizeQuestion(q, section, chunkFactIds);
    result.issues.forEach(issue => issues.push(`第${i + 1}問: ${issue}`));
    if (result.value) normalized.push(result.value);
  });

  const actualCounts = normalized.map(q => q.correctAnswers.length).sort((a, b) => a - b);
  const expectedCounts = [...targetCounts].sort((a, b) => a - b);
  if (JSON.stringify(actualCounts) !== JSON.stringify(expectedCounts)) {
    issues.push(`正解数の配分が違います: 実際=[${actualCounts.join(',')}] 期待=[${expectedCounts.join(',')}]`);
  }

  return { issues, quizzes: normalized };
}

function stripKeyClaims(text) {
  const sentences = String(text || '')
    .split('。')
    .map(s => s.trim())
    .filter(Boolean);
  const filtered = sentences.filter(sentence => {
    const hasKey = /[ABCD]/.test(sentence);
    if (!hasKey) return true;
    return !/(正しい|正解|誤り|適切|不正解)/.test(sentence);
  });
  let clean = filtered.join('。');
  if (clean && !clean.endsWith('。')) clean += '。';
  if (!clean) clean = '各選択肢の正誤と根拠は詳細解説のとおりです。';
  return clean;
}

function shuffleOptions(q) {
  const meta = q.options.map(o => ({
    text: o.text,
    isCorrect: q.correctAnswers.includes(o.key),
    detail: q.explanations.details[o.key]
  }));
  const shuffled = shuffle(meta);
  const keys = ['A', 'B', 'C', 'D'];
  const options = [];
  const correctAnswers = [];
  const details = {};

  shuffled.forEach((item, i) => {
    const key = keys[i];
    options.push({ key, text: item.text });
    if (item.isCorrect) correctAnswers.push(key);
    details[key] = item.detail;
  });

  correctAnswers.sort();
  const cleanOverall = stripKeyClaims(q.explanations.overall);
  const correctLabel = correctAnswers.length === 4
    ? 'A〜Dのすべて'
    : `選択肢${correctAnswers.join('・')}`;
  const overall = `${cleanOverall} 正解は${correctLabel}です。`;

  return {
    ...q,
    options,
    correctAnswers,
    explanations: { ...q.explanations, overall, details }
  };
}

function correctKeyScore(quizzes) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of quizzes) for (const key of q.correctAnswers) counts[key]++;
  const values = Object.values(counts);
  return Math.max(...values) - Math.min(...values);
}

function balanceOptionPositions(quizzes) {
  let best = null;
  let bestScore = Infinity;
  for (let attempt = 0; attempt < 80; attempt++) {
    const candidate = quizzes.map(shuffleOptions);
    const score = correctKeyScore(candidate);
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
      if (score <= 1) break;
    }
  }
  return best || quizzes;
}

function generateBatch(section, facts, targetCounts) {
  const prompt = buildPrompt(section, facts, targetCounts);
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`    作問リクエスト ${attempt}/3 ...`);
    try {
      const raw = callAgy(prompt);
      const parsed = extractJson(raw);
      const validated = validateBatch(parsed, targetCounts, section, facts.map(f => f.id));
      if (!validated.issues.length) {
        return balanceOptionPositions(validated.quizzes);
      }
      lastError = new Error(validated.issues.join(' / '));
      console.warn(`    [検証NG] ${lastError.message}`);
    } catch (err) {
      lastError = err;
      console.warn(`    [生成NG] ${err.message}`);
    }
  }

  throw lastError || new Error('作問に失敗しました');
}

function uniqueByQuestion(quizzes) {
  const seen = new Set();
  return quizzes.filter(q => {
    const key = `${q.question}::${q.options.map(o => o.text).join('|')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const allQuizzes = [];
const coverageReport = [];

console.log('============================================================');
console.log(`【暮らしクイズ生成】 ${targetSection}`);
console.log(`ファクト数: ${sectionFacts.length}件 / チャンク数: ${chunks.length} / 実行: ${fromChunk}〜${toChunk}`);
console.log(`モデル: ${model || '(default)'}`);
console.log('============================================================\n');

for (let chunkIndex = fromChunk; chunkIndex <= toChunk; chunkIndex++) {
  const chunk = chunks[chunkIndex - 1];
  console.log(`\n--- チャンク ${chunkIndex}/${chunks.length} (${chunk.length}ファクト: ${chunk[0].id}〜${chunk[chunk.length - 1].id}) ---`);

  const chunkQuestionCount = Math.min(questionsPerChunk, questionsForChunk(chunk.length, questionsPerChunk));
  const maxCorrectForChunk = Math.min(4, chunk.length + 1);
  const chunkTargetCounts = targetCountsFor(chunkQuestionCount, questionOffset)
    .map(n => Math.min(n, maxCorrectForChunk));
  questionOffset = (questionOffset + chunkQuestionCount) % 4;
  console.log(`  作問数: ${chunkQuestionCount}問 / 正解数の指定: ${chunkTargetCounts.join(', ')}`);

  let quizzes;
  try {
    quizzes = generateBatch(targetSection, chunk, chunkTargetCounts);
  } catch (err) {
    console.error(`チャンク${chunkIndex}の生成に失敗しました: ${err.message}`);
    coverageReport.push({ chunk: chunkIndex, factIds: chunk.map(f => f.id), status: 'failed', error: err.message });
    continue;
  }

  let covered = new Set(quizzes.flatMap(q => q.coveredFactIds));
  let missing = chunk.filter(f => !covered.has(f.id));

  if (missing.length) {
    console.log(`  未カバー ${missing.length}件の補完問題を生成します: ${missing.map(f => f.id).join(', ')}`);
    const complementCount = Math.min(questionsPerChunk, Math.max(1, Math.ceil(missing.length / 3)));
    const maxCorrectForComplement = Math.min(4, missing.length + 1);
    const complementTargets = targetCountsFor(complementCount, questionOffset)
      .map(n => Math.min(n, maxCorrectForComplement));
    questionOffset = (questionOffset + complementCount) % 4;
    try {
      const complement = generateBatch(targetSection, missing, complementTargets);
      quizzes.push(...complement);
      covered = new Set(quizzes.flatMap(q => q.coveredFactIds));
      missing = chunk.filter(f => !covered.has(f.id));
    } catch (err) {
      console.warn(`  補完生成に失敗: ${err.message}`);
    }
  }

  allQuizzes.push(...quizzes);
  coverageReport.push({
    chunk: chunkIndex,
    factIds: chunk.map(f => f.id),
    covered: chunk.filter(f => covered.has(f.id)).map(f => f.id),
    missing: missing.map(f => f.id),
    questions: quizzes.length,
    status: missing.length ? 'partial' : 'ok'
  });

  console.log(`  生成: ${quizzes.length}問 / カバレッジ: ${chunk.length - missing.length}/${chunk.length}`);
}

const deduped = uniqueByQuestion(allQuizzes);
deduped.forEach((q, i) => {
  q.id = `liv-${String(i + 1).padStart(3, '0')}`;
});

const suffix = fromChunk === 1 && toChunk === chunks.length ? '' : `_chunk${fromChunk}-${toChunk}`;
const safeSection = targetSection.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '_');
const outFile = path.join(STAGING_DIR, `liv_${safeSection}${suffix}.json`);
const reviewFile = path.join(REVIEW_DIR, `liv_${safeSection}${suffix}.md`);

fs.writeFileSync(outFile, JSON.stringify(deduped, null, 2), 'utf8');

const allFactIds = [...new Set(chunks.slice(fromChunk - 1, toChunk).flat().map(f => f.id))];
const coveredAll = new Set(deduped.flatMap(q => q.coveredFactIds));
const uncoveredAll = allFactIds.filter(id => !coveredAll.has(id));
const countDist = {};
const keyDist = { A: 0, B: 0, C: 0, D: 0 };
for (const q of deduped) {
  countDist[q.correctAnswers.length] = (countDist[q.correctAnswers.length] || 0) + 1;
  for (const key of q.correctAnswers) keyDist[key]++;
}

const review = [];
review.push(`# 暮らしクイズ生成レビュー: ${targetSection}`);
review.push('');
review.push(`- 対象チャンク: ${fromChunk}〜${toChunk} / ${chunks.length}`);
review.push(`- 対象ファクト: ${allFactIds.length}件`);
review.push(`- 生成問題数: ${deduped.length}問`);
review.push(`- カバレッジ: ${allFactIds.length - uncoveredAll.length}/${allFactIds.length}件`);
review.push(`- 未カバー: ${uncoveredAll.length ? uncoveredAll.join(', ') : 'なし'}`);
review.push(`- 正解数の分布: ${Object.entries(countDist).map(([k, v]) => `${k}個=${v}問`).join(' / ')}`);
review.push(`- 正解キーの分布: A=${keyDist.A} / B=${keyDist.B} / C=${keyDist.C} / D=${keyDist.D}`);
review.push('');
review.push('## 生成問題');
review.push('');

deduped.forEach((q, i) => {
  review.push(`### ${q.id}（正解${q.correctAnswers.length}個: ${q.correctAnswers.join(', ')}）`);
  review.push('');
  review.push(q.question);
  review.push('');
  review.push(`参考ファクト: ${q.coveredFactIds.join(', ')}`);
  review.push('');
  for (const opt of q.options) {
    const mark = q.correctAnswers.includes(opt.key) ? '✅' : '　';
    review.push(`- ${mark} **${opt.key}.** ${opt.text}`);
  }
  review.push('');
  review.push(`**総合解説:** ${q.explanations.overall}`);
  review.push('');
  for (const key of ['A', 'B', 'C', 'D']) {
    review.push(`- **${key}:** ${q.explanations.details[key]}`);
  }
  review.push('');
});

fs.writeFileSync(reviewFile, review.join('\n'), 'utf8');

console.log('\n============================================================');
console.log('【完了】');
console.log(`生成問題数: ${deduped.length}問`);
console.log(`カバレッジ: ${allFactIds.length - uncoveredAll.length}/${allFactIds.length}`);
console.log(`未カバー: ${uncoveredAll.length ? uncoveredAll.join(', ') : 'なし'}`);
console.log(`正解数の分布: ${Object.entries(countDist).map(([k, v]) => `${k}個=${v}問`).join(' / ')}`);
console.log(`正解キーの分布: A=${keyDist.A} / B=${keyDist.B} / C=${keyDist.C} / D=${keyDist.D}`);
console.log(`JSON: ${outFile}`);
console.log(`レビュー: ${reviewFile}`);
console.log('============================================================');
