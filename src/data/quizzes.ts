import { QuizQuestion } from '../types/quiz';

// Viteのimport.meta.globを活用し、quizzesフォルダ内のすべてのJSONファイルを自動的に読み込み・統合します。
// 将来新しいソースからクイズJSONが追加された場合も、コードを変更することなく自動で取り込まれます。
const quizModules = import.meta.glob('./quizzes/*.json', { eager: true });

export const ALL_QUIZZES: QuizQuestion[] = Object.values(quizModules).flatMap(
  (mod: any) => (mod.default || mod) as QuizQuestion[]
);

export const ALL_CATEGORIES: string[] = Array.from(new Set(ALL_QUIZZES.map(q => q.category)));

export const ALL_SOURCES: string[] = Array.from(new Set(ALL_QUIZZES.map(q => q.sourceFile)));

export const getQuizzesByCategory = (category: string): QuizQuestion[] => {
  return ALL_QUIZZES.filter(q => q.category === category);
};

export const getQuizzesBySource = (sourceFile: string): QuizQuestion[] => {
  return ALL_QUIZZES.filter(q => q.sourceFile === sourceFile);
};
