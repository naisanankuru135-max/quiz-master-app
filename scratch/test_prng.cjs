// Test daily thirty PRNG
const assert = require('assert');

function mulberry32(seed) {
  return function() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = mulberry32(20261022);
const v1 = [r1(), r1(), r1()];

const r2 = mulberry32(20261022);
const v2 = [r2(), r2(), r2()];

assert.deepStrictEqual(v1, v2, 'Same seed must produce identical numbers');

const r3 = mulberry32(20261023);
const v3 = [r3(), r3(), r3()];
assert.notDeepStrictEqual(v1, v3, 'Different seed must produce different numbers');

console.log('PRNG tests passed successfully!');
