import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { ALL_QUIZZES } from './data/quizzes';
import { QuizQuestion, UserProgress, QuizMode, ResumeSession, MockHistoryRecord } from './types/quiz';
import { 
  loadProgress, recordAnswer, saveActiveSession, 
  clearActiveSession, toggleBookmark, saveProgress,
  resetSpacedRepetition, getTodayString, getTodayStudyCount,
  addMockHistory, isAnswerFullyCorrect, cleanOrphanProgress
} from './utils/storage';
import { getDailyThirtyQuizzes } from './utils/prng';
import { sendStudyReminder } from './utils/notification';
import { ALL_ACHIEVEMENTS, checkUnlockedAchievements } from './utils/achievements';
import { Achievement } from './types/quiz';
import { 
  onAuthStatusChange, 
  fetchProgressFromCloud, 
  saveProgressToCloud, 
  mergeUserProgress,
  subscribeToCloudProgress 
} from './services/firebaseSync';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { QuizCard } from './components/QuizCard';
import { BottomNavBar, AppTab } from './components/BottomNavBar';

// 初回表示に不要な重量級ビューは遅延読み込み（D-2）
const ReviewWorkspaceView = lazy(() =>
  import('./components/ReviewWorkspaceView').then(m => ({ default: m.ReviewWorkspaceView }))
);
const DictionaryView = lazy(() =>
  import('./components/DictionaryView').then(m => ({ default: m.DictionaryView }))
);
const AnalyticsView = lazy(() =>
  import('./components/AnalyticsView').then(m => ({ default: m.AnalyticsView }))
);
const AiAssistantView = lazy(() =>
  import('./components/AiAssistantView').then(m => ({ default: m.AiAssistantView }))
);
const SettingsView = lazy(() =>
  import('./components/SettingsView').then(m => ({ default: m.SettingsView }))
);
const MockTestResultModal = lazy(() =>
  import('./components/MockTestResultModal').then(m => ({ default: m.MockTestResultModal }))
);
const QuizPermalinkView = lazy(() =>
  import('./components/QuizPermalinkView').then(m => ({ default: m.QuizPermalinkView }))
);
import { FACT_MAP, findQuizByParam } from './utils/quizPermalinkHelper';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [aiQuizContext, setAiQuizContext] = useState<QuizQuestion | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const [dictionaryKeyword, setDictionaryKeyword] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 個別パーマリンク表示判定（?q=1 や ?quizId=politics-001）
  const [permalinkTarget, setPermalinkTarget] = useState<null | {
    quiz: QuizQuestion;
    sequentialNumber: number;
    categoryNumber: number;
    userAnswers?: ('A' | 'B' | 'C' | 'D')[];
  }>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q') || params.get('quizId');
    if (!qParam) return null;
    const target = findQuizByParam(qParam);
    if (!target) return null;
    const userAnsParam = params.get('userAns');
    const userAnswers = userAnsParam
      ? (userAnsParam.split(',').filter(a => ['A', 'B', 'C', 'D'].includes(a)) as ('A' | 'B' | 'C' | 'D')[])
      : undefined;
    return { ...target, userAnswers };
  });

  const handleExitPermalink = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.pushState({}, '', cleanUrl);
    setPermalinkTarget(null);
    setActiveTab('home');
  };

  // 模試タイマー＆結果用ステート
  const [mockTimer, setMockTimer] = useState<number | null>(null);
  const [mockElapsedSeconds, setMockElapsedSeconds] = useState<number>(0);
  const [completedMockData, setCompletedMockData] = useState<{
    quizIds: string[];
    answers: Record<string, ('A' | 'B' | 'C' | 'D')[]>;
    elapsed: number;
  } | null>(null);

  // トースト自動消去
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // 現在実行中のクイズセッション
  const [currentSession, setCurrentSession] = useState<ResumeSession | null>(progress.activeSession);
  const [activeQuizList, setActiveQuizList] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 二重終了・タイマー時間切れの多重実行を防止
  const finishingRef = useRef(false);
  const mockTimeoutHandledRef = useRef(false);
  const finishSessionRef = useRef<() => void>(() => {});

  // セッション終了ハンドラー
  const handleFinishSession = () => {
    if (!currentSession || finishingRef.current) return;
    finishingRef.current = true;

    const finishedMode = currentSession.mode;
    const currentAnswers = currentSession.answers || {};
    const currentQuizIds = activeQuizList.length > 0
      ? activeQuizList.map(q => q.id)
      : currentSession.quizIds;
    const total = currentQuizIds.length;

    const isCorrect = (quiz: QuizQuestion) => {
      const answers = currentAnswers[quiz.id];
      return answers ? isAnswerFullyCorrect(answers, quiz.correctAnswers) : false;
    };
    const score = activeQuizList.filter(isCorrect).length;

    let mockRecord: MockHistoryRecord | null = null;
    let elapsed = mockElapsedSeconds;

    if (finishedMode === 'mockTest') {
      // 経過時間は「終了時刻 - 開始時刻」で算出（リロード・タブ離脱でも正確）
      const duration = currentSession.mockDurationSeconds ?? 40 * 60;
      if (currentSession.mockDeadline) {
        const remaining = Math.max(0, Math.ceil((currentSession.mockDeadline - Date.now()) / 1000));
        elapsed = Math.min(duration, Math.max(0, duration - remaining));
      }

      const categoryStats: Record<string, { correct: number; total: number }> = {};
      const incorrectIds: string[] = [];
      activeQuizList.forEach(q => {
        const stat = categoryStats[q.category] || (categoryStats[q.category] = { correct: 0, total: 0 });
        stat.total += 1;
        if (isCorrect(q)) {
          stat.correct += 1;
        } else {
          incorrectIds.push(q.id);
        }
      });

      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      mockRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        completedAt: new Date().toISOString(),
        date: getTodayString(),
        score,
        total,
        accuracy,
        elapsedSeconds: elapsed,
        passed: accuracy >= 80,
        categoryStats,
        incorrectIds,
      };

      // 模試結果モーダルを表示
      setCompletedMockData({
        quizIds: currentQuizIds,
        answers: currentAnswers,
        elapsed,
      });
      setMockTimer(null);
    } else {
      // 通常モード完了時：alert を使わずトースト表示
      setToastMessage('🎉 セッションが完了しました！成績を確認しましょう。');
    }

    // デイリー完了時は activeSession クリアと完了記録を1回の保存にまとめる
    const cleared = clearActiveSession(undefined, finishedMode !== 'daily30');
    let updated = cleared;
    if (finishedMode === 'daily30') {
      updated = {
        ...cleared,
        dailyCompletedDate: getTodayString(),
        dailyCompletedQuizIds: currentQuizIds,
      };
      saveProgress(updated);
    }
    if (mockRecord) {
      updated = addMockHistory(mockRecord);
    }
    setCurrentSession(null);
    setProgress(updated);
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, updated).catch(err => {
        console.error('Session complete cloud save error:', err);
      });
    }

    if (finishedMode === 'mockTest') {
      setActiveTab('home');
    } else if (finishedMode === 'spacedRepetition' || finishedMode === 'dailyHistory') {
      setActiveTab('review');
    } else if (finishedMode === 'dictionarySearch') {
      setActiveTab('dictionary');
    } else {
      setActiveTab('analytics');
    }
  };

  // 最新のハンドラーをタイマーから呼ぶための参照
  finishSessionRef.current = handleFinishSession;

  // 模試タイマー（開始時刻ベース。タブを離れても・リロードしても残り時間を維持）
  useEffect(() => {
    const session = currentSession;
    if (!session || session.mode !== 'mockTest' || !session.mockDeadline) return;
    // 再開前（activeQuizList が空）に時間切れ判定しない
    if (activeQuizList.length === 0) return;

    const duration = session.mockDurationSeconds ?? 40 * 60;
    const deadline = session.mockDeadline;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setMockTimer(remaining);
      setMockElapsedSeconds(Math.min(duration, Math.max(0, duration - remaining)));

      if (remaining <= 0 && !mockTimeoutHandledRef.current) {
        mockTimeoutHandledRef.current = true;
        setToastMessage('⏱️ 模試の制限時間（40分）が終了しました！');
        finishSessionRef.current();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    // バックグラウンドから戻った瞬間に catch-up
    const handleVisibility = () => tick();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [currentSession?.mode, currentSession?.mockDeadline, currentSession?.mockDurationSeconds, activeQuizList.length]);

  // 認証リスナー＆リアルタイムクラウド同期
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStatusChange(async (user) => {
      setCurrentUser(user);
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (user) {
        try {
          // 初回フェッチ & マージ
          const validIds = ALL_QUIZZES.map(q => q.id);
          const cloudProgress = await fetchProgressFromCloud(user.uid);
          if (cloudProgress) {
            const currentLocal = loadProgress();
            const merged = mergeUserProgress(currentLocal, cloudProgress, validIds);
            saveProgress(merged);
            setProgress(merged);
            setCurrentSession(merged.activeSession);
            await saveProgressToCloud(user.uid, merged);
          } else {
            await saveProgressToCloud(user.uid, loadProgress());
          }

          // リアルタイムリスナー開始（別端末での中断・進捗の更新を即時キャッチ）
          unsubscribeSnapshot = subscribeToCloudProgress(user.uid, (cloudProgress) => {
            const currentLocal = loadProgress();
            const merged = mergeUserProgress(currentLocal, cloudProgress, validIds);
            saveProgress(merged);
            setProgress(merged);
            setCurrentSession(merged.activeSession);
          });
        } catch (err) {
          console.error('Initial cloud sync error:', err);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // 起動時：問題データ再生成に伴う旧問題（孤立ID）の自動整合性クリーンアップ
  useEffect(() => {
    const validIds = ALL_QUIZZES.map(q => q.id);
    const { cleanedCount, progress: updated } = cleanOrphanProgress(validIds);
    if (cleanedCount > 0) {
      setProgress(updated);
      console.log(`[Storage] Cleaned ${cleanedCount} orphaned quiz progress items.`);
    }
  }, []);

  // ダークモードクラス適用
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 学習リマインダーのローカルスケジューラ（N13 / D-4）
  // アプリ起動中は1分ごと、復帰時・起動時に通知時刻を過ぎていれば1日1回通知する。
  useEffect(() => {
    if (!progress.notificationEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const checkReminder = () => {
      const today = getTodayString();
      if (progress.lastNotificationDate === today) return;
      if (getTodayStudyCount(progress) >= progress.dailyGoal) return;

      const [hour, minute] = (progress.notificationTime || '20:00').split(':').map(Number);
      const now = new Date();
      const target = new Date(now);
      target.setHours(Number.isFinite(hour) ? hour : 20, Number.isFinite(minute) ? minute : 0, 0, 0);
      if (now.getTime() < target.getTime()) return;

      if (sendStudyReminder('今日の30問がまだ残っています。復習期日も確認して、連続記録をつなげましょう！🔥')) {
        const next = { ...progress, lastNotificationDate: today };
        saveProgress(next);
        setProgress(next);
        if (currentUser) {
          saveProgressToCloud(currentUser.uid, next).catch(err => {
            console.error('Notification state cloud save error:', err);
          });
        }
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60_000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkReminder();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', checkReminder);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', checkReminder);
    };
  }, [progress, currentUser]);

  // モード開始ハンドラー
  const handleStartMode = (mode: QuizMode, category?: string, count?: number) => {
    // 進行中のセッションがある場合の確認ダイアログ
    if (currentSession && Object.keys(currentSession.answers || {}).length > 0) {
      const confirmOverwrite = window.confirm('進行中のセッション（中断データ）があります。破棄して新しいモードを開始しますか？');
      if (!confirmOverwrite) return;
    }

    let targetQuizzes: QuizQuestion[] = [];
    const historyList = Object.values(progress.history);
    const attemptedIds = new Set(historyList.map(h => h.quizId));

    if (mode === 'daily30') {
      const today = getTodayString();
      if (progress.dailyCompletedDate === today && progress.dailyCompletedQuizIds?.length) {
        // 本日完了後の再挑戦は、新しい30問を作らず「同じ30問」を同じ順序で復習する
        const quizMap = new Map(ALL_QUIZZES.map(q => [q.id, q]));
        targetQuizzes = progress.dailyCompletedQuizIds
          .map(id => quizMap.get(id))
          .filter((q): q is QuizQuestion => !!q);
      } else {
        // 今日の30問：PRNG日付シードによる決定論的シャッフル（未習得・復習優先配分）
        targetQuizzes = getDailyThirtyQuizzes(ALL_QUIZZES, today, progress);
      }
      setMockTimer(null);
      setMockElapsedSeconds(0);
    } else if (mode === 'unattempted') {
      // 未踏問題優先（指定問題数でスライス、デフォルト30問）
      const unattempted = ALL_QUIZZES.filter(q => !attemptedIds.has(q.id));
      const pool = unattempted.length > 0 ? unattempted : [...ALL_QUIZZES];
      if (unattempted.length === 0) {
        setToastMessage('すべての問題を解き終えました！全問制覇です。全問からランダム出題します。');
      }
      const limit = count || 30;
      targetQuizzes = pool.sort(() => 0.5 - Math.random()).slice(0, limit);
      setMockTimer(null);
      setMockElapsedSeconds(0);
    } else if (mode === 'reviewWeak') {
      // 不正解・部分正解の問題のみ
      const weak = ALL_QUIZZES.filter(q => {
        const rec = progress.history[q.id];
        return rec && !rec.isFullyCorrect;
      }).sort(() => 0.5 - Math.random());
      targetQuizzes = count ? weak.slice(0, count) : weak;
      setMockTimer(null);
      setMockElapsedSeconds(0);
    } else if (mode === 'bookmark') {
      // ブックマークした問題のみ
      const bookmarked = ALL_QUIZZES.filter(q => progress.bookmarks?.includes(q.id));
      targetQuizzes = count ? bookmarked.slice(0, count) : bookmarked;
      setMockTimer(null);
      setMockElapsedSeconds(0);
    } else if (mode === 'mockTest') {
      // 実力テスト：政治10問＋経済10問＋暮らし10問＋社会環境10問の計40問バランス選出・40分タイマー
      const pol = ALL_QUIZZES.filter(q => q.category === '政治').sort(() => 0.5 - Math.random()).slice(0, 10);
      const eco = ALL_QUIZZES.filter(q => q.category === '経済').sort(() => 0.5 - Math.random()).slice(0, 10);
      const liv = ALL_QUIZZES.filter(q => q.category === '暮らし').sort(() => 0.5 - Math.random()).slice(0, 10);
      const soc = ALL_QUIZZES.filter(q => q.category === '社会環境').sort(() => 0.5 - Math.random()).slice(0, 10);
      targetQuizzes = [...pol, ...eco, ...liv, ...soc].sort(() => 0.5 - Math.random());
      setMockTimer(40 * 60); // 40分
      setMockElapsedSeconds(0);
    } else if (mode === 'category' && category) {
      // カテゴリ別集中モード（指定問題数でスライス）
      const catList = ALL_QUIZZES.filter(q => q.category === category).sort(() => 0.5 - Math.random());
      targetQuizzes = count ? catList.slice(0, count) : catList;
      setMockTimer(null);
      setMockElapsedSeconds(0);
    }

    if (targetQuizzes.length === 0) {
      setToastMessage('出題対象の問題がありません。');
      return;
    }

    // 模試は開始時刻ベースの終了時刻を保存（リロード・再開・タブ離脱でも残り時間を維持）
    const mockDurationSeconds = mode === 'mockTest' ? 40 * 60 : undefined;
    const mockDeadline = mockDurationSeconds !== undefined
      ? Date.now() + mockDurationSeconds * 1000
      : undefined;
    mockTimeoutHandledRef.current = false;
    finishingRef.current = false;

    const newSession: ResumeSession = {
      mode,
      category,
      quizIds: targetQuizzes.map(q => q.id),
      currentIndex: 0,
      answers: {},
      timestamp: new Date().toISOString(),
      mockDurationSeconds,
      mockDeadline,
    };

    const updated = saveActiveSession(newSession);
    setCurrentSession(newSession);
    setActiveQuizList(targetQuizzes);
    setCurrentIndex(0);
    setProgress(updated);
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, updated).catch(err => {
        console.error('Session start cloud save error:', err);
      });
    }
    setActiveTab('quiz');
  };

  // 中断セッションの再開
  const handleResumeSession = () => {
    if (!progress.activeSession) return;
    const session = progress.activeSession;
    const quizzes = session.quizIds
      .map(id => ALL_QUIZZES.find(q => q.id === id))
      .filter((q): q is QuizQuestion => !!q);

    if (quizzes.length === 0) {
      const updated = clearActiveSession();
      setCurrentSession(null);
      setProgress(updated);
      setMockTimer(null);
      setMockElapsedSeconds(0);
      if (currentUser) {
        saveProgressToCloud(currentUser.uid, updated).catch(err => {
          console.error('Session clear cloud save error:', err);
        });
      }
      return;
    }

    let resumedSession = session;
    mockTimeoutHandledRef.current = false;
    finishingRef.current = false;
    if (session.mode === 'mockTest') {
      const duration = session.mockDurationSeconds ?? 40 * 60;
      const deadline = session.mockDeadline ?? Date.now() + duration * 1000;
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      const elapsed = Math.min(duration, Math.max(0, duration - remaining));

      // 旧セッション（deadline なし）はここで補完して保存
      if (!session.mockDeadline || !session.mockDurationSeconds) {
        resumedSession = { ...session, mockDurationSeconds: duration, mockDeadline: deadline };
        const saved = saveActiveSession(resumedSession);
        setProgress(saved);
        if (currentUser) {
          saveProgressToCloud(currentUser.uid, saved).catch(err => {
            console.error('Resume session cloud save error:', err);
          });
        }
      }

      setMockTimer(remaining);
      setMockElapsedSeconds(elapsed);
    } else {
      setMockTimer(null);
      setMockElapsedSeconds(0);
    }

    setCurrentSession(resumedSession);
    setActiveQuizList(quizzes);
    setCurrentIndex(Math.min(resumedSession.currentIndex, quizzes.length - 1));
    setActiveTab('quiz');
  };

  // 中断セッションの破棄
  const handleDiscardSession = () => {
    const updated = clearActiveSession();
    setCurrentSession(null);
    setProgress(updated);
    setMockTimer(null);
    setMockElapsedSeconds(0);
    mockTimeoutHandledRef.current = false;
    finishingRef.current = false;
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, updated).catch(err => {
        console.error('Session discard cloud save error:', err);
      });
    }
  };

  // 解答提出
  const handleAnswerSubmit = (quizId: string, selected: ('A' | 'B' | 'C' | 'D')[]) => {
    const currentQuiz = activeQuizList.find(q => q.id === quizId);
    if (!currentQuiz) return;

    // D-1: 1問の解答で localStorage を3回も書き換えないよう、
    // recordAnswer / saveActiveSession はメモリ上だけ更新し、最後に1回だけ保存する。
    let updatedProgress = recordAnswer(
      quizId,
      currentQuiz.category,
      selected,
      currentQuiz.correctAnswers,
      currentSession?.mode,
      false
    );

    if (currentSession) {
      const nextSession: ResumeSession = {
        ...currentSession,
        currentIndex,
        answers: {
          ...currentSession.answers,
          [quizId]: selected,
        },
        timestamp: new Date().toISOString(),
      };
      updatedProgress = saveActiveSession(nextSession, updatedProgress, false);
      setCurrentSession(nextSession);
    }

    // ⑧ 実績アンロック判定
    const beforeUnlocked = new Set(progress.unlockedAchievements || []);
    const afterUnlocked = checkUnlockedAchievements(updatedProgress, ALL_QUIZZES);
    const newlyUnlockedId = afterUnlocked.find(id => !beforeUnlocked.has(id));
    if (newlyUnlockedId) {
      const ach = ALL_ACHIEVEMENTS.find(a => a.id === newlyUnlockedId);
      if (ach) {
        setAchievementToast(ach);
        setTimeout(() => setAchievementToast(null), 4500);
      }
    }
    updatedProgress.unlockedAchievements = afterUnlocked;
    saveProgress(updatedProgress);

    setProgress(updatedProgress);

    // ログイン中ならクラウドへ自動保存
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, updatedProgress).catch(err => {
        console.error('Background cloud save error:', err);
      });
    }
  };

  // 次の問題へ
  const handleNextQuiz = () => {
    if (currentIndex + 1 < activeQuizList.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (currentSession) {
        const nextSession: ResumeSession = {
          ...currentSession,
          currentIndex: nextIdx,
        };
        const updated = saveActiveSession(nextSession);
        setCurrentSession(nextSession);
        setProgress(updated);
        if (currentUser) {
          saveProgressToCloud(currentUser.uid, updated).catch(err => {
            console.error('Next quiz cloud save error:', err);
          });
        }
      }
    } else {
      handleFinishSession();
    }
  };

  // 前の問題へ
  const handlePrevQuiz = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      if (currentSession) {
        const nextSession: ResumeSession = {
          ...currentSession,
          currentIndex: prevIdx,
        };
        const updated = saveActiveSession(nextSession);
        setCurrentSession(nextSession);
        setProgress(updated);
        if (currentUser) {
          saveProgressToCloud(currentUser.uid, updated).catch(err => {
            console.error('Prev quiz cloud save error:', err);
          });
        }
      }
    }
  };

  // 中断して戻る（保存して中断）
  const handleQuitQuiz = () => {
    let updated = loadProgress();
    const currentMode = currentSession?.mode;
    // 模試は中断後も制限時間が進むためタイマーを止めない
    if (currentMode !== 'mockTest') {
      setMockTimer(null);
      setMockElapsedSeconds(0);
    }
    if (currentSession) {
      const nextSession: ResumeSession = {
        ...currentSession,
        currentIndex,
        timestamp: new Date().toISOString(),
      };
      updated = saveActiveSession(nextSession);
      setCurrentSession(nextSession);
    }
    setProgress(updated);
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, updated).catch(err => {
        console.error('Quit quiz cloud save error:', err);
      });
    }
    if (currentMode === 'spacedRepetition' || currentMode === 'dailyHistory') {
      setActiveTab('review');
    } else if (currentMode === 'dictionarySearch') {
      setActiveTab('dictionary');
    } else {
      setActiveTab('home');
    }
  };

  // 辞書からの演習開始ハンドラー
  const handleStartDictionarySession = (quizIds: string[], sessionTitle: string) => {
    const targetQuizzes = quizIds
      .map(id => ALL_QUIZZES.find(q => q.id === id))
      .filter((q): q is QuizQuestion => !!q);

    if (targetQuizzes.length === 0) {
      setToastMessage('出題対象の問題が見つかりませんでした。');
      return;
    }

    setMockTimer(null);
    setMockElapsedSeconds(0);
    finishingRef.current = false;
    mockTimeoutHandledRef.current = false;

    const newSession: ResumeSession = {
      mode: 'dictionarySearch',
      category: sessionTitle,
      quizIds: targetQuizzes.map(q => q.id),
      currentIndex: 0,
      answers: {},
      timestamp: new Date().toISOString(),
    };

    setActiveQuizList(targetQuizzes);
    setCurrentIndex(0);
    setCurrentSession(newSession);

    const updated = saveActiveSession(newSession);
    setProgress(updated);
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, updated).catch(err => {
        console.error('Start dictionary session cloud save error:', err);
      });
    }
    setActiveTab('quiz');
  };

  // 復習セッション開始ハンドラー
  const handleStartReviewSession = (quizIds: string[], sessionTitle: string) => {
    const targetQuizzes = quizIds
      .map(id => ALL_QUIZZES.find(q => q.id === id))
      .filter((q): q is QuizQuestion => !!q);

    if (targetQuizzes.length === 0) {
      setToastMessage('出題対象の問題が見つかりませんでした。');
      return;
    }

    setMockTimer(null);
    setMockElapsedSeconds(0);
    finishingRef.current = false;
    mockTimeoutHandledRef.current = false;

    const newSession: ResumeSession = {
      mode: 'spacedRepetition',
      category: sessionTitle,
      quizIds: targetQuizzes.map(q => q.id),
      currentIndex: 0,
      answers: {},
      timestamp: new Date().toISOString(),
    };

    setActiveQuizList(targetQuizzes);
    setCurrentIndex(0);
    setCurrentSession(newSession);

    const updated = saveActiveSession(newSession);
    setProgress(updated);
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, updated).catch(err => {
        console.error('Start review session cloud save error:', err);
      });
    }
    setActiveTab('quiz');
  };

  // 1問の復習進捗リセットハンドラー
  const handleResetQuizProgress = (quizId: string) => {
    const updated = resetSpacedRepetition(quizId);
    setProgress(updated);
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, updated).catch(err => {
        console.error('Reset quiz progress cloud save error:', err);
      });
    }
    setToastMessage('この問題の復習進捗をリセットしました。');
  };

  // データ更新に伴う旧問題（孤立ID）の一括クリーンアップハンドラー
  const handleCleanOrphanData = async () => {
    const validIds = ALL_QUIZZES.map(q => q.id);
    const { cleanedCount, progress: updated } = cleanOrphanProgress(validIds, progress);
    setProgress(updated);
    if (currentUser) {
      try {
        await saveProgressToCloud(currentUser.uid, updated);
      } catch (err) {
        console.error('Clean orphan progress cloud save error:', err);
      }
    }
    if (cleanedCount > 0) {
      setToastMessage(`データ更新に伴う旧問題データ（${cleanedCount}件）を正常に整理しました。`);
    } else {
      setToastMessage('整理対象の旧問題データはありませんでした。');
    }
  };

  // ブックマーク切替
  const handleToggleBookmark = (quizId: string) => {
    toggleBookmark(quizId);
    const updated = loadProgress();
    setProgress(updated);
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, updated).catch(err => {
        console.error('Bookmark cloud save error:', err);
      });
    }
  };

  // リマインダー切替
  const handleNotifyToggle = () => {
    const p = loadProgress();
    const enabling = !p.notificationEnabled;
    p.notificationEnabled = enabling;
    if (enabling) {
      // 有効化直後の即時通知と、スケジューラの同日通知が重ならないようにする
      p.lastNotificationDate = getTodayString();
    }
    saveProgress(p);
    setProgress(p);
    if (currentUser) {
      saveProgressToCloud(currentUser.uid, p).catch(err => {
        console.error('Notification toggle cloud save error:', err);
      });
    }
  };

  // 個別パーマリンク閲覧モードのレンダリング
  if (permalinkTarget) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-bold text-slate-500">読み込み中...</div>}>
        <QuizPermalinkView
          quiz={permalinkTarget.quiz}
          quizSequentialNumber={permalinkTarget.sequentialNumber}
          categoryQuestionNumber={permalinkTarget.categoryNumber}
          userAnswers={permalinkTarget.userAnswers}
          factMap={FACT_MAP}
          onGoToApp={handleExitPermalink}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 共通ヘッダー */}
      <Header
        progress={progress}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNotifyToggle={handleNotifyToggle}
        onShowToast={setToastMessage}
        currentUser={currentUser}
      />

      {/* ⑧ 実績アンロックトースト通知 */}
      {achievementToast && (
        <div
          className="fixed top-20 right-4 sm:right-8 z-50 animate-bouncePop max-w-sm pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 text-white shadow-2xl shadow-amber-500/30 border border-amber-300/40 flex items-center gap-3.5 backdrop-blur">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
              {achievementToast.icon}
            </div>
            <div>
              <div className="text-[10px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full inline-block">
                🏆 新しいアチーブメント解除！
              </div>
              <h4 className="font-black text-sm sm:text-base mt-0.5">
                {achievementToast.title}
              </h4>
              <p className="text-xs text-amber-100 opacity-90 line-clamp-1">
                {achievementToast.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-24 md:pb-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20 text-sm font-bold text-slate-500 dark:text-slate-400" role="status" aria-live="polite">
              読み込み中...
            </div>
          }
        >
        {activeTab === 'home' && (
          <HomeDashboard
            progress={progress}
            allQuizzes={ALL_QUIZZES}
            onStartMode={handleStartMode}
            onResumeSession={handleResumeSession}
            onDiscardSession={handleDiscardSession}
            onShowToast={setToastMessage}
          />
        )}

        {activeTab === 'review' && (
          <ReviewWorkspaceView
            progress={progress}
            allQuizzes={ALL_QUIZZES}
            onStartReviewSession={handleStartReviewSession}
            onResetQuizProgress={handleResetQuizProgress}
            onCleanOrphanData={handleCleanOrphanData}
          />
        )}

        {activeTab === 'dictionary' && (
          <DictionaryView
            allQuizzes={ALL_QUIZZES}
            progress={progress}
            onStartQuizSession={handleStartDictionarySession}
            initialKeyword={dictionaryKeyword}
            onClearInitialKeyword={() => setDictionaryKeyword('')}
          />
        )}

        {activeTab === 'quiz' && activeQuizList[currentIndex] && (
          <QuizCard
            quiz={activeQuizList[currentIndex]}
            currentIndex={currentIndex}
            totalCount={activeQuizList.length}
            onAnswerSubmit={handleAnswerSubmit}
            onNext={handleNextQuiz}
            onPrev={handlePrevQuiz}
            onQuit={handleQuitQuiz}
            isBookmarked={progress.bookmarks.includes(activeQuizList[currentIndex].id)}
            onToggleBookmark={() => handleToggleBookmark(activeQuizList[currentIndex].id)}
            previousAnswer={currentSession?.answers[activeQuizList[currentIndex].id]}
            onAskAi={(quiz) => {
              setAiQuizContext(quiz);
              setActiveTab('ai');
            }}
            onResetProgress={handleResetQuizProgress}
            onShowToast={setToastMessage}
            shuffleEnabled={progress.shuffleOptions !== false}
            onSearchInDictionary={(keyword) => {
              setDictionaryKeyword(keyword);
              setActiveTab('dictionary');
            }}
            timerSeconds={currentSession?.mode === 'mockTest' ? (mockTimer ?? undefined) : undefined}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            progress={progress}
            allQuizzes={ALL_QUIZZES}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistantView
            allQuizzes={ALL_QUIZZES}
            initialQuizContext={aiQuizContext}
            onClearQuizContext={() => setAiQuizContext(null)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            progress={progress}
            setProgress={setProgress}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            totalQuizzesCount={ALL_QUIZZES.length}
          />
        )}
        </Suspense>
      </main>

      {/* 模試結果モーダル */}
      {completedMockData && (
        <Suspense fallback={null}>
          <MockTestResultModal
            quizIds={completedMockData.quizIds}
            allQuizzes={ALL_QUIZZES}
            answers={completedMockData.answers}
            elapsedSeconds={completedMockData.elapsed}
            onClose={() => {
              setCompletedMockData(null);
              setActiveTab('analytics');
            }}
            onRetry={() => {
              setCompletedMockData(null);
              handleStartMode('mockTest', undefined, 40);
            }}
            onReviewIncorrect={(incorrectIds) => {
              setCompletedMockData(null);
              handleStartReviewSession(incorrectIds, '模試の復習（不正解・部分正解）');
            }}
          />
        </Suspense>
      )}

      {/* インアプリトースト通知 */}
      {toastMessage && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-bouncePop pointer-events-none max-w-sm w-full px-4"
          role="status"
          aria-live="polite"
        >
          <div className="p-3.5 rounded-2xl bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 shadow-2xl backdrop-blur flex items-center justify-center text-center text-xs sm:text-sm font-bold border border-slate-700/50 dark:border-slate-300/50">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* フッター（スマホではボトムナビゲーションの高さ分の余白を確保） */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mb-16 md:mb-0 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 超難問クイズマスター - 完全網羅学習システム (GitHub Pages対応)</p>
      </footer>

      {/* スマホ専用ボトムナビゲーションバー（下部固定） */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  );
};

export default App;
