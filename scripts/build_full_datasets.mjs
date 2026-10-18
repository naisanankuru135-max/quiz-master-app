import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { POLITICS_QUIZZES } from './data_politics.mjs';
import { ECONOMICS_QUIZZES } from './data_economics.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QUIZZES_DIR = path.resolve(__dirname, '..', 'src', 'data', 'quizzes');

function validateQuizzes(quizzes, name) {
  console.log(`Validating ${name} dataset (${quizzes.length} questions)...`);
  const seenIds = new Set();
  
  for (let i = 0; i < quizzes.length; i++) {
    const q = quizzes[i];
    if (!q.id || seenIds.has(q.id)) {
      throw new Error(`[${name}] Duplicate or missing id at index ${i}: ${q.id}`);
    }
    seenIds.add(q.id);

    if (!q.category || !q.sourceFile || !q.sourceSection || !q.question) {
      throw new Error(`[${name}] Missing required fields in ${q.id}`);
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`[${name}] Question ${q.id} must have exactly 4 options`);
    }

    const keys = q.options.map(o => o.key);
    if (keys.join('') !== 'ABCD') {
      throw new Error(`[${name}] Question ${q.id} options keys must be A, B, C, D`);
    }

    if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
      throw new Error(`[${name}] Question ${q.id} must have at least one correct answer`);
    }

    for (const ans of q.correctAnswers) {
      if (!['A', 'B', 'C', 'D'].includes(ans)) {
        throw new Error(`[${name}] Question ${q.id} invalid correct answer: ${ans}`);
      }
    }

    if (!q.explanations || !q.explanations.overall || !q.explanations.details) {
      throw new Error(`[${name}] Question ${q.id} missing explanations`);
    }

    for (const optKey of ['A', 'B', 'C', 'D']) {
      if (!q.explanations.details[optKey]) {
        throw new Error(`[${name}] Question ${q.id} missing explanation for option ${optKey}`);
      }
    }

    if (!q.sourceReference) {
      throw new Error(`[${name}] Question ${q.id} missing sourceReference`);
    }
  }

  console.log(`✓ ${name} dataset valid: ${quizzes.length} questions.`);
}

validateQuizzes(POLITICS_QUIZZES, 'politics');
validateQuizzes(ECONOMICS_QUIZZES, 'economics');

const politicsFile = path.join(QUIZZES_DIR, 'politics.json');
const economicsFile = path.join(QUIZZES_DIR, 'economics.json');

fs.writeFileSync(politicsFile, JSON.stringify(POLITICS_QUIZZES, null, 2), 'utf8');
fs.writeFileSync(economicsFile, JSON.stringify(ECONOMICS_QUIZZES, null, 2), 'utf8');

console.log(`\nSuccessfully saved:`);
console.log(`- ${politicsFile} (${POLITICS_QUIZZES.length} questions)`);
console.log(`- ${economicsFile} (${ECONOMICS_QUIZZES.length} questions)`);
console.log(`Total questions in app: ${POLITICS_QUIZZES.length + ECONOMICS_QUIZZES.length} questions!\n`);
