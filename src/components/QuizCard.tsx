import React, { useState, useEffect, useMemo } from 'react';
import { QuizQuestion } from '../types/quiz';
import confetti from 'canvas-confetti';
import { 
  Bookmark, BookmarkCheck, 
  ArrowRight, ArrowLeft, Sparkles, HelpCircle, Save,
  Sprout, ExternalLink, CheckCircle2, RotateCcw, AlertCircle, Keyboard, Search
} from 'lucide-react';
import { 
  formatQuizPromptForEcosia, 
  openEcosiaAiWithPermalink,
  normalizeSelectedOptions
} from '../utils/ecosiaAi';
import { getQuizNumberInfo } from '../utils/quizPermalinkHelper';

interface QuizCardProps {
  quiz: QuizQuestion;
  currentIndex: number;
  totalCount: number;
  onAnswerSubmit: (quizId: string, selected: ('A' | 'B' | 'C' | 'D')[]) => void;
  onNext: () => void;
  onPrev: () => void;
  onQuit: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  previousAnswer?: ('A' | 'B' | 'C' | 'D')[];
  onAskAi?: (quiz: QuizQuestion) => void;
  onResetProgress?: (quizId: string) => void;
  shuffleEnabled?: boolean;
  onSearchInDictionary?: (keyword: string) => void;
  onShowToast?: (message: string) => void;
  timerSeconds?: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  currentIndex,
  totalCount,
  onAnswerSubmit,
  onNext,
  onPrev,
  onQuit,
  isBookmarked,
  onToggleBookmark,
  previousAnswer,
  onAskAi,
  onResetProgress,
  shuffleEnabled = true,
  onSearchInDictionary,
  onShowToast,
  timerSeconds,
}) => {
  // 選択肢シャッフル＆マッピング処理
  // quiz.id または shuffleEnabled が切り替わった時のみ再計算
  const { displayQuiz, newToOriginalKey, originalToNewKey } = useMemo(() => {
    if (!shuffleEnabled) {
      const identityMap: Record<'A'|'B'|'C'|'D', 'A'|'B'|'C'|'D'> = { A: 'A', B: 'B', C: 'C', D: 'D' };
      return {
        displayQuiz: quiz,
        newToOriginalKey: identityMap,
        originalToNewKey: identityMap,
      };
    }

    // Fisher-Yates シャッフル（元の options をコピーして並び替え）
    const shuffledOptions = [...quiz.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    const keys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const newToOrig: Record<'A'|'B'|'C'|'D', 'A'|'B'|'C'|'D'> = { A: 'A', B: 'B', C: 'C', D: 'D' };
    const origToNew: Record<'A'|'B'|'C'|'D', 'A'|'B'|'C'|'D'> = { A: 'A', B: 'B', C: 'C', D: 'D' };

    const newOptions = shuffledOptions.map((opt, index) => {
      const newKey = keys[index];
      const origKey = opt.key;
      newToOrig[newKey] = origKey;
      origToNew[origKey] = newKey;
      return {
        key: newKey,
        text: opt.text,
      };
    });

    const newCorrectAnswers = quiz.correctAnswers.map(oldKey => origToNew[oldKey]).sort();
    const newDetails: Record<'A'|'B'|'C'|'D', string> = {
      A: quiz.explanations.details[newToOrig.A],
      B: quiz.explanations.details[newToOrig.B],
      C: quiz.explanations.details[newToOrig.C],
      D: quiz.explanations.details[newToOrig.D],
    };

    const mappedDisplayQuiz: QuizQuestion = {
      ...quiz,
      options: newOptions,
      correctAnswers: newCorrectAnswers,
      explanations: {
        ...quiz.explanations,
        details: newDetails,
      },
    };

    return {
      displayQuiz: mappedDisplayQuiz,
      newToOriginalKey: newToOrig,
      originalToNewKey: origToNew,
    };
  }, [quiz.id, shuffleEnabled]);

  // 前回復習・再開時の解答を新キーにマッピングして初期選択
  const initialSelected = useMemo(() => {
    if (!previousAnswer || previousAnswer.length === 0) return [];
    return previousAnswer.map(k => originalToNewKey[k]).sort();
  }, [previousAnswer, originalToNewKey]);

  const [selected, setSelected] = useState<('A' | 'B' | 'C' | 'D')[]>(initialSelected);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!previousAnswer);
  const [showExplanation, setShowExplanation] = useState<boolean>(!!previousAnswer);
  const [animationClass, setAnimationClass] = useState<string>('');
  const [ecosiaNotice, setEcosiaNotice] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // 問題が切り替わったら初期化
  useEffect(() => {
    setSelected(initialSelected);
    setIsSubmitted(!!previousAnswer);
    setShowExplanation(!!previousAnswer);
    setAnimationClass('');
    setEcosiaNotice(false);
  }, [quiz.id, initialSelected, previousAnswer]);

  // コンポーネント破棄時に紙吹雪キャンバスを完全リセット（成績画面等の視認性保護）
  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  const handleOpenEcosia = () => {
    // 画面上でシャッフルされた選択肢キーを、元データのキー（A〜D）に正規化
    const normalizedSelected = normalizeSelectedOptions(displayQuiz, [...selected].sort(), quiz);
    const { sequentialNumber, categoryNumber } = getQuizNumberInfo(quiz.id);
    const fullFallbackPrompt = formatQuizPromptForEcosia(displayQuiz, [...selected].sort());

    openEcosiaAiWithPermalink(
      quiz,
      sequentialNumber,
      categoryNumber,
      normalizedSelected,
      fullFallbackPrompt
    );
    setEcosiaNotice(true);
    setTimeout(() => setEcosiaNotice(false), 5000);
  };

  const handleToggleOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    const next = selected.includes(key)
      ? selected.filter(k => k !== key)
      : [...selected, key];
    setSelected([...next].sort());
  };

  // 判定ロジック（表示用の新キーで判定）
  const sortedUser = [...selected].sort();
  const sortedCorrect = [...displayQuiz.correctAnswers].sort();
  const isFullyCorrect = 
    sortedUser.length === sortedCorrect.length &&
    sortedUser.every((val, idx) => val === sortedCorrect[idx]);

  const correctPicks = selected.filter(k => displayQuiz.correctAnswers.includes(k)).length;
  const incorrectPicks = selected.filter(k => !displayQuiz.correctAnswers.includes(k)).length;
  const isPartial = !isFullyCorrect && (correctPicks > 0 && incorrectPicks === 0);

  const handleSubmit = () => {
    if (selected.length === 0) {
      onShowToast?.('少なくとも1つの選択肢を選んでください。');
      return;
    }

    setIsSubmitted(true);
    setShowExplanation(true);

    // 提出時は元のキーに逆変換して渡すことで、データベース側の整合性を完全保持
    const originalSelected = sortedUser.map(k => newToOriginalKey[k]).sort();
    onAnswerSubmit(quiz.id, originalSelected);

    if (isFullyCorrect) {
      // 完全正解演出：紙吹雪
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#6366F1', '#F59E0B', '#3B82F6']
      });
      setAnimationClass('animate-bouncePop');
    } else if (isPartial) {
      // 部分正解（惜しい！）
      setAnimationClass('ring-4 ring-amber-400 dark:ring-amber-500');
    } else {
      // 不正解演出：シェイク
      setAnimationClass('animate-shake');
    }
  };

  // ⑤ PC向けキーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResetConfirm) return;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.key === '1' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleToggleOption('A');
      } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleOption('B');
      } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleToggleOption('C');
      } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleToggleOption('D');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!isSubmitted) {
          if (selected.length > 0) {
            handleSubmit();
          }
        } else {
          onNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          e.preventDefault();
          onPrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, selected, showResetConfirm, currentIndex, onNext, onPrev]);

  return (
    <div className={`w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300 ${animationClass}`}>
      
      {/* 上部ステータスバー */}
      <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-indigo-600 text-white rounded-lg text-[11px] sm:text-xs font-bold tracking-wide uppercase">
            {quiz.category}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            第 {currentIndex + 1} 問 / 全 {totalCount} 問
          </span>
        </div>

        {/* 模試用タイマー表示（指定時のみ） */}
        {timerSeconds !== undefined && (
          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm border ${
            timerSeconds <= 60
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 animate-pulse'
              : timerSeconds <= 300
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            <span>⏱️</span>
            <span>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 復習進捗リセットボタン */}
          {onResetProgress && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="この問題の復習進捗をリセット"
              aria-label="この問題の復習進捗をリセット"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* ブックマーク */}
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="復習用にブックマーク"
            aria-label={isBookmarked ? 'ブックマークから外す' : 'ブックマークに追加'}
            aria-pressed={isBookmarked}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-500" /> : <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* プログレスバー */}
      <div
        className="w-full bg-slate-200 dark:bg-slate-800 h-1.5"
        role="progressbar"
        aria-label="セッションの進捗"
        aria-valuemin={1}
        aria-valuemax={totalCount}
        aria-valuenow={currentIndex + 1}
      >
        <div 
          className="bg-indigo-600 h-1.5 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
        />
      </div>

      {/* 問題文 */}
      <div className="p-4 sm:p-8">
        
        {/* 出典元タグ */}
        <div className="mb-2 sm:mb-3 flex items-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono">
          <span>出典: {quiz.sourceFile}</span>
          <span>•</span>
          <span>{quiz.sourceSection}</span>
        </div>

        {/* 問題タイトル */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed mb-6">
          {quiz.question}
        </h2>

        {/* 複数選択ヒント */}
        <div className="mb-6 px-4 py-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs flex items-center gap-2">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>正解は1つまたは複数あります。当てはまる選択肢をすべてチェックしてください。</span>
        </div>

        {/* 選択肢リスト */}
        <div className="space-y-3 mb-6">
          {displayQuiz.options.map((opt) => {
            const isSelected = selected.includes(opt.key);
            const isTargetCorrect = displayQuiz.correctAnswers.includes(opt.key);

            // 解答後のビジュアル判定クラス
            let cardStyle = "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-800/50";
            let indicator = null;

            if (isSubmitted) {
              if (isSelected && isTargetCorrect) {
                // 選んで正解！
                cardStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium";
                indicator = <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">正解 ✓</span>;
              } else if (!isSelected && isTargetCorrect) {
                // 正解なのに選んでない（見落とし）
                cardStyle = "border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border-dashed animate-pulse";
                indicator = <span className="text-xs font-bold text-amber-600 dark:text-amber-400">見落とし！これも正解</span>;
              } else if (isSelected && !isTargetCorrect) {
                // 誤答なのに選んだ
                cardStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through opacity-80";
                indicator = <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">誤り ✕</span>;
              } else {
                // 誤答を選ばなかった（正しい判断）
                cardStyle = "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-60";
              }
            } else if (isSelected) {
              cardStyle = "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 font-medium ring-2 ring-indigo-500/20";
            }

            return (
              <div
                key={opt.key}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleToggleOption(opt.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleOption(opt.key);
                  }
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${cardStyle}`}
              >
                {/* チェックボックス風UI */}
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border text-xs font-bold transition-colors ${
                  isSelected
                    ? isSubmitted
                      ? isTargetCorrect
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-rose-600 border-rose-600 text-white'
                      : 'bg-indigo-600 border-indigo-600 text-white'
                    : isSubmitted && isTargetCorrect
                      ? 'border-amber-500 text-amber-600 bg-amber-100 dark:bg-amber-900/50'
                      : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-500'
                }`}>
                  {opt.key}
                </div>

                <div className="flex-1">
                  <p className="text-sm sm:text-base leading-relaxed">{opt.text}</p>
                </div>

                {indicator && (
                  <div className="shrink-0 self-center">
                    {indicator}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ⑤ キーボードショートカットガイド（控えめな表示） */}
        <div className="hidden sm:flex items-center justify-end gap-3 text-[11px] text-slate-400 dark:text-slate-500 mb-4 font-mono">
          <span className="flex items-center gap-1">
            <Keyboard className="w-3.5 h-3.5" />
            ショートカット:
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">1〜4 / A〜D</span> 選択
          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">Enter</span> {!isSubmitted ? '解答' : '次へ'}
        </div>

        {/* 解答アクション / 結果リアクション表示 */}
        {!isSubmitted ? (
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={onQuit}
              className="px-6 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              title="現在の状態を保存してトップ画面に戻ります"
            >
              <Save className="w-4 h-4 text-slate-500" />
              保存して中断
            </button>

            <button
              onClick={handleSubmit}
              disabled={selected.length === 0}
              className={`px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                selected.length > 0
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              解答を判定する ({selected.length}個 選択中)
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 視覚的リアクションバナー */}
            <div className={`p-4 rounded-2xl flex items-center justify-between border-2 ${
              isFullyCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                : isPartial
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-100'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100'
            }`}>
              <div className="flex items-center gap-3">
                {isFullyCorrect ? (
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md">
                    🎉
                  </div>
                ) : isPartial ? (
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
                    ⚡
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center text-2xl shadow-md">
                    💥
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">
                    {isFullyCorrect ? '完全正解！お見事です！' : isPartial ? '惜しい！あと一歩！' : '残念！不正解'}
                  </h3>
                  <p className="text-xs opacity-90">
                    {isFullyCorrect
                      ? 'すべての選択肢の正誤を正確に見抜けています。'
                      : isPartial
                        ? `正解（${displayQuiz.correctAnswers.join(', ')}）のうち ${correctPicks} 個を選択できました。`
                        : `正解は 【 ${displayQuiz.correctAnswers.join(', ')} 】 でした。`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/60 dark:bg-black/30">
                  正解: {displayQuiz.correctAnswers.join(', ')}
                </span>
              </div>
            </div>

            {/* 詳細解説ボックス */}
            {showExplanation && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">詳細解説</h4>
                </div>

                {/* 総合解説 */}
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {displayQuiz.explanations.overall}
                </p>

                {/* 選択肢ごとの解説 */}
                <div className="space-y-2.5 pt-2">
                  {(['A', 'B', 'C', 'D'] as const).map(key => (
                    <div key={key} className="text-xs sm:text-sm p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                      <span className="font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                        {key}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {displayQuiz.explanations.details[key]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI解説連携エリア */}
                <div className="pt-2 space-y-2">
                  {/* メイン: Ecosia AI（登録不要・API不要） */}
                  <button
                    type="button"
                    onClick={handleOpenEcosia}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold flex items-center justify-between shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        <Sprout className="w-5 h-5 text-emerald-100" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                          <span>🌱 Ecosia AIでこの問題を深掘り解説</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-400/30 border border-emerald-300/40 rounded text-emerald-100 font-normal">
                            登録・API不要
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-emerald-100/90 font-normal">
                          問題・選択肢・解説を入力済みの状態でEcosia AIを即座に開きます
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>

                  {/* Ecosia起動通知フィードバック */}
                  {ecosiaNotice && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="flex-1">
                        <strong>Ecosia AIを開きました！</strong>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                          プロンプトは自動入力されています（念のためクリップボードにもコピー済みです）。
                        </p>
                      </div>
                    </div>
                  )}

                  {/* リンクアクション群 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 mt-2">
                    {onSearchInDictionary && (
                      <button
                        type="button"
                        onClick={() => onSearchInDictionary(quiz.sourceSection || quiz.category)}
                        className="text-[11px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 font-bold transition-colors"
                        title="辞書タブでこの論点に関連するファクトやクイズを調べる"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>辞書でこの論点・ファクトを見る</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onAskAi?.(quiz)}
                      className="text-[11px] text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center gap-1.5 px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ml-auto"
                      title="AI相談室タブでこの問題や関連テーマを確認する"
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-500" />
                      <span>AI相談室タブも開く</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ナビゲーションボタン */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onPrev}
                  disabled={currentIndex === 0}
                  className={`px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium flex items-center justify-center gap-1.5 ${
                    currentIndex === 0
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  前の問題
                </button>

                <button
                  onClick={onQuit}
                  className="px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  title="現在の状態を保存してトップ画面に戻ります"
                >
                  <Save className="w-4 h-4 text-slate-500" />
                  保存して中断
                </button>
              </div>

              <button
                onClick={onNext}
                className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
              >
                {currentIndex + 1 >= totalCount ? '結果を見る' : '次の問題へ'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* リセット確認モーダル */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-progress-title"
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6 space-y-4"
          >
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 id="reset-progress-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                復習進捗のリセット
              </h3>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              この問題の復習進捗（初回解答日や忘却曲線ステージ）を初期化して、最初から（未学習状態）に戻しますか？
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  if (onResetProgress) {
                    onResetProgress(quiz.id);
                  }
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all"
              >
                リセットする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
