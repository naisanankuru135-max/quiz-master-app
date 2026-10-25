/**
 * 暮らし（LIV）全セクション一括生成スクリプト
 *
 * 既に完全生成済みのセクションはスキップし、未生成のセクションだけ
 * generate_liv_quizzes.cjs を順番に実行します。
 *
 * 使い方:
 *   node scripts/generate_all_liv_sections.cjs
 *   node scripts/generate_all_liv_sections.cjs --from 2
 *   node scripts/generate_all_liv_sections.cjs --from 1 --to 5
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT_DIR, 'data', 'facts_index_liv.json');
const STAGING_DIR = path.join(ROOT_DIR, 'data', 'rebuilt_quizzes');
const GENERATOR = path.join(__dirname, 'generate_liv_quizzes.cjs');

const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const facts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));
const sections = [...new Set(facts.map(f => f.section))];
const from = Math.max(1, parseInt(getArg('--from', '1'), 10));
const to = Math.min(sections.length, parseInt(getArg('--to', String(sections.length)), 10));

function safeName(section) {
  return section.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '_');
}

function existingCoverage(section) {
  const file = path.join(STAGING_DIR, `liv_${safeName(section)}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const quizzes = JSON.parse(fs.readFileSync(file, 'utf8'));
    const covered = new Set(quizzes.flatMap(q => q.coveredFactIds || []));
    const sectionFacts = facts.filter(f => f.section === section);
    const missing = sectionFacts.filter(f => !covered.has(f.id));
    return { file, count: quizzes.length, total: sectionFacts.length, missing };
  } catch {
    return null;
  }
}

const failures = [];
const skipped = [];

console.log('============================================================');
console.log('【暮らし全セクション生成】');
console.log(`対象: ${from}〜${to} / ${sections.length}`);
console.log('============================================================\n');

for (let i = from; i <= to; i++) {
  const section = sections[i - 1];
  const coverage = existingCoverage(section);

  if (coverage && coverage.missing.length === 0) {
    console.log(`[SKIP] ${i}. ${section} … 生成済み ${coverage.count}問 / カバレッジ ${coverage.total}/${coverage.total}`);
    skipped.push(section);
    continue;
  }

  console.log(`\n============================================================`);
  console.log(`[START] ${i}. ${section}`);
  console.log('============================================================');

  try {
    execFileSync(process.execPath, [GENERATOR, '--section-index', String(i)], {
      cwd: ROOT_DIR,
      stdio: 'inherit',
      timeout: 20 * 60 * 1000
    });

    const after = existingCoverage(section);
    if (!after || after.missing.length) {
      const missing = after ? after.missing.map(f => f.id).join(', ') : '出力ファイルなし';
      throw new Error(`生成後のカバレッジ不足: ${missing}`);
    }
    console.log(`[DONE] ${i}. ${section} … ${after.count}問 / カバレッジ ${after.total}/${after.total}`);
  } catch (err) {
    console.error(`[FAIL] ${section}: ${err.message}`);
    failures.push({ section, error: err.message });
  }
}

console.log('\n============================================================');
console.log('【全セクション生成完了】');
console.log(`スキップ: ${skipped.length}セクション`);
console.log(`失敗: ${failures.length}セクション`);
if (failures.length) {
  for (const failure of failures) console.log(` - ${failure.section}: ${failure.error}`);
}
console.log('============================================================');

if (failures.length) process.exitCode = 1;
