import React from 'react';
import { QuizQuestion } from '../types/quiz';
import { RotateCcw } from 'lucide-react';

interface MockTestResultModalProps {
  quizIds: string[];
  allQuizzes: QuizQuestion[];
  answers: Record<string, ('A' | 'B' | 'C' | 'D')[]>;
  elapsedSeconds: number;
  onClose: () => void;
  onRetry: () => void;
  onReviewIncorrect: (incorrectIds: string[]) => void;
}

export const MockTestResultModal: React.FC<MockTestResultModalProps> = ({
  quizIds,
  allQuizzes,
  answers,
  elapsedSeconds,
  onClose,
  onRetry,
  onReviewIncorrect,
}) => {
  const quizMap = new Map<string, QuizQuestion>();
  allQuizzes.forEach(q => quizMap.set(q.id, q));

  const questions = quizIds.map(id => quizMap.get(id)).filter((q): q is QuizQuestion => !!q);
  const total = questions.length;

  let correctCount = 0;
  const incorrectIds: string[] = [];
  const categoryStats: Record<string, { total: number; correct: number }> = {};

  questions.forEach(q => {
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { total: 0, correct: 0 };
    }
    categoryStats[q.category].total += 1;

    const userAns = (answers[q.id] || []).slice().sort();
    const correctAns = q.correctAnswers.slice().sort();
    const isCorrect = userAns.length === correctAns.length && userAns.every((v, i) => v === correctAns[i]);

    if (isCorrect) {
      correctCount += 1;
      categoryStats[q.category].correct += 1;
    } else {
      incorrectIds.push(q.id);
    }
  });

  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const isPassed = correctCount >= 32; // 40問中32問（80%）以上で合格

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}分${s < 10 ? '0' : ''}${s}秒`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mock-result-title"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
      >
        
        {/* ヘッダー合否バナー */}
        <div className={`p-6 rounded-2xl text-center space-y-3 ${
          isPassed 
            ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border-2 border-emerald-500/40 text-emerald-950 dark:text-emerald-100' 
            : 'bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-slate-500/10 border-2 border-rose-500/40 text-rose-950 dark:text-rose-100'
        }`}>
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg bg-white dark:bg-slate-800">
            {isPassed ? '🏆' : '🎯'}
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider uppercase opacity-80">
              時事・ニュース検定 本番模試判定
            </div>
            <h3 id="mock-result-title" className="text-2xl sm:text-3xl font-black mt-1">
              {isPassed ? '合格水準クリア 🎯' : '目標ラインまであと少し 🚀'}
            </h3>
            <p className="text-xs mt-1 opacity-90">
              {isPassed 
                ? 'お見事です！80%以上の基準を突破し、高い知識定着が証明されました。' 
                : '合格基準ラインは80%（32問）です。間違えた問題を復習して再挑戦しましょう！'}
            </p>
          </div>
        </div>

        {/* 成績サマリー */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">得点</div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {correctCount} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ {total}問</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">正答率</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {accuracy}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">所要時間</div>
            <div className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 mt-2">
              {formatTime(elapsedSeconds)}
            </div>
          </div>
        </div>

        {/* 分野別スコア */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            分野別達成状況
          </h4>
          <div className="space-y-2">
            {Object.entries(categoryStats).map(([cat, stat]) => {
              const catAcc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{cat}</span>
                    <span>{stat.correct} / {stat.total}問 ({catAcc}%)</span>
                  </div>
                  <div
                    className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-label={`${cat}の正答率`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={catAcc}
                  >
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${catAcc}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="space-y-2.5 pt-2">
          {incorrectIds.length > 0 && (
            <button
              onClick={() => onReviewIncorrect(incorrectIds)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.01]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>間違えた問題だけを今すぐ復習（全{incorrectIds.length}問）</span>
            </button>
          )}

          {/* 結果シェアボタン */}
          <button
            onClick={() => {
              const text = `超難問クイズマスター（政治・経済・暮らし）の実力テストで【${correctCount}/${total}問 (${accuracy}%)】を獲得！${isPassed ? '合格水準クリア🎯' : 'リベンジ挑戦中🔥'}`;
              const url = 'https://naisanankuru135-max.github.io/quiz-master-app/';
              const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=ニュース検定,政治経済,クイズマスター`;
              window.open(shareUrl, '_blank', 'noopener,noreferrer');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700/50 shadow-sm transition-all"
          >
            <span>𝕏 で模試スコアをポスト・共有</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all"
            >
              もう一度模試に挑戦
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              成績画面へ進む
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
