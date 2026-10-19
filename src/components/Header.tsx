import React from 'react';
import { UserProgress } from '../types/quiz';
import { Flame, Bell, Moon, Sun, BarChart2, BookOpen, Settings, Sprout, Cloud } from 'lucide-react';
import { requestNotificationPermission, sendStudyReminder } from '../utils/notification';
import { AppTab } from './BottomNavBar';
import { User } from 'firebase/auth';

interface HeaderProps {
  progress: UserProgress;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNotifyToggle: () => void;
  currentUser?: User | null;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onNotifyToggle,
  currentUser,
}) => {
  const handleNotificationClick = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      onNotifyToggle();
      sendStudyReminder('リマインダー通知が有効になりました！毎日学習をサポートします。');
    }
  };

  const todayCount = progress.activityHistory.find(
    a => a.date === new Date().toISOString().split('T')[0]
  )?.count || 0;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* ロゴ / タイトル（スマホでも絶対に1行に収まる設計） */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
            <span className="text-base sm:text-xl">🧠</span>
          </div>
          <div>
            <h1 className="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-lg leading-tight flex items-center gap-1">
              <span>超難問クイズ</span>
              <span className="hidden sm:inline">マスター</span>
              <span className="text-[10px] sm:text-xs px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                PRO
              </span>
            </h1>
            <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">4,000問完全網羅特訓</p>
          </div>
        </div>

        {/* 右側：ストリーク & PCナビ & ツールボタン */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* ストリーク（スマホではコンパクトに 🔥 X日） */}
          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm shadow-sm" title="連続学習日数">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{progress.streak.current}日<span className="hidden sm:inline">連続</span></span>
          </div>

          {/* 本日の解答数（PC/タブレット用） */}
          <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
            <span>本日:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{todayCount}</span>
            <span>/{progress.dailyGoal}問</span>
          </div>

          {/* PC専用ナビゲーションタブ（スマホでは下部バーで操作するため非表示） */}
          <div className="hidden md:flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium ${
                activeTab === 'home' || activeTab === 'quiz'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="ホーム"
            >
              <BookOpen className="w-4 h-4" />
              <span>特訓モード</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium ${
                activeTab === 'analytics'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="成績・分析"
            >
              <BarChart2 className="w-4 h-4" />
              <span>成績</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium ${
                activeTab === 'ai'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="🌱 Ecosia AI 学習相談室（登録・API不要）"
            >
              <Sprout className="w-4 h-4 text-emerald-500" />
              <span>AI相談室</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="設定"
            >
              <Settings className="w-4 h-4" />
              <span>設定</span>
            </button>
          </div>

          {/* ツールボタン群（クラウド同期 & 通知 & ダークモード） */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* クラウド同期ステータス */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 ${
                currentUser
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={currentUser ? `Google Cloud同期中 (${currentUser.displayName || currentUser.email})` : 'Google Cloud同期を設定'}
            >
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="User" 
                  className="w-5 h-5 rounded-full border border-emerald-500" 
                />
              ) : (
                <Cloud className={`w-4 h-4 sm:w-5 sm:h-5 ${currentUser ? 'text-emerald-500' : ''}`} />
              )}
            </button>

            <button
              onClick={handleNotificationClick}
              className={`hidden sm:flex p-1.5 sm:p-2 rounded-lg transition-colors ${
                progress.notificationEnabled
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={progress.notificationEnabled ? '学習リマインダー通知 ON' : 'リマインダー通知を設定'}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="テーマ切替"
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
