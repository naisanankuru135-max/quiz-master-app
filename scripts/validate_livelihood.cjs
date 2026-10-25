/**
 * 暮らし（LIV）クイズの最終検証スクリプト
 *
 * 使い方:
 *   node scripts/validate_livelihood.cjs
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const LIV_FACTS_FILE = path.join(ROOT_DIR, 'data', 'facts_index_liv.json');
const LIV_QUIZ_FILE = path.join(ROOT_DIR, 'src', 'data', 'quizzes', 'livelihood.json');
const POL_QUIZ_FILE = path.join(ROOT_DIR, 'src', 'data', 'quizzes', 'politics.json');
const ECO_QUIZ_FILE = path.join(ROOT_DIR, 'src', 'data', 'quizzes', 'economics.json');

const EXPECTED_POL_HASH = '8ef310829dc5a20e7aeefaabf07b08d77573bea850c61ee98808aab932f980f9';
const EXPECTED_ECO_HASH = 'cd0b93cb0d4234a6cec3d92fb2a1b5217609ddb31b55b4bebc779eadfd71f62f';

const errors = [];
const warnings = [];

function error(message) { errors.push(message); }
function warn(message) { warnings.push(message); }

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

if (!fs.existsSync(LIV_QUIZ_FILE)) {
  console.error(`[ERROR] ${LIV_QUIZ_FILE} がありません。`);
  process.exit(1);
}

const facts = readJson(LIV_FACTS_FILE);
const factIds = new Set(facts.map(f => f.id));
const sectionOrder = [...new Set(facts.map(f => f.section))];
const quizzes = readJson(LIV_QUIZ_FILE);
const politics = readJson(POL_QUIZ_FILE);
const economics = readJson(ECO_QUIZ_FILE);

if (politics.length !== 111) error(`政治クイズが111問ではありません (${politics.length})`);
if (economics.length !== 196) error(`経済クイズが196問ではありません (${economics.length})`);
if (sha256(POL_QUIZ_FILE) !== EXPECTED_POL_HASH) error('politics.json が変更されています');
if (sha256(ECO_QUIZ_FILE) !== EXPECTED_ECO_HASH) error('economics.json が変更されています');

if (!Array.isArray(quizzes)) {
  console.error('[ERROR] livelihood.json が配列ではありません。');
  process.exit(1);
}

const ids = new Set();
const questionTexts = new Set();
const covered = new Set();
const countDist = {};
const keyDist = { A: 0, B: 0, C: 0, D: 0 };
const sectionCounts = {};

for (const q of quizzes) {
  const label = q.id || '(IDなし)';

  if (!q.id || ids.has(q.id)) error(`${label}: IDが空または重複しています`);
  ids.add(q.id);

  if (q.category !== '暮らし') error(`${label}: categoryが「暮らし」ではありません (${q.category})`);
  if (q.sourceFile !== 'ニュース検定　暮らし.md') error(`${label}: sourceFileが不正です (${q.sourceFile})`);
  if (!sectionOrder.includes(q.sourceSection)) error(`${label}: sourceSectionが不正です (${q.sourceSection})`);
  if (!q.question || !String(q.question).trim()) error(`${label}: 問題文が空です`);
  if (questionTexts.has(q.question)) error(`${label}: 問題文が重複しています`);
  questionTexts.add(q.question);

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    error(`${label}: 選択肢が4つではありません`);
  } else {
    if (q.options.map(o => o.key).join('') !== 'ABCD') error(`${label}: 選択肢キーがABCDではありません`);
    const texts = q.options.map(o => String(o.text || '').trim());
    if (texts.some(t => !t)) error(`${label}: 空の選択肢があります`);
    if (new Set(texts).size !== texts.length) error(`${label}: 同一問題内に重複選択肢があります`);
  }

  if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length < 1 || q.correctAnswers.length > 4) {
    error(`${label}: 正解数が1〜4の範囲外です`);
  } else {
    countDist[q.correctAnswers.length] = (countDist[q.correctAnswers.length] || 0) + 1;
    for (const key of q.correctAnswers) {
      if (!['A', 'B', 'C', 'D'].includes(key)) error(`${label}: 不正な正解キー ${key}`);
      else keyDist[key]++;
    }
  }

  if (!q.explanations?.overall || !String(q.explanations.overall).trim()) error(`${label}: 総合解説がありません`);
  for (const key of ['A', 'B', 'C', 'D']) {
    const detail = String(q.explanations?.details?.[key] || '').trim();
    if (!detail) {
      error(`${label}: 選択肢${key}の解説がありません`);
      continue;
    }
    const isCorrect = Array.isArray(q.correctAnswers) && q.correctAnswers.includes(key);
    if (isCorrect && !detail.includes('○')) {
      error(`${label}: 正解の選択肢${key}の解説に「○」がありません`);
    }
    if (!isCorrect && !detail.includes('×')) {
      error(`${label}: 誤答の選択肢${key}の解説に「×」がありません`);
    }
  }

  if (!Array.isArray(q.coveredFactIds) || !q.coveredFactIds.length) {
    error(`${label}: coveredFactIdsが空です`);
  } else {
    for (const id of q.coveredFactIds) {
      if (!factIds.has(id)) error(`${label}: 存在しないファクトID ${id}`);
      covered.add(id);
    }
  }

  sectionCounts[q.sourceSection] = (sectionCounts[q.sourceSection] || 0) + 1;
}

const uncovered = facts.filter(f => !covered.has(f.id));
if (uncovered.length) {
  error(`未カバーのファクトが${uncovered.length}件あります: ${uncovered.slice(0, 30).map(f => f.id).join(', ')}${uncovered.length > 30 ? ' ...' : ''}`);
}

for (let n = 1; n <= 4; n++) {
  if (!countDist[n]) error(`正解${n}個の問題がありません`);
}
const countValues = [1, 2, 3, 4].map(n => countDist[n] || 0);
if (Math.max(...countValues) - Math.min(...countValues) > Math.ceil(quizzes.length * 0.15)) {
  warn(`正解数の分布に偏りがあります: ${countValues.join(' / ')}`);
}
const keyValues = Object.values(keyDist);
if (Math.max(...keyValues) - Math.min(...keyValues) > Math.ceil(quizzes.length * 0.2)) {
  warn(`正解キーの分布に偏りがあります: A=${keyDist.A} B=${keyDist.B} C=${keyDist.C} D=${keyDist.D}`);
}

const missingSections = sectionOrder.filter(section => !sectionCounts[section]);
if (missingSections.length) {
  error(`問題が1問もないセクションがあります: ${missingSections.join(', ')}`);
}

console.log('============================================================');
console.log('【暮らしクイズ検証】');
console.log(`問題数: ${quizzes.length}問`);
console.log(`カバレッジ: ${facts.length - uncovered.length}/${facts.length}`);
console.log(`正解数の分布: ${Object.entries(countDist).sort(([a], [b]) => Number(a) - Number(b)).map(([k, v]) => `${k}個=${v}問`).join(' / ')}`);
console.log(`正解キーの分布: A=${keyDist.A} / B=${keyDist.B} / C=${keyDist.C} / D=${keyDist.D}`);
console.log(`セクション数: ${Object.keys(sectionCounts).length}/${sectionOrder.length}`);
console.log(`既存307問: 政治${politics.length}問 / 経済${economics.length}問 (ハッシュ一致)`);
console.log('------------------------------------------------------------');
if (warnings.length) {
  console.log(`[WARN] ${warnings.length}件`);
  warnings.forEach(w => console.log(` - ${w}`));
}
if (errors.length) {
  console.log(`[ERROR] ${errors.length}件`);
  errors.slice(0, 100).forEach(e => console.log(` - ${e}`));
  if (errors.length > 100) console.log(` ... ほか ${errors.length - 100}件`);
  process.exitCode = 1;
} else {
  console.log('✅ すべての検証に合格しました。');
}
console.log('============================================================');
