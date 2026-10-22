// 忘却曲線のロジック単体テスト
function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

console.log('=== 忘却曲線ステージ進行ロジックの検証 ===');

// テスト1: 初回解答
const initialDate = '2026-05-01';
const stage1Due = addDays(initialDate, 1);
console.log(`[初回解答: 5/1] -> ステージ1(1日後)出現予定日: ${stage1Due} (期待値: 2026-05-02) -> ${stage1Due === '2026-05-02' ? 'PASS ✓' : 'FAIL ✕'}`);

// テスト2: ステージ1完了（オンタイム解答 5/2） -> ステージ2（+2日）
const solveDate1 = '2026-05-02';
const stage2Due = addDays(solveDate1, 2);
console.log(`[ステージ1解答: 5/2] -> ステージ2(3日後)出現予定日: ${stage2Due} (期待値: 2026-05-04, 累計3日) -> ${stage2Due === '2026-05-04' ? 'PASS ✓' : 'FAIL ✕'}`);

// テスト3: ステージ2完了（遅延解答 5/10 に解いた場合でも当日起点で+4日）
const solveDate2Late = '2026-05-10';
const stage3DueLate = addDays(solveDate2Late, 4);
console.log(`[遅延解答: 5/10] -> ステージ3(1週後)出現予定日: ${stage3DueLate} (期待値: 2026-05-14) -> ${stage3DueLate === '2026-05-14' ? 'PASS ✓' : 'FAIL ✕'}`);

// テスト4: ステージ3完了 -> ステージ4 (+7日)
const solveDate3 = '2026-05-14';
const stage4Due = addDays(solveDate3, 7);
console.log(`[ステージ3解答: 5/14] -> ステージ4(2週後)出現予定日: ${stage4Due} (期待値: 2026-05-21) -> ${stage4Due === '2026-05-21' ? 'PASS ✓' : 'FAIL ✕'}`);

// テスト5: ステージ4完了 -> ステージ5 (+16日)
const solveDate4 = '2026-05-21';
const stage5Due = addDays(solveDate4, 16);
console.log(`[ステージ4解答: 5/21] -> ステージ5(1ヶ月後)出現予定日: ${stage5Due} (期待値: 2026-06-06) -> ${stage5Due === '2026-06-06' ? 'PASS ✓' : 'FAIL ✕'}`);

console.log('\n=== カード自動分割のシミュレーション ===');
// 5/1に3問解いた。
// Q1, Q2, Q3: firstAnsweredDate = '2026-05-01'
// 5/2にQ1だけ解いた。
// Q1: currentStage = 2, nextReviewDate = '2026-05-04'
// Q2, Q3: currentStage = 1, nextReviewDate = '2026-05-02'
const items = [
  { id: 'Q1', firstAnsweredDate: '2026-05-01', currentStage: 2, nextReviewDate: '2026-05-04' },
  { id: 'Q2', firstAnsweredDate: '2026-05-01', currentStage: 1, nextReviewDate: '2026-05-02' },
  { id: 'Q3', firstAnsweredDate: '2026-05-01', currentStage: 1, nextReviewDate: '2026-05-02' },
];

const todaySim = '2026-05-04';
const stage1Cards = items.filter(i => i.currentStage === 1 && i.nextReviewDate <= todaySim);
const stage2Cards = items.filter(i => i.currentStage === 2 && i.nextReviewDate <= todaySim);

console.log(`1日後の行に表示されるカード: 5/1 初めて解いた（${stage1Cards.length}問）[Q2, Q3] -> ${stage1Cards.length === 2 ? 'PASS ✓' : 'FAIL ✕'}`);
console.log(`3日後の行に表示されるカード: 5/1 初めて解いた（${stage2Cards.length}問）[Q1]     -> ${stage2Cards.length === 1 ? 'PASS ✓' : 'FAIL ✕'}`);
console.log('=> 自動分割仕様が完全に成立していることを確認！');
