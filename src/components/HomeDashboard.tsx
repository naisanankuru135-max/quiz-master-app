import React, { useState } from 'react';
import { UserProgress, QuizQuestion, QuizMode } from '../types/quiz';
import { 
  Flame, Play, BookOpen, ChevronRight, History 
} from 'lucide-react';
import { QuestionCountModal } from './QuestionCountModal';
import { getTodayStudyCount, getTodayMockCount } from '../utils/storage';

interface HomeDashboardProps {
  progress: UserProgress;
  allQuizzes: QuizQuestion[];
  onStartMode: (mode: QuizMode, category?: string, count?: number) => void;
  onResumeSession: () => void;
  onDiscardSession: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress,
  allQuizzes,
  onStartMode,
  onResumeSession,
  onDiscardSession,
}) => {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    mode: QuizMode;
    category?: string;
    availableCount: number;
  } | null>(null);

  const historyList = Object.values(progress.history);
  const attemptedIds = new Set(historyList.map(h => h.quizId));
  const unattemptedQuizzes = allQuizzes.filter(q => !attemptedIds.has(q.id));
  const incorrectQuizzes = allQuizzes.filter(q => {
    const rec = progress.history[q.id];
    return rec && !rec.isFullyCorrect;
  });

  const categories = Array.from(new Set(allQuizzes.map(q => q.category)));
  const todayCount = getTodayStudyCount(progress);
  const todayMockCount = getTodayMockCount(progress);
  const bookmarkedQuizzes = allQuizzes.filter(q => progress.bookmarks?.includes(q.id));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* 途中再開バナー（セッションがある場合） */}
      {progress.activeSession && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-xl shadow-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-bouncePop">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shrink-0">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">中断されたセッション</div>
              <h3 className="text-lg font-black mt-0.5">
                前回のクイズが途中です（第 {progress.activeSession.currentIndex + 1} 問 / {progress.activeSession.quizIds.length} 問）
              </h3>
              <p className="text-xs text-indigo-100 opacity-80">
                モード: {progress.activeSession.mode === 'daily30' ? '今日の30問' : progress.activeSession.mode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                if (window.confirm('中断中のセッションを破棄してもよろしいですか？（これまでの途中経過はクリアされます）')) {
                  onDiscardSession();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors text-indigo-100"
            >
              破棄する
            </button>
            <button
              onClick={onResumeSession}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-sm font-black transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-indigo-700" />
              続きから再開
            </button>
          </div>
        </div>
      )}

      {/* 今日の目標 & ストリークヒーロー */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
              {progress.streak.current > 0 ? `${progress.streak.current}日 連続学習中` : '今日からスタート！'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              今日の学習目標を達成しよう
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              毎日30問の超難問を解いて、知識の完全定着を目指します。模試は目標カウントに含まれません。
            </p>
          </div>

          {/* 今日の達成プログレス */}
          <div className="sm:text-right shrink-0">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 flex items-center sm:justify-end gap-1">
              <span>{todayCount}</span>
              <span className="text-sm font-normal text-slate-400">/ {progress.dailyGoal}問</span>
              {todayCount > progress.dailyGoal && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  +{todayCount - progress.dailyGoal}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {todayCount >= progress.dailyGoal ? '🎯 本日の目標達成！' : `達成率 ${Math.min(100, Math.round((todayCount / progress.dailyGoal) * 100))}%`}
            </div>
            {todayMockCount > 0 && (
              <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                模試 {todayMockCount}問は別カウント
              </div>
            )}
          </div>
        </div>

        {/* プログレスバー */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full mt-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (todayCount / progress.dailyGoal) * 100)}%` }}
          />
        </div>
      </div>

      {/* メイン出題モード一覧 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>🚀</span>
          特訓モードを選択
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* ① 今日の30問 */}
          <div 
            onClick={() => onStartMode('daily30')}
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 border-2 border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  🔥
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  日課おすすめ
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                今日の30問（デイリー）
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                全問題から毎日バランス良く30問を自動ピックアップ。毎日の習慣化に最適です。
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>30問チャレンジ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* ② 未踏問題ランダム練習 */}
          <div 
            onClick={() => setModalConfig({
              isOpen: true,
              mode: 'unattempted',
              availableCount: unattemptedQuizzes.length || allQuizzes.length,
            })}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center text-2xl shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                  🧭
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  未解答: {unattemptedQuizzes.length}問
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                未踏問題ランダム練習
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                まだ一度も解いたことがない問題を優先的に出題。問題数（10〜全問）を選択できます。
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>問題数を選んで特訓</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* ③ 苦手特訓（直近の誤答問題） */}
          <div 
            onClick={() => {
              if (incorrectQuizzes.length === 0) {
                alert('現在、間違えた問題はありません！素晴らしい成果です。');
                return;
              }
              setModalConfig({
                isOpen: true,
                mode: 'reviewWeak',
                availableCount: incorrectQuizzes.length,
              });
            }}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group flex flex-col justify-between ${
              incorrectQuizzes.length > 0
                ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/50 hover:border-rose-500'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center text-2xl shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                  🎯
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  要克服: {incorrectQuizzes.length}問
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                苦手特訓（誤答クイズ）
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                直近間違えた問題や部分正解だった問題だけを抽出。弱点を集中攻略します。
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>苦手特訓スタート</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* ④ 実力テスト（本番40問固定模試） */}
          <div 
            onClick={() => onStartMode('mockTest', undefined, 40)}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-400 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center text-2xl shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                  ⚡
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  40問・本番模試
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                実力テスト（本番模試）
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                40分制限時間付きの本番形式模試。政治・経済バランス出題で実力を判定します。
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-violet-600 dark:text-violet-400">
              <span>本番模試を開始</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* ⑤ ブックマークした問題 */}
          <div 
            onClick={() => {
              if (bookmarkedQuizzes.length === 0) {
                alert('ブックマークした問題はまだありません。クイズ画面の右上★ボタンで後から解き直したい問題を保存できます。');
                return;
              }
              onStartMode('bookmark', '★ ブックマーク問題', bookmarkedQuizzes.length);
            }}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group flex flex-col justify-between ${
              bookmarkedQuizzes.length > 0
                ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/50 hover:border-amber-500'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  ★
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  保存中: {bookmarkedQuizzes.length}問
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                ブックマーク演習
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                クイズ中に「★」をつけた気になる問題だけをまとめて演習できます。
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>保存した問題を解く</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* カテゴリ別学習 */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          ソース・分野別に集中特訓（問題数選択可）
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map(cat => {
            const count = allQuizzes.filter(q => q.category === cat).length;
            const answered = historyList.filter(h => h.category === cat).length;
            return (
              <div
                key={cat}
                onClick={() => setModalConfig({
                  isOpen: true,
                  mode: 'category',
                  category: cat,
                  availableCount: count,
                })}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-between group"
              >
                <div>
                  <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {answered} / {count} 問 解答済み
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 問題数選択モーダル */}
      {modalConfig && (
        <QuestionCountModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig(null)}
          mode={modalConfig.mode}
          category={modalConfig.category}
          availableCount={modalConfig.availableCount}
          onConfirm={(selectedCount) => {
            const { mode, category } = modalConfig;
            setModalConfig(null);
            onStartMode(mode, category, selectedCount);
          }}
        />
      )}

    </div>
  );
};
