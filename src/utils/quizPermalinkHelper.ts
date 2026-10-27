import { ALL_QUIZZES } from '../data/quizzes';
import factsData from '../data/facts_index.json';
import { QuizQuestion } from '../types/quiz';

// ファクトID -> { factText, section } の高速検索マップ
export const FACT_MAP: Record<string, { factText: string; section?: string }> = {};

if (Array.isArray(factsData)) {
  for (const item of factsData as any[]) {
    if (item && item.id) {
      FACT_MAP[item.id] = {
        factText: item.factText || '',
        section: item.section,
      };
    }
  }
}

// クイズID -> { sequentialNumber (1〜435), categoryNumber (分野内1〜N) }
export interface QuizNumberInfo {
  sequentialNumber: number;
  categoryNumber: number;
}

const quizNumberMap = new Map<string, QuizNumberInfo>();
const categoryCounters: Record<string, number> = {};

ALL_QUIZZES.forEach((quiz, index) => {
  const cat = quiz.category || 'その他';
  categoryCounters[cat] = (categoryCounters[cat] || 0) + 1;
  quizNumberMap.set(quiz.id, {
    sequentialNumber: index + 1,
    categoryNumber: categoryCounters[cat],
  });
});

export function getQuizNumberInfo(quizId: string): QuizNumberInfo {
  return quizNumberMap.get(quizId) || { sequentialNumber: 1, categoryNumber: 1 };
}

/**
 * URLパラメータ（例: ?q=1 や ?q=politics-001）から該当するクイズを特定する
 */
export function findQuizByParam(param: string): {
  quiz: QuizQuestion;
  sequentialNumber: number;
  categoryNumber: number;
} | null {
  if (!param) return null;
  const trimmed = param.trim();

  // 1. 数字の通し番号の場合 (1〜435)
  const num = parseInt(trimmed, 10);
  if (!isNaN(num) && num >= 1 && num <= ALL_QUIZZES.length) {
    const quiz = ALL_QUIZZES[num - 1];
    const info = getQuizNumberInfo(quiz.id);
    return { quiz, ...info };
  }

  // 2. 問題ID文字列の場合 (politics-001, liv-001 など)
  const byId = ALL_QUIZZES.find(q => q.id.toLowerCase() === trimmed.toLowerCase());
  if (byId) {
    const info = getQuizNumberInfo(byId.id);
    return { quiz: byId, ...info };
  }

  return null;
}
