import React, { useState } from 'react';
import { QuizMode } from '../types/quiz';
import { X, Check, Sparkles } from 'lucide-react';

interface QuestionCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: QuizMode;
  category?: string;
  availableCount: number;
  onConfirm: (count: number) => void;
}

export const QuestionCountModal: React.FC<QuestionCountModalProps> = ({
  isOpen,
  onClose,
  mode,
  category,
  availableCount,
  onConfirm,
}) => {
  const [selectedCount, setSelectedCount] = useState<number>(() => {
    return Math.min(30, availableCount);
  });

  if (!isOpen) return null;

  const countOptions = [10, 20, 30, 50, availableCount].filter(
    (c, idx, arr) => c <= availableCount && arr.indexOf(c) === idx
  );

  const getModeTitle = () => {
    switch (mode) {
      case 'unattempted':
        return '未踏問題ランダム練習';
      case 'reviewWeak':
        return '苦手克服モード';
      case 'category':
        return `分野別集中特訓（${category || ''}）`;
      default:
        return '練習モード';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative animate-scaleUp">
        
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">
            🎯
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
              出題問題数を選択
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {getModeTitle()}（対象: 最大{availableCount}問）
            </p>
          </div>
        </div>

        {/* 説明文 */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
          あなたの学習ペースに合わせて、1回のセッションで解く問題数を選んでください。中断してもいつでも再開できます。
        </p>

        {/* 選択肢ボタン群 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
          {countOptions.map(count => {
            const isAll = count === availableCount;
            const isSelected = selectedCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => setSelectedCount(count)}
                className={`py-3 px-3 rounded-2xl border-2 text-center transition-all font-bold flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-base font-black flex items-center gap-1">
                  {count}問
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                  {isAll ? '全問制覇' : count <= 15 ? 'サクッと' : 'しっかり'}
                </span>
              </button>
            );
          })}
        </div>

        {/* 確認・開始ボタン */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedCount)}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            {selectedCount}問で開始
          </button>
        </div>

      </div>
    </div>
  );
};
