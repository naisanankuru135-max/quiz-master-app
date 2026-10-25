/**
 * 暮らしクイズの選択肢・解説を一括パッチする。
 *
 * 入力: data/liv_patches.json
 * [
 *   {
 *     "section": "人口・少子高齢化",
 *     "match": "こども誰でも通園制度に関する記述",
 *     "key": "D",
 *     "text": "新しい選択肢本文",
 *     "explanation": "【○ 正しい】...",   // マーカー込みで指定
 *     "correct": true                     // 正解に変更する場合 true / 誤答にする場合 false / 変更なしは省略
 *   }
 * ]
 *
 * 対象は data/rebuilt_quizzes/liv_*.json（_chunk は除外）。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STAGING = path.join(ROOT, 'data', 'rebuilt_quizzes');
const PATCH_FILE = path.join(ROOT, 'data', 'liv_patches.json');

const patches = JSON.parse(fs.readFileSync(PATCH_FILE, 'utf8'));
const files = fs
  .readdirSync(STAGING)
  .filter(n => /^liv_.*\.json$/i.test(n))
  .filter(n => !/_chunk\d+-\d+\.json$/i.test(n));

const applied = [];
const errors = [];

for (const p of patches) {
  let hit = null;
  let hitFile = null;
  let hitIndex = -1;
  for (const f of files) {
    const full = path.join(STAGING, f);
    const list = JSON.parse(fs.readFileSync(full, 'utf8'));
    const idx = list.findIndex(q => q.sourceSection === p.section && String(q.question).includes(p.match));
    if (idx >= 0) {
      if (hit) {
        errors.push(`複数ヒット: ${p.section} / ${p.match}`);
      }
      hit = { file: full, list, idx };
      hitFile = f;
      hitIndex = idx;
    }
  }
  if (!hit) {
    errors.push(`見つかりません: ${p.section} / ${p.match}`);
    continue;
  }

  const q = hit.list[hit.idx];
  const opt = q.options.find(o => o.key === p.key);
  if (!opt) {
    errors.push(`選択肢${p.key}がありません: ${q.question.slice(0, 40)}`);
    continue;
  }

  if (p.text) opt.text = p.text;
  if (p.explanation) q.explanations.details[p.key] = p.explanation;

  if (typeof p.correct === 'boolean') {
    const set = new Set(q.correctAnswers);
    if (p.correct) set.add(p.key);
    else set.delete(p.key);
    q.correctAnswers = ['A', 'B', 'C', 'D'].filter(k => set.has(k));

    const marker = p.correct ? '【○ 正しい】' : '【× 誤り】';
    const detail = String(q.explanations.details[p.key] || '');
    q.explanations.details[p.key] = detail.replace(/^【[○×][^】]*】/, marker);
  }

  // 総合解説の末尾「正解は選択肢Xです。」を振り直す
  const suffix = ` 正解は選択肢${q.correctAnswers.join('・')}です。`;
  q.explanations.overall = String(q.explanations.overall)
    .replace(/\s*正解は選択肢[A-D・]+です。?\s*$/, '')
    + suffix;

  fs.writeFileSync(hit.file, JSON.stringify(hit.list, null, 2) + '\n', 'utf8');
  applied.push(`${p.section} / ${q.question.slice(0, 30)}… / ${p.key} (${hitFile}#${hitIndex})`);
}

console.log(`適用: ${applied.length}件`);
for (const a of applied) console.log(`  - ${a}`);
if (errors.length) {
  console.error(`\nエラー: ${errors.length}件`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
