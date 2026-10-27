import React, { useState } from 'react';
import { QuizQuestion, UserProgress, SpacedRepetitionItem } from '../types/quiz';
import { 
  Clock, Calendar, Award, ChevronRight, 
  RotateCcw, Play, X, ArrowRight, AlertCircle
} from 'lucide-react';
import { getTodayString } from '../utils/storage';

interface ReviewWorkspaceViewProps {
  progress: UserProgress;
  allQuizzes: QuizQuestion[];
  onStartReviewSession: (quizIds: string[], sessionTitle: string) => void;
  onResetQuizProgress: (quizId: string) => void;
  onCleanOrphanData?: () => void;
}

// 忘却曲線の5ステージ定義
const STAGES = [
  {
    stage: 1 as const,
    label: '1日後',
    badgeText: '1日後',
    colorClasses: {
      badgeBg: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/20',
      rowBorder: 'border-sky-100 dark:border-sky-950/50',
    },
    hasClock: true,
  },
  {
    stage: 2 as const,
    label: '3日後',
    badgeText: '3日後',
    colorClasses: {
      badgeBg: 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/20',
      rowBorder: 'border-rose-100 dark:border-rose-950/50',
    },
    hasClock: false,
  },
  {
    stage: 3 as const,
    label: '1週間後',
    badgeText: '1週間後',
    colorClasses: {
      badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
      rowBorder: 'border-emerald-100 dark:border-emerald-950/50',
    },
    hasClock: false,
  },
  {
    stage: 4 as const,
    label: '2週間後',
    badgeText: '2週間後',
    colorClasses: {
      badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/20',
      rowBorder: 'border-amber-100 dark:border-amber-950/50',
    },
    hasClock: false,
  },
  {
    stage: 5 as const,
    label: '1ヶ月後',
    badgeText: '1ヶ月後',
    colorClasses: {
      badgeBg: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/20',
      rowBorder: 'border-violet-100 dark:border-violet-950/50',
    },
    hasClock: false,
  },
];

export const ReviewWorkspaceView: React.FC<ReviewWorkspaceViewProps> = ({
  progress,
  allQuizzes,
  onStartReviewSession,
  onResetQuizProgress,
  onCleanOrphanData,
}) => {
  const today = getTodayString();
  const quizMap = new Map<string, QuizQuestion>();
  allQuizzes.forEach(q => quizMap.set(q.id, q));

  // 選択された日別履歴モーダル用
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);
  // 完全習得アコーディオン開閉
  const [showCompletedList, setShowCompletedList] = useState<boolean>(false);
  // クリーンアップ処理中ステート
  const [isCleaning, setIsCleaning] = useState<boolean>(false);

  // 忘却曲線アイテム一覧（全件 & 実体が存在する有効アイテムのみ抽出）
  const rawSrItems = Object.values(progress.spacedRepetition || {});
  const orphanItems = rawSrItems.filter(item => !quizMap.has(item.quizId));
  const orphanCount = orphanItems.length;
  const srItems = rawSrItems.filter(item => quizMap.has(item.quizId));

  const handleCleanOrphanData = async () => {
    if (isCleaning) return;
    setIsCleaning(true);
    try {
      if (onCleanOrphanData) {
        await onCleanOrphanData();
      } else {
        orphanItems.forEach(item => onResetQuizProgress(item.quizId));
      }
    } finally {
      setIsCleaning(false);
    }
  };

  // 日付フォーマット補助 (2026-05-03 -> 5/3)
  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
    }
    return dateStr;
  };

  // 各ステージごとの「初回解答日別」グループカード生成
  const getStageGroups = (stageNum: 1 | 2 | 3 | 4 | 5) => {
    // 該当ステージで、かつ今日時点で復習期日を迎えているもの (nextReviewDate <= today)
    const dueItems = srItems.filter(
      item =>
        quizMap.has(item.quizId) &&
        item.currentStage === stageNum &&
        item.nextReviewDate &&
        item.nextReviewDate <= today
    );

    // firstAnsweredDate でグルーピング（自動分割仕様）
    const groupsMap = new Map<string, SpacedRepetitionItem[]>();
    dueItems.forEach(item => {
      const fDate = item.firstAnsweredDate || today;
      if (!groupsMap.has(fDate)) {
        groupsMap.set(fDate, []);
      }
      groupsMap.get(fDate)!.push(item);
    });

    // 初回解答日の古い順（最古が左）に昇順ソート
    const sortedDates = Array.from(groupsMap.keys()).sort((a, b) => a.localeCompare(b));
    return sortedDates.map(date => ({
      firstAnsweredDate: date,
      items: groupsMap.get(date)!,
    }));
  };

  // 完全習得（completed）アイテム
  const completedItems = srItems.filter(
    item => quizMap.has(item.quizId) && item.currentStage === 'completed'
  );

  // 本日復習期日を迎えている全アイテム（全ステージ一括用）
  const allDueItems = srItems.filter(item => 
    quizMap.has(item.quizId) &&
    item.currentStage !== 'completed' &&
    item.nextReviewDate &&
    item.nextReviewDate <= today
  );
  // N6: 期日が古い順 → ステージが低い順 → 初回解答日が古い順 で優先ソート
  const stageRank = (stage: SpacedRepetitionItem['currentStage']) =>
    stage === 'completed' ? 99 : stage;
  const sortedDueItems = [...allDueItems].sort((a, b) => {
    return (
      a.nextReviewDate.localeCompare(b.nextReviewDate) ||
      stageRank(a.currentStage) - stageRank(b.currentStage) ||
      a.firstAnsweredDate.localeCompare(b.firstAnsweredDate) ||
      a.quizId.localeCompare(b.quizId)
    );
  });
  const allDueQuizIds = sortedDueItems.map(item => item.quizId);
  const weakCount = Object.values(progress.history || {}).filter(
    h => quizMap.has(h.quizId) && !h.isFullyCorrect
  ).length;

  const startReviewChunk = (count: number) => {
    onStartReviewSession(
      allDueQuizIds.slice(0, count),
      count >= allDueQuizIds.length
        ? `本日の復習一括（全${allDueQuizIds.length}問）`
        : `本日の復習（優先${count}問 / 残り${allDueQuizIds.length - count}問）`
    );
  };

  // 日別解答ログ（最古が左）
  const dailyLogsMap = progress.dailyLogs || {};
  const sortedLogDates = Object.keys(dailyLogsMap).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 旧問題（孤立ID）クリーンアップ案内バナー */}
      {orphanCount > 0 && (
        <div className="px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-800 dark:text-amber-200 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              データ更新に伴う旧問題の復習データが <strong className="font-black">{orphanCount}件</strong> あります
            </span>
          </div>
          <button
            onClick={handleCleanOrphanData}
            disabled={isCleaning}
            className="self-end sm:self-auto px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isCleaning ? '整理中...' : '今すぐ整理する'}
          </button>
        </div>
      )}

      {/* 1. 復習おすすめ機能領域（エビングハウスの忘却曲線レコメンド） */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* ヘッダーバナー（イメージ案準拠） */}
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-violet-950/40 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  解き直し・復習おすすめ機能
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                初めて解いた日を基準に、最適なタイミングで復習できる機能（エビングハウスの忘却曲線）。ホームの「直近の誤答」とは別の、本日期日到来分です。
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 self-start sm:self-auto">
              <Calendar className="w-3.5 h-3.5" />
              <span>本日: {formatShortDate(today)}</span>
            </div>
          </div>

          <div className="mt-3.5 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <span className="text-indigo-500 font-bold shrink-0">💡 使い方:</span>
            <span>初めて解いた日ごとに1〜複数問をまとめて、1つのボタンで一気に復習できます。期日前の解き直しではステージは進まず、期日を迎えて正解すると次のステージへ進みます。</span>
          </div>

          {/* ① 本日の復習一括スタートバナー */}
          <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                allDueQuizIds.length > 0 
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20' 
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              }`}>
                {allDueQuizIds.length > 0 ? <Play className="w-5 h-5 fill-current ml-0.5" /> : '🎉'}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  本日の復習タスク（期日到来分）
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                  {allDueQuizIds.length > 0 ? (
                    <>期日を迎えた問題が <span className="text-indigo-600 dark:text-indigo-400 text-lg">{allDueQuizIds.length}</span> 問あります</>
                  ) : (
                    <>本日の復習はすべて完了しています！</>
                  )}
                </div>
              </div>
            </div>

            {allDueQuizIds.length > 0 ? (
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <div className="flex flex-wrap items-center gap-2">
                  {allDueQuizIds.length > 20 ? (
                    <>
                      <button
                        onClick={() => startReviewChunk(20)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>今日は20問だけ</span>
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => startReviewChunk(10)}
                        className="px-3 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-xs font-bold transition-colors"
                      >
                        10問
                      </button>
                      <button
                        onClick={() => startReviewChunk(allDueQuizIds.length)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
                      >
                        全{allDueQuizIds.length}問
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startReviewChunk(allDueQuizIds.length)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>今日の{allDueQuizIds.length}問を一括スタート</span>
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-left sm:text-right">
                  優先順: 期日が古い順 → ステージが低い順。残り{allDueQuizIds.length}問を分割して開始できます。
                </p>
              </div>
            ) : (
              <div className="text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 self-start sm:self-auto max-w-xs">
                <div>本日期日の復習はありません ✓</div>
                {weakCount > 0 && (
                  <div className="mt-0.5 font-normal text-[11px] text-emerald-800/80 dark:text-emerald-200/80">
                    直近の誤答 {weakCount}問は、ホームの「苦手特訓（直近の誤答）」から解けます。
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 5行の復習タイミングテーブル */}
        <div className="p-3 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800/80">
          {STAGES.map((stg) => {
            const groups = getStageGroups(stg.stage);
            const totalQuestionsInStage = groups.reduce((sum, g) => sum + g.items.length, 0);

            return (
              <div 
                key={stg.stage} 
                className="py-4 sm:py-5 first:pt-2 last:pb-2 flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4"
              >
                {/* 縦軸：行見出しタイミングバッジ */}
                <div className="w-full md:w-36 shrink-0 flex items-center justify-between md:justify-start gap-2.5">
                  <div className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm shrink-0 ${stg.colorClasses.badgeBg}`}>
                    {stg.hasClock && <Clock className="w-3.5 h-3.5" />}
                    <span>{stg.badgeText}</span>
                  </div>

                  {/* モバイル用：件数バッジ */}
                  <span className="md:hidden text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {totalQuestionsInStage}問
                  </span>
                </div>

                {/* 横軸：初回解答日別グループカード（横スクロール & 自動分割） */}
                <div className="flex-1 min-w-0">
                  {groups.length === 0 ? (
                    <div className="py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
                      現在、復習期日を迎えている問題はありません（完了または次回待ち）
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                      {groups.map((grp) => {
                        const quizIds = grp.items.map(i => i.quizId);
                        const cardTitle = `${formatShortDate(grp.firstAnsweredDate)} 初めて解いた`;

                        return (
                          <div
                            key={grp.firstAnsweredDate}
                            className="shrink-0 w-60 sm:w-64 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                                  {cardTitle}
                                </span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                  {grp.items.length}問
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                忘却曲線: {stg.label}のタイミング
                              </p>
                            </div>

                            <button
                              onClick={() => onStartReviewSession(quizIds, `${cardTitle}（${stg.label}復習）`)}
                              className="mt-3.5 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <span>まとめて解き直す</span>
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 2. 完全習得（マスター／殿堂入り）リスト領域 */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        <button
          onClick={() => setShowCompletedList(!showCompletedList)}
          aria-expanded={showCompletedList}
          aria-controls="completed-mastered-list"
          className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>🏆 完全習得（マスター）した問題</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  {completedItems.length}問
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1ヶ月後の最終復習までクリアし、長期記憶に定着した問題の殿堂入りリスト
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showCompletedList ? 'rotate-90' : ''}`} />
        </button>

        {showCompletedList && (
          <div id="completed-mastered-list" className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
            {completedItems.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
                まだ完全習得した問題はありません。復習を重ねて1ヶ月後をクリアするとここに記録されます！
              </p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {completedItems.map(item => {
                  const q = quizMap.get(item.quizId);
                  if (!q) return null;
                  return (
                    <div 
                      key={item.quizId}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mr-2">
                          {q.category}
                        </span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {q.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onStartReviewSession([q.id], '完全習得問題の腕試し')}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold transition-colors"
                        >
                          演習
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('この問題の進捗をリセットして最初からやり直しますか？')) {
                              onResetQuizProgress(q.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
                          title="進捗をリセットして最初から解き直す"
                          aria-label="この問題の復習進捗をリセット"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. 日別・全解答履歴領域（最下部・仕様書第4項） */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span>日別・全解答履歴</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              過去に問題を解いたすべての日別履歴。カードをタップするとその日の結果確認と再演習ができます。
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            全 {sortedLogDates.length} 日間
          </span>
        </div>

        {sortedLogDates.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            まだ学習履歴がありません。クイズを解くと日別の履歴がここに記録されます。
          </div>
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            {sortedLogDates.map(dateStr => {
              const records = dailyLogsMap[dateStr] || [];
              const totalCount = records.length;
              const uniqueCount = new Set(records.map(r => r.quizId)).size;
              const correctCount = records.filter(r => r.isFullyCorrect).length;
              const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedHistoryDate(dateStr)}
                  className="shrink-0 w-52 sm:w-56 bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50/50 dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {formatShortDate(dateStr)}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 font-semibold" title={`ユニーク: ${uniqueCount}問 / 延べ解答: ${totalCount}回`}>
                      {uniqueCount === totalCount ? `全${totalCount}問` : `${uniqueCount}問 (延べ${totalCount})`}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">正答率</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{accuracy}%</span>
                    </div>
                    <div
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-label={`${formatShortDate(dateStr)}の正答率`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={accuracy}
                    >
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>履歴を見る</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. 日別解答履歴モーダル（仕様書第4項完全準拠） */}
      {selectedHistoryDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="daily-history-title"
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
          >
            
            {/* モーダルヘッダー */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
              <div>
                <h3 id="daily-history-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                  <span>{formatShortDate(selectedHistoryDate)} の解答履歴</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedHistoryDate} に解いたすべてのクイズログ
                </p>
              </div>
              <button
                onClick={() => setSelectedHistoryDate(null)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                aria-label="日別履歴を閉じる"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* モーダルコンテンツ（正答率 & 問題リスト） */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {(() => {
                const records = dailyLogsMap[selectedHistoryDate] || [];
                const totalCount = records.length;
                const correctCount = records.filter(r => r.isFullyCorrect).length;
                const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

                return (
                  <>
                    {/* その日のサマリー */}
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-around text-center">
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">総解答数</span>
                        <span className="text-lg font-black text-slate-900 dark:text-slate-100">{totalCount}問</span>
                      </div>
                      <div className="w-px h-8 bg-indigo-200 dark:bg-indigo-800" />
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">完全正解</span>
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{correctCount}問</span>
                      </div>
                      <div className="w-px h-8 bg-indigo-200 dark:bg-indigo-800" />
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">正答率</span>
                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{accuracy}%</span>
                      </div>
                    </div>

                    {/* 問題一覧 */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                        解いた問題一覧 ({records.length}件)
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {records.map((rec, i) => {
                          const q = quizMap.get(rec.quizId);
                          return (
                            <div
                              key={`${rec.quizId}_${i}`}
                              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2.5 text-xs"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                                  <span>{q?.category || rec.category}</span>
                                  <span>•</span>
                                  <span>{rec.answeredAt.split('T')[1]?.slice(0, 5) || ''}</span>
                                </div>
                                <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                  {q?.question || `問題 ID: ${rec.quizId}`}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] shrink-0 ${
                                rec.isFullyCorrect
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              }`}>
                                {rec.isFullyCorrect ? '正解 ✓' : '不正解 ✕'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* モーダルフッター（再演習ボタン） */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedHistoryDate(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                閉じる
              </button>
              {(() => {
                const records = dailyLogsMap[selectedHistoryDate] || [];
                const uniqueQuizIds = Array.from(
                  new Set(records.map(r => r.quizId).filter(id => quizMap.has(id)))
                );

                return (
                  <button
                    disabled={uniqueQuizIds.length === 0}
                    onClick={() => {
                      const d = selectedHistoryDate;
                      setSelectedHistoryDate(null);
                      onStartReviewSession(uniqueQuizIds, `${formatShortDate(d)} の問題を再演習`);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                  >
                    <span>この日の問題をもう一度解く ({uniqueQuizIds.length}問)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                );
              })()}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};