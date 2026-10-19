import React from 'react';
import { BookOpen, BarChart2, Sprout, Settings } from 'lucide-react';

export type AppTab = 'home' | 'quiz' | 'analytics' | 'ai' | 'settings';

interface BottomNavBarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    {
      id: 'home' as const,
      label: '特訓モード',
      icon: BookOpen,
    },
    {
      id: 'analytics' as const,
      label: '成績',
      icon: BarChart2,
    },
    {
      id: 'ai' as const,
      label: '🌱 AI相談',
      icon: Sprout,
      highlight: true,
    },
    {
      id: 'settings' as const,
      label: '設定',
      icon: Settings,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 transition-colors shadow-lg pb-safe">
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'home' && activeTab === 'quiz');

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1 px-2 flex flex-col items-center justify-center gap-1 transition-all rounded-xl ${
                isActive
                  ? tab.highlight
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-all ${
                  isActive
                    ? tab.highlight
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 scale-110'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 scale-110'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive && tab.highlight ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                {tab.highlight && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <span className="text-[11px] leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
