import { QuizQuestion, UserProgress } from '../types/quiz';

/**
 * Mulberry32: 高速かつ決定論的な擬似乱数生成アルゴリズム
 */
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * YYYY-MM-DD 文字列から整数シードを生成
 */
export function getDailySeed(dateStr: string): number {
  const digits = dateStr.replace(/[^0-9]/g, '');
  return parseInt(digits, 10) || 20261022;
}

/**
 * シードを指定して配列をシャッフル（Fisher-Yates with PRNG）
 */
export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * 「今日の30問」を日付シードで決定論的に抽出
 * 構成:
 * - 未学習問題（約15問優先）
 * - 復習期日到来または直近誤答問題（約10問）
 * - その他（約5問）
 * ※ 政治・経済・暮らしの分野比率も均等になるよう配分
 */
export function getDailyThirtyQuizzes(
  allQuizzes: QuizQuestion[],
  dateStr: string,
  progress: UserProgress
): QuizQuestion[] {
  const seed = getDailySeed(dateStr);
  const historyList = Object.values(progress.history || {});
  const attemptedIds = new Set(historyList.map(h => h.quizId));

  // 1. 未学習問題
  const unattempted = allQuizzes.filter(q => !attemptedIds.has(q.id));

  // 2. 復習期日または直近誤答
  const srItems = Object.values(progress.spacedRepetition || {});
  const dueSrIds = new Set(
    srItems
      .filter(i => i.currentStage !== 'completed' && i.nextReviewDate && i.nextReviewDate <= dateStr)
      .map(i => i.quizId)
  );
  const incorrectIds = new Set(
    historyList.filter(h => !h.isFullyCorrect).map(h => h.quizId)
  );
  const needReview = allQuizzes.filter(q => dueSrIds.has(q.id) || incorrectIds.has(q.id));

  // 3. その他（習得済みなど）
  const needReviewIds = new Set(needReview.map(q => q.id));
  const others = allQuizzes.filter(q => attemptedIds.has(q.id) && !needReviewIds.has(q.id));

  // カテゴリごとに分類
  const categories = Array.from(new Set(allQuizzes.map(q => q.category)));

  // シード付きシャッフル
  const shuffledUnattempted = shuffleWithSeed(unattempted, seed + 1);
  const shuffledReview = shuffleWithSeed(needReview, seed + 2);
  const shuffledOthers = shuffleWithSeed(others, seed + 3);

  const selectedSet = new Set<string>();
  const selectedList: QuizQuestion[] = [];

  const addQuizzes = (list: QuizQuestion[], maxCount: number) => {
    // カテゴリバランスを考慮して交互に追加
    const byCategory: Record<string, QuizQuestion[]> = {};
    categories.forEach(c => (byCategory[c] = []));
    list.forEach(q => {
      if (byCategory[q.category]) byCategory[q.category].push(q);
    });

    let added = 0;
    let round = 0;
    while (added < maxCount) {
      let anyAddedThisRound = false;
      for (const cat of categories) {
        if (added >= maxCount) break;
        const q = byCategory[cat]?.[round];
        if (q && !selectedSet.has(q.id)) {
          selectedSet.add(q.id);
          selectedList.push(q);
          added++;
          anyAddedThisRound = true;
        }
      }
      if (!anyAddedThisRound) break;
      round++;
    }
  };

  // 目標配分: 未学習15問, 復習10問, 残り5問
  addQuizzes(shuffledUnattempted, 15);
  addQuizzes(shuffledReview, 10);

  // 30問に達するまで未学習・復習・その他から補充
  if (selectedList.length < 30) {
    addQuizzes(shuffledUnattempted, 30 - selectedList.length);
  }
  if (selectedList.length < 30) {
    addQuizzes(shuffledReview, 30 - selectedList.length);
  }
  if (selectedList.length < 30) {
    addQuizzes(shuffledOthers, 30 - selectedList.length);
  }
  if (selectedList.length < 30) {
    // 全問題からシードシャッフルして未選択のものを補充
    const allShuffled = shuffleWithSeed(allQuizzes, seed + 4);
    for (const q of allShuffled) {
      if (selectedList.length >= 30) break;
      if (!selectedSet.has(q.id)) {
        selectedSet.add(q.id);
        selectedList.push(q);
      }
    }
  }

  // 最終的な出題順もシードでシャッフル
  return shuffleWithSeed(selectedList.slice(0, 30), seed + 5);
}
