/**
 * 暮らし（LIV）クイズの統合スクリプト
 *
 * data/rebuilt_quizzes/liv_*.json を読み込み、
 * src/data/quizzes/livelihood.json にまとめます。
 *
 * 使い方:
 *   node scripts/merge_liv_quizzes.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT_DIR, 'data', 'facts_index_liv.json');
const STAGING_DIR = path.join(ROOT_DIR, 'data', 'rebuilt_quizzes');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'data', 'quizzes', 'livelihood.json');
const REPORT_FILE = path.join(ROOT_DIR, 'data', 'reviews', 'livelihood_merge_report.md');

const REQUIRE_FULL = process.argv.includes('--require-full');

const facts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));
const factIds = new Set(facts.map(f => f.id));
const sectionOrder = [...new Set(facts.map(f => f.section))];

function fail(message) {
  console.error(`\n[ERROR] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(STAGING_DIR)) fail(`ステージングディレクトリがありません: ${STAGING_DIR}`);

const sectionFiles = fs
  .readdirSync(STAGING_DIR)
  .filter(name => /^liv_.*\.json$/i.test(name))
  .filter(name => !/_chunk\d+-\d+\.json$/i.test(name))
  .sort();

if (!sectionFiles.length) fail('統合対象の liv_*.json がありません。');

const allQuizzes = [];
const loadedSections = [];

for (const file of sectionFiles) {
  const fullPath = path.join(STAGING_DIR, file);
  let quizzes;
  try {
    quizzes = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (err) {
    fail(`${file} のJSON読み込みに失敗: ${err.message}`);
  }
  if (!Array.isArray(quizzes)) fail(`${file} が配列ではありません。`);

  const sections = [...new Set(quizzes.map(q => q.sourceSection))];
  if (sections.length !== 1) {
    fail(`${file} に複数セクションが含まれています: ${sections.join(', ')}`);
  }
  const section = sections[0];
  if (!sectionOrder.includes(section)) {
    fail(`${file} のセクションがファクト一覧にありません: ${section}`);
  }

  loadedSections.push({ file, section, count: quizzes.length });
  allQuizzes.push(...quizzes.map(q => ({ ...q, _sourceFile: file })));
}

const issues = [];
const seenQuestionKeys = new Set();
const uniqueQuizzes = [];

for (const q of allQuizzes) {
  const label = q.id || '(IDなし)';

  if (q.category !== '暮らし') issues.push(`${label}: categoryが「暮らし」ではありません (${q.category})`);
  if (q.sourceFile !== 'ニュース検定　暮らし.md') {
    issues.push(`${label}: sourceFileが想定と違います (${q.sourceFile})`);
  }
  if (!q.sourceSection || !sectionOrder.includes(q.sourceSection)) {
    issues.push(`${label}: sourceSectionが不正です (${q.sourceSection})`);
  }
  if (!q.question || !String(q.question).trim()) issues.push(`${label}: 問題文が空です`);

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    issues.push(`${label}: 選択肢が4つではありません`);
  } else {
    const keys = q.options.map(o => o.key).join('');
    if (keys !== 'ABCD') issues.push(`${label}: 選択肢キーがABCDではありません (${keys})`);
    if (q.options.some(o => !o.text || !String(o.text).trim())) issues.push(`${label}: 空の選択肢があります`);
    const texts = q.options.map(o => String(o.text).trim());
    if (new Set(texts).size !== texts.length) issues.push(`${label}: 同一問題内に重複選択肢があります`);
  }

  if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length < 1 || q.correctAnswers.length > 4) {
    issues.push(`${label}: 正解数が1〜4の範囲外です`);
  } else {
    for (const key of q.correctAnswers) {
      if (!['A', 'B', 'C', 'D'].includes(key)) issues.push(`${label}: 不正な正解キー ${key}`);
    }
  }

  if (!q.explanations || !q.explanations.overall || !String(q.explanations.overall).trim()) {
    issues.push(`${label}: 総合解説がありません`);
  }
  for (const key of ['A', 'B', 'C', 'D']) {
    const detail = String(q.explanations?.details?.[key] || '').trim();
    if (!detail) {
      issues.push(`${label}: 選択肢${key}の解説がありません`);
      continue;
    }
    const isCorrect = Array.isArray(q.correctAnswers) && q.correctAnswers.includes(key);
    if (isCorrect && !detail.includes('○')) {
      issues.push(`${label}: 正解の選択肢${key}の解説に「○」がありません`);
    }
    if (!isCorrect && !detail.includes('×')) {
      issues.push(`${label}: 誤答の選択肢${key}の解説に「×」がありません`);
    }
  }

  if (!Array.isArray(q.coveredFactIds) || !q.coveredFactIds.length) {
    issues.push(`${label}: coveredFactIdsが空です`);
  } else {
    for (const id of q.coveredFactIds) {
      if (!factIds.has(id)) issues.push(`${label}: 存在しないファクトID ${id}`);
    }
  }

  const questionKey = `${q.sourceSection}::${q.question}::${(q.options || []).map(o => o.text).join('|')}`;
  if (seenQuestionKeys.has(questionKey)) {
    console.warn(`[WARN] 重複問題をスキップ: ${q.question.slice(0, 60)}...`);
    continue;
  }
  seenQuestionKeys.add(questionKey);
  uniqueQuizzes.push(q);
}

if (issues.length) {
  console.error('\n[検証エラー]');
  issues.slice(0, 100).forEach(issue => console.error(` - ${issue}`));
  if (issues.length > 100) console.error(` ... ほか ${issues.length - 100}件`);
  fail(`検証エラーが${issues.length}件あります。統合を中止しました。`);
}

uniqueQuizzes.sort((a, b) => {
  const sectionDiff = sectionOrder.indexOf(a.sourceSection) - sectionOrder.indexOf(b.sourceSection);
  if (sectionDiff !== 0) return sectionDiff;
  return String(a.id).localeCompare(String(b.id), 'ja');
});

// 既存のIDを可能な限り維持する（進捗履歴の互換性のため）。
// 問題文・選択肢が同じものは同じIDを引き継ぎ、新規問題にだけ新しいIDを振る。
const quizKey = q => `${q.sourceSection}::${q.question}::${(q.options || []).map(o => o.text).join('|')}`;
const questionKey = q => `${q.sourceSection}::${q.question}`;
const existingIdByKey = new Map();
const existingIdByQuestion = new Map();
const duplicateQuestions = new Set();
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    const previous = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    for (const q of previous) {
      if (!q || !q.id) continue;
      if (!existingIdByKey.has(quizKey(q))) existingIdByKey.set(quizKey(q), q.id);
      const qk = questionKey(q);
      if (existingIdByQuestion.has(qk)) duplicateQuestions.add(qk);
      else existingIdByQuestion.set(qk, q.id);
    }
  } catch (err) {
    console.warn(`[WARN] 既存クイズの読み込みに失敗したためIDを振り直します: ${err.message}`);
  }
}

const usedIds = new Set();
const assignedIds = new Set();
for (const q of uniqueQuizzes) {
  // 選択肢や解説を修正した問題でも、問題文が一意ならIDを引き継ぐ
  const inherited = existingIdByKey.get(quizKey(q))
    ?? (duplicateQuestions.has(questionKey(q)) ? undefined : existingIdByQuestion.get(questionKey(q)));
  if (inherited && !usedIds.has(inherited)) {
    q.id = inherited;
    usedIds.add(inherited);
    assignedIds.add(q);
  }
}
let nextId = 1;
for (const q of uniqueQuizzes) {
  if (assignedIds.has(q)) {
    delete q._sourceFile;
    continue;
  }
  let candidate;
  do {
    candidate = `liv-${String(nextId).padStart(3, '0')}`;
    nextId++;
  } while (usedIds.has(candidate));
  q.id = candidate;
  usedIds.add(candidate);
  delete q._sourceFile;
}

const covered = new Set(uniqueQuizzes.flatMap(q => q.coveredFactIds));
const uncovered = facts.filter(f => !covered.has(f.id));

if (REQUIRE_FULL && uncovered.length) {
  const preview = uncovered.slice(0, 30).map(f => f.id).join(', ');
  fail(`未カバーのファクトが${uncovered.length}件あるため統合を中止しました: ${preview}${uncovered.length > 30 ? ' ...' : ''}`);
}

const countDist = {};
const keyDist = { A: 0, B: 0, C: 0, D: 0 };
const sectionStats = {};

for (const q of uniqueQuizzes) {
  countDist[q.correctAnswers.length] = (countDist[q.correctAnswers.length] || 0) + 1;
  for (const key of q.correctAnswers) keyDist[key]++;
  if (!sectionStats[q.sourceSection]) sectionStats[q.sourceSection] = 0;
  sectionStats[q.sourceSection]++;
}

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueQuizzes, null, 2), 'utf8');

const report = [];
report.push('# 暮らしクイズ統合レポート');
report.push('');
report.push(`- 出力: \`${path.relative(ROOT_DIR, OUTPUT_FILE)}\``);
report.push(`- 問題数: ${uniqueQuizzes.length}問`);
report.push(`- ファクト・カバレッジ: ${facts.length - uncovered.length}/${facts.length}`);
report.push(`- 未カバー: ${uncovered.length ? uncovered.map(f => f.id).join(', ') : 'なし'}`);
report.push(`- 正解数の分布: ${Object.entries(countDist).sort(([a], [b]) => Number(a) - Number(b)).map(([k, v]) => `${k}個=${v}問`).join(' / ')}`);
report.push(`- 正解キーの分布: A=${keyDist.A} / B=${keyDist.B} / C=${keyDist.C} / D=${keyDist.D}`);
report.push('');
report.push('## セクション別問題数');
report.push('');
report.push('| セクション | 問題数 |');
report.push('|---|---:|');
for (const section of sectionOrder) {
  report.push(`| ${section} | ${sectionStats[section] || 0} |`);
}
report.push('');
report.push('## 読み込み元');
report.push('');
for (const item of loadedSections) {
  report.push(`- \`${item.file}\` (${item.section}) … ${item.count}問`);
}
report.push('');

fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
fs.writeFileSync(REPORT_FILE, report.join('\n'), 'utf8');

console.log('============================================================');
console.log('【暮らしクイズ統合完了】');
console.log(`問題数: ${uniqueQuizzes.length}問`);
console.log(`カバレッジ: ${facts.length - uncovered.length}/${facts.length}`);
const uncoveredPreview = uncovered.slice(0, 30).map(f => f.id).join(', ');
console.log(`未カバー: ${uncovered.length ? `${uncoveredPreview}${uncovered.length > 30 ? ` ... ほか${uncovered.length - 30}件` : ''}` : 'なし'}`);
console.log(`正解数の分布: ${Object.entries(countDist).sort(([a], [b]) => Number(a) - Number(b)).map(([k, v]) => `${k}個=${v}問`).join(' / ')}`);
console.log(`正解キーの分布: A=${keyDist.A} / B=${keyDist.B} / C=${keyDist.C} / D=${keyDist.D}`);
console.log(`JSON: ${OUTPUT_FILE}`);
console.log(`レポート: ${REPORT_FILE}`);
console.log('============================================================');

if (uncovered.length) {
  console.warn(`\n[WARN] 未カバーのファクトが${uncovered.length}件あります。追加生成してください。`);
}
