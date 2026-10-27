import React, { useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  ExternalLink,
  HelpCircle,
  Tag,
  Target,
  UserCheck,
  Sparkles,
  Play,
  FileText,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { QuizQuestion } from '../types/quiz';

export type AnswerChoice = 'A' | 'B' | 'C' | 'D';

export interface QuizPermalinkViewProps {
  quiz: QuizQuestion;
  quizSequentialNumber: number;
  categoryQuestionNumber: number;
  userAnswers?: AnswerChoice[];
  factMap: Record<string, { factText: string; section?: string }>;
  onGoToApp: () => void;
}

export const QuizPermalinkView: React.FC<QuizPermalinkViewProps> = ({
  quiz,
  quizSequentialNumber,
  categoryQuestionNumber,
  userAnswers,
  factMap,
  onGoToApp,
}) => {
  const paddedSequentialNo = String(quizSequentialNumber).padStart(3, '0');
  const hasUserAnswers = Boolean(userAnswers && userAnswers.length > 0);

  // 正解選択肢の正規化（単一選択・複数選択の両対応）
  const correctChoices = useMemo<AnswerChoice[]>(() => {
    const q = quiz as any;
    if (Array.isArray(q.correctAnswers)) {
      return q.correctAnswers as AnswerChoice[];
    }
    if (typeof q.correctAnswer === 'string') {
      return [q.correctAnswer as AnswerChoice];
    }
    if (Array.isArray(q.correctAnswer)) {
      return q.correctAnswer as AnswerChoice[];
    }
    return ['A'];
  }, [quiz]);

  // 選択肢テキストの抽出（配列・オブジェクト両対応）
  const choicesList = useMemo<{ key: AnswerChoice; text: string }[]>(() => {
    const keys: AnswerChoice[] = ['A', 'B', 'C', 'D'];
    const rawOptions = (quiz as any).options || (quiz as any).choices || {};

    return keys.map((key, idx) => {
      let text = '';
      if (Array.isArray(rawOptions)) {
        const item = rawOptions[idx];
        if (typeof item === 'string') {
          text = item.replace(/^[A-D][:：.\s]\s*/, '');
        } else if (item && typeof item === 'object') {
          text = item.text || item.label || '';
        }
      } else if (typeof rawOptions === 'object' && rawOptions !== null) {
        text = rawOptions[key] || '';
      }
      return { key, text };
    });
  }, [quiz]);

  // ユーザーの正誤判定
  const isUserCorrect = useMemo(() => {
    if (!hasUserAnswers || !userAnswers) return false;
    if (userAnswers.length !== correctChoices.length) return false;
    const sortedUser = [...userAnswers].sort();
    const sortedCorrect = [...correctChoices].sort();
    return sortedUser.every((val, index) => val === sortedCorrect[index]);
  }, [hasUserAnswers, userAnswers, correctChoices]);

  // Ecosia AI 質問用URLの生成
  const ecosiaSearchUrl = useMemo(() => {
    const factsSummary = (quiz.coveredFactIds || [])
      .map((id: string) => {
        const f = factMap[id];
        return f ? `・[${id}] ${f.factText}` : `・[${id}]`;
      })
      .join('\n');

    const prompt = [
      `【${quiz.category} 第${categoryQuestionNumber}問】(通し番号: Quiz#${paddedSequentialNo})`,
      `問題: ${quiz.question}`,
      `正解: ${correctChoices.join(', ')}`,
      hasUserAnswers ? `私の解答: ${userAnswers?.join(', ')}` : '',
      `出題論点:\n${factsSummary}`,
      `\n上記のクイズ問題について、正解の根拠と各選択肢が正しい（または誤りである）理由を分かりやすく深掘り解説してください。`,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://www.ecosia.org/chat?q=${encodeURIComponent(prompt)}`;
  }, [
    quiz,
    categoryQuestionNumber,
    paddedSequentialNo,
    correctChoices,
    hasUserAnswers,
    userAnswers,
    factMap,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto space-y-6">
        {/* トップナビゲーションバー */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 px-5 py-3.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>クイズ個別パーマリンク・詳細解説ビュー</span>
          </div>
          <button
            onClick={onGoToApp}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            アプリ本体へ移動
          </button>
        </div>

        {/* 1. ヘッダー情報カード（問題番号とファクトIDの混同を防止する構造分離デザイン） */}
        <header className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            {/* 📌 問題番号 & 🏷️ カテゴリ・セクション */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-indigo-600 text-white shadow-xs">
                    📌 【{quiz.category} 第{categoryQuestionNumber}問】
                  </span>
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    title="クイズ全体通し番号（ファクトIDとは異なります）"
                  >
                    通し番号: Quiz#{paddedSequentialNo}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1">
                  <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium">カテゴリ・セクション:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {quiz.category}
                    {(quiz as any).sourceSection ? ` ／ ${(quiz as any).sourceSection}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* 🎯 出題ファクト（論点）セクション — 問題番号とは明確に視覚分離 */}
            <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/60 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  🎯 出題ファクト（論点・検証対象知識）
                </h2>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                  Fact ID / 論点定義
                </span>
              </div>

              {quiz.coveredFactIds && quiz.coveredFactIds.length > 0 ? (
                <ul className="space-y-2.5 text-sm">
                  {quiz.coveredFactIds.map((factId: string) => {
                    const factInfo = factMap[factId];
                    return (
                      <li
                        key={factId}
                        className="flex items-start gap-2.5 bg-white/80 dark:bg-slate-900/70 p-3 rounded-lg border border-amber-200/60 dark:border-amber-800/40"
                      >
                        <span className="text-amber-600 dark:text-amber-400 font-bold select-none mt-0.5">
                          •
                        </span>
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <code className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-amber-100 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700">
                              [{factId}]
                            </code>
                            {factInfo?.section && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                ({factInfo.section})
                              </span>
                            )}
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                            {factInfo?.factText ?? '（ファクトテキスト未登録）'}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-amber-800 dark:text-amber-400">
                  関連付けられたファクトIDはありません。
                </p>
              )}
            </div>

            {/* 👤 受験者の解答（userAnswersが存在する場合のみ表示） */}
            {hasUserAnswers && userAnswers && (
              <div
                className={`rounded-xl p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isUserCorrect
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/70'
                    : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/70'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  {isUserCorrect ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                  ) : (
                    <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        👤 受験者の解答結果
                      </span>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                          isUserCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {isUserCorrect ? '正解 (CORRECT)' : '不正解 (INCORRECT)'}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mt-1">
                      あなたの解答:{' '}
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded ${
                          isUserCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                        }`}
                      >
                        {userAnswers.join(', ')}
                      </span>
                      <span className="mx-2 text-slate-400">／</span>
                      正解:{' '}
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                        {correctChoices.join(', ')}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* 2. クイズ本体（問題文 & 選択肢一覧） */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          {/* 📝 問題文 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
              <span>📝 問題文 (Question)</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {quiz.question}
            </h1>
          </div>

          {/* 🔘 選択肢一覧 (A〜D) */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              🔘 選択肢一覧 (Options A - D)
            </div>
            <div className="grid gap-3">
              {choicesList.map(({ key, text }) => {
                const isCorrectChoice = correctChoices.includes(key);
                const isSelectedByUser = Boolean(userAnswers?.includes(key));
                const isWrongUserSelection = isSelectedByUser && !isCorrectChoice;

                let containerStyle =
                  'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200';
                let badgeStyle =
                  'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                if (isCorrectChoice) {
                  containerStyle =
                    'bg-emerald-50/90 dark:bg-emerald-950/35 border-emerald-400 dark:border-emerald-700 text-slate-900 dark:text-slate-100 ring-1 ring-emerald-400/50';
                  badgeStyle = 'bg-emerald-600 text-white';
                } else if (isWrongUserSelection) {
                  containerStyle =
                    'bg-rose-50/90 dark:bg-rose-950/35 border-rose-400 dark:border-rose-700 text-slate-900 dark:text-slate-100 ring-1 ring-rose-400/50';
                  badgeStyle = 'bg-rose-600 text-white';
                }

                return (
                  <div
                    key={key}
                    className={`rounded-xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${containerStyle}`}
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-lg font-mono font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                      >
                        {key}
                      </span>
                      <span className="text-sm sm:text-base font-medium leading-relaxed">
                        {text}
                      </span>
                    </div>

                    {/* 状態バッジ群 */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                      {isCorrectChoice && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          正解
                        </span>
                      )}
                      {isSelectedByUser && isCorrectChoice && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                          あなたの選択（正解）
                        </span>
                      )}
                      {isWrongUserSelection && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/70 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700">
                          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          あなたの選択（不正解）
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. 💡 公式解説セクション */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              💡 公式解説 (Official Explanation)
            </h2>
          </div>

          {/* 全体概要解説 */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              全体概要
            </h3>
            <div className="p-4 sm:p-5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/25 border border-indigo-100 dark:border-indigo-900/50 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {quiz.explanations?.overall ||
                (quiz as any).explanation ||
                '全体解説はありません。'}
            </div>
          </div>

          {/* 各選択肢の詳細解説 (A〜D) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-indigo-500" />
              各選択肢の詳細解説 (A〜D)
            </h3>

            <div className="grid gap-3">
              {(['A', 'B', 'C', 'D'] as AnswerChoice[]).map((key) => {
                const isCorrectChoice = correctChoices.includes(key);
                const expObj = (quiz.explanations as any) || {};
                const detailText =
                  expObj[key] ||
                  expObj.options?.[key] ||
                  expObj.choices?.[key] ||
                  '（この選択肢の個別解説はありません）';

                return (
                  <div
                    key={key}
                    className={`p-4 rounded-xl border text-sm leading-relaxed ${
                      isCorrectChoice
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          isCorrectChoice
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        選択肢 {key}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isCorrectChoice
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {isCorrectChoice ? '【正しい】' : '【誤り】'}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                      {detailText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. アクションボタン群 */}
        <footer className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoToApp}
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-xs transition-all cursor-pointer"
          >
            <span>🚀 クイズマスターで他の問題を解く</span>
          </button>

          <a
            href={ecosiaSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-emerald-900 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 transition-all"
          >
            <HelpCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-300 shrink-0" />
            <span>🌿 Ecosia AIでこの問題を深掘り質問する</span>
            <ExternalLink className="w-4 h-4 opacity-75 shrink-0" />
          </a>
        </footer>
      </article>
    </div>
  );
};

export default QuizPermalinkView;