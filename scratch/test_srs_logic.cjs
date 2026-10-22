// Test SRS branching logic
const assert = require('assert');

function advanceStage(prevStage, isFullyCorrect, today) {
  let nextStage;
  let addedDays = 0;

  if (isFullyCorrect) {
    if (prevStage === 1) { nextStage = 2; addedDays = 2; }
    else if (prevStage === 2) { nextStage = 3; addedDays = 4; }
    else if (prevStage === 3) { nextStage = 4; addedDays = 7; }
    else if (prevStage === 4) { nextStage = 5; addedDays = 16; }
    else if (prevStage === 5) { nextStage = 'completed'; addedDays = 0; }
  } else {
    nextStage = prevStage > 1 ? (prevStage - 1) : 1;
    addedDays = 1;
  }

  return { nextStage, addedDays };
}

// Test 1: Stage 1 correct -> Stage 2, +2 days
assert.deepStrictEqual(advanceStage(1, true, '2026-10-22'), { nextStage: 2, addedDays: 2 });
// Test 2: Stage 1 incorrect -> Stage 1, +1 day
assert.deepStrictEqual(advanceStage(1, false, '2026-10-22'), { nextStage: 1, addedDays: 1 });
// Test 3: Stage 3 incorrect -> Stage 2, +1 day
assert.deepStrictEqual(advanceStage(3, false, '2026-10-22'), { nextStage: 2, addedDays: 1 });
// Test 4: Stage 5 correct -> completed, +0 days
assert.deepStrictEqual(advanceStage(5, true, '2026-10-22'), { nextStage: 'completed', addedDays: 0 });

console.log('All SRS branching tests passed!');
