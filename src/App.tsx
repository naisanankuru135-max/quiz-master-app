import React, { useState, useEffect, useRef } from 'react';
import { ALL_QUIZZES } from './data/quizzes';
import { QuizQuestion, UserProgress, QuizMode, ResumeSession, MockHistoryRecord } from './types/quiz';
import { 
  loadProgress, recordAnswer, saveActiveSession, 
  clearActiveSession, toggleBookmark, saveProgress,
  resetSpacedRepetition, getTodayString,
  addMockHistory, isAnswerFullyCorrect
} from './utils/storage';
import { getDailyThirtyQuizzes } from './utils/prng';
import { MockTestResultModal } from './components/MockTestResultModal';
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
import { ReviewWorkspaceView } from './components/ReviewWorkspaceView';
import { DictionaryView } from './components/DictionaryView';
import { AnalyticsView } from './components/AnalyticsView';
import { AiAssistantView } from './components/AiAssistantView';
import { SettingsView } from './components/SettingsView';
import { BottomNavBar, AppTab } from './components/BottomNavBar';

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

    const cleared = clearActiveSession();
    const updated = mockRecord ? addMockHistory(mockRecord) : cleared;
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
          const cloudProgress = await fetchProgressFromCloud(user.uid);
          if (cloudProgress) {
            const currentLocal = loadProgress();
            const merged = mergeUserProgress(currentLocal, cloudProgress);
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
            const merged = mergeUserProgress(currentLocal, cloudProgress);
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

  // ダークモードクラス適用
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
      // 今日の30問：PRNG日付シードによる決定論的シャッフル（未習得・復習優先配分）
      targetQuizzes = getDailyThirtyQuizzes(ALL_QUIZZES, getTodayString(), progress);
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
      // 実力テスト：政治15問＋経済25問の計40問バランス選出・40分タイマー
      const pol = ALL_QUIZZES.filter(q => q.category === '政治').sort(() => 0.5 - Math.random()).slice(0, 15);
      const eco = ALL_QUIZZES.filter(q => q.category === '経済').sort(() => 0.5 - Math.random()).slice(0, 25);
      targetQuizzes = [...pol, ...eco].sort(() => 0.5 - Math.random());
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

    let updatedProgress = recordAnswer(
      quizId,
      currentQuiz.category,
      selected,
      currentQuiz.correctAnswers,
      currentSession?.mode
    );

    // セッションの保存
    // ※ recordAnswer が返す progress は「解答保存前」の activeSession を持っている。
    //   そのまま後段で saveProgress すると、下で保存した answers が巻き戻るため、
    //   saveActiveSession の戻り値で progress を置き換える。
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
      updatedProgress = saveActiveSession(nextSession);
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
    p.notificationEnabled = !p.notificationEnabled;
    saveProgress(p);
    setProgress(p);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 共通ヘッダー */}
      <Header
        progress={progress}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNotifyToggle={handleNotifyToggle}
        currentUser={currentUser}
      />

      {/* ⑧ 実績アンロックトースト通知 */}
      {achievementToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bouncePop max-w-sm pointer-events-none">
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
        {activeTab === 'home' && (
          <HomeDashboard
            progress={progress}
            allQuizzes={ALL_QUIZZES}
            onStartMode={handleStartMode}
            onResumeSession={handleResumeSession}
            onDiscardSession={handleDiscardSession}
          />
        )}

        {activeTab === 'review' && (
          <ReviewWorkspaceView
            progress={progress}
            allQuizzes={ALL_QUIZZES}
            onStartReviewSession={handleStartReviewSession}
            onResetQuizProgress={handleResetQuizProgress}
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
      </main>

      {/* 模試結果モーダル */}
      {completedMockData && (
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
      )}

      {/* インアプリトースト通知 */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-bouncePop pointer-events-none max-w-sm w-full px-4">
          <div className="p-3.5 rounded-2xl bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 shadow-2xl backdrop-blur flex items-center justify-center text-center text-xs sm:text-sm font-bold border border-slate-700/50 dark:border-slate-300/50">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* フッター（スマホではボトムナビゲーションの高さ分の余白を確保） */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mb-16 md:mb-0 text-center text-xs text-slate-400 dark:text-slate-500">
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
