import React, { useState, useEffect } from 'react';
import { ALL_QUIZZES } from './data/quizzes';
import { QuizQuestion, UserProgress, QuizMode, ResumeSession } from './types/quiz';
import { 
  loadProgress, recordAnswer, saveActiveSession, 
  clearActiveSession, toggleBookmark, saveProgress 
} from './utils/storage';
import { 
  onAuthStatusChange, 
  fetchProgressFromCloud, 
  saveProgressToCloud, 
  mergeUserProgress 
} from './services/firebaseSync';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { QuizCard } from './components/QuizCard';
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

  // 現在実行中のクイズセッション
  const [currentSession, setCurrentSession] = useState<ResumeSession | null>(progress.activeSession);
  const [activeQuizList, setActiveQuizList] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 認証リスナー＆初回クラウド同期
  useEffect(() => {
    const unsubscribe = onAuthStatusChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const cloudProgress = await fetchProgressFromCloud(user.uid);
          if (cloudProgress) {
            const currentLocal = loadProgress();
            const merged = mergeUserProgress(currentLocal, cloudProgress);
            saveProgress(merged);
            setProgress(merged);
            await saveProgressToCloud(user.uid, merged);
          } else {
            await saveProgressToCloud(user.uid, loadProgress());
          }
        } catch (err) {
          console.error('Initial cloud sync error:', err);
        }
      }
    });
    return () => unsubscribe();
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
    let targetQuizzes: QuizQuestion[] = [];
    const historyList = Object.values(progress.history);
    const attemptedIds = new Set(historyList.map(h => h.quizId));

    if (mode === 'daily30') {
      // 今日の30問：全問題からシャッフルして30問
      targetQuizzes = [...ALL_QUIZZES].sort(() => 0.5 - Math.random()).slice(0, 30);
    } else if (mode === 'unattempted') {
      // 未踏問題優先（指定問題数でスライス、デフォルト30問）
      const unattempted = ALL_QUIZZES.filter(q => !attemptedIds.has(q.id));
      const pool = unattempted.length > 0 ? unattempted : [...ALL_QUIZZES];
      if (unattempted.length === 0) {
        alert('すべての問題を解き終えました！全問制覇です。全問からランダム出題します。');
      }
      const limit = count || 30;
      targetQuizzes = pool.sort(() => 0.5 - Math.random()).slice(0, limit);
    } else if (mode === 'reviewWeak') {
      // 不正解・部分正解の問題のみ
      const weak = ALL_QUIZZES.filter(q => {
        const rec = progress.history[q.id];
        return rec && !rec.isFullyCorrect;
      }).sort(() => 0.5 - Math.random());
      targetQuizzes = count ? weak.slice(0, count) : weak;
    } else if (mode === 'mockTest') {
      // 実力テスト：本番さながらの40問固定（80%合格基準ライン）
      targetQuizzes = [...ALL_QUIZZES].sort(() => 0.5 - Math.random()).slice(0, 40);
    } else if (mode === 'category' && category) {
      // カテゴリ別集中モード（指定問題数でスライス）
      const catList = ALL_QUIZZES.filter(q => q.category === category).sort(() => 0.5 - Math.random());
      targetQuizzes = count ? catList.slice(0, count) : catList;
    }

    if (targetQuizzes.length === 0) {
      alert('出題対象の問題がありません。');
      return;
    }

    const newSession: ResumeSession = {
      mode,
      category,
      quizIds: targetQuizzes.map(q => q.id),
      currentIndex: 0,
      answers: {},
      timestamp: new Date().toISOString(),
    };

    saveActiveSession(newSession);
    setCurrentSession(newSession);
    setActiveQuizList(targetQuizzes);
    setCurrentIndex(0);
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
      clearActiveSession();
      setProgress(loadProgress());
      return;
    }

    setCurrentSession(session);
    setActiveQuizList(quizzes);
    setCurrentIndex(Math.min(session.currentIndex, quizzes.length - 1));
    setActiveTab('quiz');
  };

  // 中断セッションの破棄
  const handleDiscardSession = () => {
    clearActiveSession();
    setCurrentSession(null);
    setProgress(loadProgress());
  };

  // 解答提出
  const handleAnswerSubmit = (quizId: string, selected: ('A' | 'B' | 'C' | 'D')[]) => {
    const currentQuiz = activeQuizList.find(q => q.id === quizId);
    if (!currentQuiz) return;

    const updatedProgress = recordAnswer(
      quizId,
      currentQuiz.category,
      selected,
      currentQuiz.correctAnswers
    );

    // セッションの保存
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
      saveActiveSession(nextSession);
      setCurrentSession(nextSession);
    }

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
        saveActiveSession(nextSession);
        setCurrentSession(nextSession);
      }
    } else {
      // 終了
      alert('セッションが完了しました！成績を確認しましょう。');
      clearActiveSession();
      setCurrentSession(null);
      setProgress(loadProgress());
      setActiveTab('analytics');
    }
  };

  // 前の問題へ
  const handlePrevQuiz = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 中断してホームに戻る
  const handleQuitQuiz = () => {
    if (currentSession) {
      saveActiveSession({
        ...currentSession,
        currentIndex,
      });
    }
    setProgress(loadProgress());
    setActiveTab('home');
  };

  // ブックマーク切替
  const handleToggleBookmark = (quizId: string) => {
    toggleBookmark(quizId);
    setProgress(loadProgress());
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
