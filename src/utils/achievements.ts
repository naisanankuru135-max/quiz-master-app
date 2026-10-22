import { Achievement, UserProgress, QuizQuestion } from '../types/quiz';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: '初めの一歩',
    description: '初めてクイズを1問解答した',
    icon: '🐣',
    category: 'count',
    target: 1,
  },
  {
    id: 'streak_3',
    title: '三日坊主を打破',
    description: '3日連続学習を達成した',
    icon: '🔥',
    category: 'streak',
    target: 3,
  },
  {
    id: 'streak_7',
    title: '週間マスター',
    description: '7日連続学習を達成した',
    icon: '⚡',
    category: 'streak',
    target: 7,
  },
  {
    id: 'count_10',
    title: 'ウォーミングアップ',
    description: '累計10問を解答した',
    icon: '🏃',
    category: 'count',
    target: 10,
  },
  {
    id: 'count_50',
    title: '学習の波に乗る',
    description: '累計50問を解答した',
    icon: '🏄',
    category: 'count',
    target: 50,
  },
  {
    id: 'count_100',
    title: '知識の探求者',
    description: '累計100問を解答した',
    icon: '🧠',
    category: 'count',
    target: 100,
  },
  {
    id: 'count_300',
    title: '百戦錬磨',
    description: '累計300問を解答した',
    icon: '🛡️',
    category: 'count',
    target: 300,
  },
  {
    id: 'review_first',
    title: 'エビングハウスの実践',
    description: '復習タブで初めて忘却曲線復習を完了した',
    icon: '🔄',
    category: 'special',
    target: 1,
  },
  {
    id: 'master_1',
    title: '記憶の殿堂入り',
    description: '初めて忘却曲線をクリアし完全習得を達成した',
    icon: '🏆',
    category: 'mastery',
    target: 1,
  },
  {
    id: 'master_10',
    title: '知のアーカイブ',
    description: '完全習得（殿堂入り）を10問達成した',
    icon: '👑',
    category: 'mastery',
    target: 10,
  },
  {
    id: 'accuracy_80',
    title: 'スナイパー',
    description: '30問以上解答し、全体正答率80%以上を達成',
    icon: '🎯',
    category: 'special',
    target: 80,
  },
  {
    id: 'all_categories',
    title: 'オールラウンダー',
    description: 'すべてのカテゴリで各1問以上正解した',
    icon: '🌟',
    category: 'special',
    target: 1,
  },
];

/**
 * ユーザーの進捗から、条件を満たしているアチーブメントIDの一覧を計算する
 */
export const checkUnlockedAchievements = (
  progress: UserProgress,
  allQuizzes: QuizQuestion[]
): string[] => {
  const historyList = Object.values(progress.history || {});
  const totalAnswered = historyList.length;
  const fullyCorrectCount = historyList.filter(h => h.isFullyCorrect).length;
  const overallAccuracy = totalAnswered >= 30 ? Math.round((fullyCorrectCount / totalAnswered) * 100) : 0;

  const srItems = Object.values(progress.spacedRepetition || {});
  const completedCount = srItems.filter(item => item.currentStage === 'completed').length;
  const reviewAdvancedCount = srItems.filter(item => 
    item.currentStage === 'completed' || (typeof item.currentStage === 'number' && item.currentStage > 1)
  ).length;

  const categories = Array.from(new Set(allQuizzes.map(q => q.category)));
  const answeredCategoriesWithCorrect = new Set(
    historyList.filter(h => h.isFullyCorrect).map(h => h.category)
  );
  const isAllCategoriesCleared = categories.length > 0 && categories.every(cat => answeredCategoriesWithCorrect.has(cat));

  const unlocked = new Set<string>(progress.unlockedAchievements || []);

  if (totalAnswered >= 1) unlocked.add('first_step');
  if (totalAnswered >= 10) unlocked.add('count_10');
  if (totalAnswered >= 50) unlocked.add('count_50');
  if (totalAnswered >= 100) unlocked.add('count_100');
  if (totalAnswered >= 300) unlocked.add('count_300');

  if (progress.streak.current >= 3) unlocked.add('streak_3');
  if (progress.streak.current >= 7) unlocked.add('streak_7');

  if (reviewAdvancedCount >= 1) unlocked.add('review_first');
  if (completedCount >= 1) unlocked.add('master_1');
  if (completedCount >= 10) unlocked.add('master_10');

  if (overallAccuracy >= 80) unlocked.add('accuracy_80');
  if (isAllCategoriesCleared) unlocked.add('all_categories');

  return Array.from(unlocked);
};
