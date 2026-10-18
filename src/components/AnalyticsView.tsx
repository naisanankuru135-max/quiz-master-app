import React from 'react';
import { UserProgress, QuizQuestion } from '../types/quiz';
import { Award, TrendingUp, BarChart3, Database, ShieldCheck, Zap } from 'lucide-react';

interface AnalyticsViewProps {
  progress: UserProgress;
  allQuizzes: QuizQuestion[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ progress, allQuizzes }) => {
  const historyList = Object.values(progress.history);
  const totalAnswered = historyList.length;
  const fullyCorrectCount = historyList.filter(h => h.isFullyCorrect).length;
  const overallAccuracy = totalAnswered > 0 ? Math.round((fullyCorrectCount / totalAnswered) * 100) : 0;
  const unattemptedCount = Math.max(0, allQuizzes.length - totalAnswered);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivity = progress.activityHistory.find(a => a.date === todayStr);
  const todayCount = todayActivity?.count || 0;
  const todayCorrect = todayActivity?.correctCount || 0;
  const todayAccuracy = todayCount > 0 ? Math.round((todayCorrect / todayCount) * 100) : 0;

  // カテゴリ別集計
  const categories = Array.from(new Set(allQuizzes.map(q => q.category)));
  const categoryStats = categories.map(cat => {
    const catQuizzes = allQuizzes.filter(q => q.category === cat);
    const catAnswers = historyList.filter(h => h.category === cat);
    const catCorrect = catAnswers.filter(h => h.isFullyCorrect).length;
    const accuracy = catAnswers.length > 0 ? Math.round((catCorrect / catAnswers.length) * 100) : 0;
    return {
      category: cat,
      total: catQuizzes.length,
      answered: catAnswers.length,
      correct: catCorrect,
      accuracy
    };
  });

  // 折れ線グラフ用データ（直近7日〜14日）
  const chartData = [...progress.activityHistory].slice(-7);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* タイトルヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            学習達成度 & 成績アナリティクス
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            合格基準ライン（80%）を目標に実力を高めましょう。
          </p>
        </div>

        {/* 合格判定バッジ */}
        <div className={`px-5 py-2.5 rounded-2xl border-2 flex items-center gap-3 shadow-sm ${
          overallAccuracy >= 80
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-800 dark:text-amber-200'
        }`}>
          <Award className={`w-7 h-7 ${overallAccuracy >= 80 ? 'text-emerald-600' : 'text-amber-600'}`} />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider">判定ステータス</div>
            <div className="text-base font-black">
              {overallAccuracy >= 80 ? '合格水準クリア 🎯' : '目標ラインまであと少し 🚀'}
            </div>
          </div>
        </div>
      </div>

      {/* サマリーカード 4枚 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">全体正答率</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
            {overallAccuracy}%
          </div>
          <div className="text-xs text-slate-400 mt-1">完全正解: {fullyCorrectCount}問</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">本日の解答数</div>
          <div className="text-3xl font-black text-violet-600 dark:text-violet-400 mt-2">
            {todayCount}
            <span className="text-sm text-slate-400 font-normal"> / {progress.dailyGoal}問</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">本日正答率: {todayAccuracy}%</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">解答済み / 全問題</div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2">
            {totalAnswered}
            <span className="text-sm text-slate-400 font-normal"> / {allQuizzes.length}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">未踏問題: {unattemptedCount}問</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">連続学習記録</div>
          <div className="text-3xl font-black text-amber-500 mt-2 flex items-center gap-1">
            🔥 {progress.streak.current}
            <span className="text-sm font-normal text-slate-500">日</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">ブックマーク: {progress.bookmarks.length}件</div>
        </div>
      </div>

      {/* 数直線・プログレスゲージ（80%合格ライン明示） */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🎯</span>
            正答率ゲージ（80% 合格ライン）
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            赤点線が合格基準ライン（80%）です。全カテゴリで基準突破を目指しましょう。
          </p>
        </div>

        {/* 全体ゲージ */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-800 dark:text-slate-200">総合正答率</span>
            <span className={overallAccuracy >= 80 ? 'text-emerald-600' : 'text-indigo-600'}>
              {overallAccuracy}% {overallAccuracy >= 80 ? '(合格水準)' : ''}
            </span>
          </div>

          <div className="relative w-full h-7 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* バー */}
            <div
              className={`h-full transition-all duration-700 rounded-l-xl ${
                overallAccuracy >= 80
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-500'
              }`}
              style={{ width: `${Math.min(100, overallAccuracy)}%` }}
            />
            {/* 80%ライン */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 border-r-2 border-dashed border-rose-500 z-10"
              style={{ left: '80%' }}
            />
            <div 
              className="absolute top-1 text-[10px] font-black text-rose-600 dark:text-rose-400 bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded shadow -translate-x-1/2 z-20 pointer-events-none"
              style={{ left: '80%' }}
            >
              80% 合格
            </div>
          </div>
        </div>

        {/* カテゴリ別ゲージ一覧 */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">カテゴリ別 正答率</h4>
          
          <div className="space-y-4">
            {categoryStats.map(stat => (
              <div key={stat.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">
                    {stat.category} ({stat.answered}/{stat.total}問 解答)
                  </span>
                  <span className={stat.accuracy >= 80 ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-400'}>
                    {stat.accuracy}%
                  </span>
                </div>

                <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div
                    className={`h-full transition-all duration-500 rounded-l-lg ${
                      stat.accuracy >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, stat.accuracy)}%` }}
                  />
                  {/* 80% 目安ライン */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 border-r border-dashed border-rose-400 z-10"
                    style={{ left: '80%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 成長推移 折れ線グラフ（SVG） */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            日次学習推移（解答数 & 正答数）
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            日々の積み重ねが可視化されます。
          </p>
        </div>

        {/* 折れ線・棒グラフSVG描画 */}
        <div className="w-full h-48 pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
            {/* グリッド線 */}
            <line x1="40" y1="20" x2="480" y2="20" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.2" />
            <line x1="40" y1="70" x2="480" y2="70" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.2" />
            <line x1="40" y1="120" x2="480" y2="120" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />

            {chartData.map((d, i) => {
              const x = 50 + (i * (420 / Math.max(1, chartData.length - 1)));
              const maxVal = Math.max(10, ...chartData.map(c => c.count));
              const yTotal = 120 - ((d.count / maxVal) * 90);
              const yCorrect = 120 - ((d.correctCount / maxVal) * 90);

              return (
                <g key={d.date}>
                  {/* 解答数の棒 */}
                  <rect
                    x={x - 12}
                    y={yTotal}
                    width="10"
                    height={120 - yTotal}
                    fill="#6366f1"
                    rx="2"
                    opacity="0.8"
                  />
                  {/* 正答数の棒 */}
                  <rect
                    x={x}
                    y={yCorrect}
                    width="10"
                    height={120 - yCorrect}
                    fill="#10b981"
                    rx="2"
                    opacity="0.8"
                  />
                  {/* 日付ラベル */}
                  <text
                    x={x}
                    y="140"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                  >
                    {d.date.slice(5)}
                  </text>
                  {/* 数値ラベル */}
                  <text
                    x={x - 7}
                    y={Math.max(15, yTotal - 4)}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#6366f1"
                  >
                    {d.count}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-indigo-500" />
            <span>総解答数</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span>完全正解数</span>
          </div>
        </div>
      </div>

      {/* クラウド同期・ログイン（拡張インターフェース） */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <Database className="w-48 h-48" />
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            クラウド同期（オプション）
          </div>
          <h3 className="text-xl font-bold">Google Cloud / Firebase 同期機能</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            現在はブラウザのLocalStorageで高速・プライベートに学習履歴を保持しています。
            複数端末（スマホ・PC）間で学習進捗やストリークを共有したい場合は、自己責任でFirebase等の接続設定を行うことができます。
          </p>

          <div className="pt-2">
            <button
              onClick={() => alert('Firebase Auth / Firestore 連携設定は config/firebase.ts でプロジェクトIDを指定することで有効化できます。現在は安全な完全ローカル保存で動作しています。')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              クラウド同期設定（準備完了）
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
