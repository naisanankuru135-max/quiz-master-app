import React from 'react';
import { UserProgress, QuizQuestion } from '../types/quiz';
import { Award, TrendingUp, BarChart3, Trophy } from 'lucide-react';
import { ALL_ACHIEVEMENTS, checkUnlockedAchievements } from '../utils/achievements';
import { getTodayString, getTodayStudyCount, getTodayMockCount } from '../utils/storage';

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

  const todayStr = getTodayString();
  const todayCount = getTodayStudyCount(progress);
  const todayMockCount = getTodayMockCount(progress);
  const todayLogs = progress.dailyLogs?.[todayStr] || [];
  const todayStudyLogs = todayLogs.filter(log => log.mode !== 'mockTest');
  const todayAccuracy = todayStudyLogs.length > 0
    ? Math.round((todayStudyLogs.filter(log => log.isFullyCorrect).length / todayStudyLogs.length) * 100)
    : 0;

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

  // 模試履歴（新しい順）
  const mockHistory = progress.mockHistory || [];
  const recentMocks = mockHistory.slice(0, 10);
  const latestMock = mockHistory[0];
  const bestMockAccuracy = mockHistory.length > 0
    ? Math.max(...mockHistory.map(m => m.accuracy))
    : 0;
  const averageMockAccuracy = mockHistory.length > 0
    ? Math.round(mockHistory.reduce((sum, m) => sum + m.accuracy, 0) / mockHistory.length)
    : 0;
  const mockPassedCount = mockHistory.filter(m => m.passed).length;
  const formatElapsed = (seconds: number) => {
    const safe = Math.max(0, Math.floor(seconds));
    return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
  };

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
          <div className="text-xs text-slate-500 font-medium">本日の学習数</div>
          <div className="text-3xl font-black text-violet-600 dark:text-violet-400 mt-2">
            {todayCount}
            <span className="text-sm text-slate-400 font-normal"> / {progress.dailyGoal}問</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">本日正答率: {todayAccuracy}%</div>
          {todayMockCount > 0 && (
            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
              模試 {todayMockCount}問は別カウント
            </div>
          )}
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

      {/* 本番模試の履歴（N4: 結果の永続保存） */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>📝</span>
              本番模試の履歴
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              40問・40分の模試結果を自動保存。リロードしても消えません（最大50回分）。
            </p>
          </div>
          {mockHistory.length > 0 && (
            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {mockHistory.length}回受験
            </span>
          )}
        </div>

        {mockHistory.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">まだ模試の記録がありません</p>
            <p className="text-xs text-slate-400 mt-1">ホームの「本番模試」に挑戦すると、結果がここに保存されます。</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-300">最新スコア</div>
                <div className="text-xl font-black text-indigo-700 dark:text-indigo-200 mt-1">
                  {latestMock?.score ?? 0}
                  <span className="text-xs font-normal text-slate-400"> / {latestMock?.total ?? 0}問</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{latestMock?.date ?? '-'}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-300">最高正答率</div>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-200 mt-1">{bestMockAccuracy}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">自己ベスト</div>
              </div>

              <div className="p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900">
                <div className="text-[11px] font-bold text-violet-600 dark:text-violet-300">平均正答率</div>
                <div className="text-xl font-black text-violet-700 dark:text-violet-200 mt-1">{averageMockAccuracy}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">全{mockHistory.length}回</div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900">
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-300">合格回数</div>
                <div className="text-xl font-black text-amber-700 dark:text-amber-200 mt-1">{mockPassedCount}回</div>
                <div className="text-[11px] text-slate-400 mt-0.5">合格基準 80%</div>
              </div>
            </div>

            <div className="space-y-2.5">
              {recentMocks.map(m => (
                <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-black text-slate-700 dark:text-slate-200 shrink-0">{m.date.slice(5)}</span>
                      <span className="font-bold text-slate-600 dark:text-slate-300 truncate">
                        {m.score}/{m.total}問正解
                      </span>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-black border ${
                      m.passed
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    }`}>
                      {m.accuracy}% {m.passed ? '合格' : '不合格'}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.passed ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, m.accuracy)}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
                    <span>所要 {formatElapsed(m.elapsedSeconds)}</span>
                    <span>不正解 {m.incorrectIds.length}問</span>
                    <span>{new Date(m.completedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ⑧ アチーブメント・称号コレクション */}
      {(() => {
        const unlockedIds = new Set(checkUnlockedAchievements(progress, allQuizzes));
        const unlockedCount = ALL_ACHIEVEMENTS.filter(a => unlockedIds.has(a.id)).length;
        const percent = Math.round((unlockedCount / ALL_ACHIEVEMENTS.length) * 100);

        return (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    学習アチーブメント & 称号
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                      {unlockedCount} / {ALL_ACHIEVEMENTS.length} 獲得
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    学習の継続や忘却曲線のクリア、正答率に応じてアンロックされます
                  </p>
                </div>
              </div>

              {/* 進捗バー */}
              <div className="w-full sm:w-48 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>コンプリート率</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{percent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* バッジグリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {ALL_ACHIEVEMENTS.map(ach => {
                const isUnlocked = unlockedIds.has(ach.id);

                return (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-500/5 via-indigo-500/5 to-transparent border-amber-300/60 dark:border-amber-700/50 shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-800 opacity-50 grayscale'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900 border border-amber-300 dark:border-amber-700'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {ach.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                          {ach.title}
                        </span>
                        {isUnlocked && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                            獲得済
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

    </div>
  );
};
