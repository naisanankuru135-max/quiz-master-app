import React, { useState, useMemo } from 'react';
import { QuizQuestion, UserProgress } from '../types/quiz';
import { ALL_FACTS } from '../data/facts';
import { 
  Search, BookOpen, ExternalLink, Play, 
  X, Sparkles, Tag
} from 'lucide-react';
import { openEcosiaAiWithPrompt } from '../utils/ecosiaAi';

interface DictionaryViewProps {
  allQuizzes: QuizQuestion[];
  progress: UserProgress;
  onStartQuizSession: (quizIds: string[], sessionTitle: string) => void;
  initialKeyword?: string;
  onClearInitialKeyword?: () => void;
}

// おすすめの人気検索キーワード
const POPULAR_KEYWORDS = [
  'ブロック経済', '日銀', '関税', '小選挙区', '比例代表', 
  '特定枠', '安保理', '社会保障', '憲法改正', 'TPP',
  '金融緩和', '為替介入', '普通選挙', '国葬', 'インフレ'
];

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  allQuizzes,
  progress,
  onStartQuizSession,
  initialKeyword = '',
  onClearInitialKeyword,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialKeyword);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [masteryFilter, setMasteryFilter] = useState<'all' | 'unattempted' | 'reviewing' | 'completed' | 'bookmarked'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'facts' | 'quizzes'>('facts');

  React.useEffect(() => {
    if (initialKeyword) {
      setSearchQuery(initialKeyword);
    }
  }, [initialKeyword]);

  // ファクトID -> 関連クイズのマップを構築
  const factToQuizzesMap = useMemo(() => {
    const map = new Map<string, QuizQuestion[]>();
    allQuizzes.forEach(quiz => {
      const factIds = (quiz as any).coveredFactIds as string[] | undefined;
      if (factIds && Array.isArray(factIds)) {
        factIds.forEach(fid => {
          if (!map.has(fid)) map.set(fid, []);
          map.get(fid)!.push(quiz);
        });
      }
    });
    return map;
  }, [allQuizzes]);

  // クイズID -> 忘却曲線・正答ステータス
  const quizStatusMap = useMemo(() => {
    const map = new Map<string, 'unattempted' | 'correct' | 'reviewing' | 'completed'>();
    allQuizzes.forEach(q => {
      const sr = progress.spacedRepetition?.[q.id];
      const hist = progress.history?.[q.id];

      if (sr?.currentStage === 'completed') {
        map.set(q.id, 'completed');
      } else if (sr && sr.currentStage >= 1) {
        map.set(q.id, 'reviewing');
      } else if (hist?.isFullyCorrect) {
        map.set(q.id, 'correct');
      } else {
        map.set(q.id, 'unattempted');
      }
    });
    return map;
  }, [allQuizzes, progress]);

  // テキストハイライト関数
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const q = query.trim();
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500/40 text-slate-900 dark:text-slate-100 px-0.5 rounded font-bold">
          {part}
        </mark>
      ) : part
    );
  };

  // ファクト検索＆フィルタリング
  const filteredFacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ALL_FACTS.filter(fact => {
      // カテゴリ絞り込み
      if (selectedCategory !== 'all' && fact.category !== selectedCategory) {
        return false;
      }

      // 関連クイズの習得状況判定
      const related = factToQuizzesMap.get(fact.id) || [];
      const hasCompleted = related.some(q => quizStatusMap.get(q.id) === 'completed');
      const hasReviewing = related.some(q => quizStatusMap.get(q.id) === 'reviewing');
      const isUnattempted = related.length === 0 || related.every(q => quizStatusMap.get(q.id) === 'unattempted');
      const hasBookmarked = related.some(q => progress.bookmarks?.includes(q.id));

      if (masteryFilter === 'completed' && !hasCompleted) return false;
      if (masteryFilter === 'reviewing' && !hasReviewing) return false;
      if (masteryFilter === 'unattempted' && !isUnattempted) return false;
      if (masteryFilter === 'bookmarked' && !hasBookmarked) return false;

      // キーワード検索（ファクト本文、ID、セクション名）
      if (!query) return true;
      return (
        fact.factText.toLowerCase().includes(query) ||
        fact.id.toLowerCase().includes(query) ||
        fact.section.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedCategory, masteryFilter, factToQuizzesMap, quizStatusMap, progress.bookmarks]);

  // クイズ全文検索（問題文・選択肢・解説からヒット）
  const filteredQuizzes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allQuizzes.filter(quiz => {
      // カテゴリ絞り込み
      if (selectedCategory !== 'all' && quiz.category !== selectedCategory) {
        return false;
      }

      // 習得状況判定
      const status = quizStatusMap.get(quiz.id) || 'unattempted';
      if (masteryFilter === 'completed' && status !== 'completed') return false;
      if (masteryFilter === 'reviewing' && status !== 'reviewing') return false;
      if (masteryFilter === 'unattempted' && status !== 'unattempted') return false;
      if (masteryFilter === 'bookmarked' && !progress.bookmarks?.includes(quiz.id)) return false;

      // キーワード未入力時は全件（またはカテゴリ・進捗で絞り込み）対象
      if (!query) return true;

      // 問題文、選択肢、解説の全文マッチング
      const inQuestion = quiz.question.toLowerCase().includes(query);
      const inOptions = quiz.options.some(opt => opt.text.toLowerCase().includes(query));
      const inOverall = quiz.explanations.overall.toLowerCase().includes(query);
      const inDetails = Object.values(quiz.explanations.details).some(d => d.toLowerCase().includes(query));
      const inSection = quiz.sourceSection.toLowerCase().includes(query);

      return inQuestion || inOptions || inOverall || inDetails || inSection;
    });
  }, [searchQuery, selectedCategory, masteryFilter, allQuizzes, quizStatusMap, progress.bookmarks]);

  // Ecosia AI深掘り起動
  const handleDeepDiveEcosia = (termOrFact: string) => {
    const prompt = `【時事用語・ニュース検定の深掘り学習】
以下の項目について、背景、歴史的経緯、現代社会での重要性、試験で狙われやすいポイントをわかりやすく解説してください。

■ 対象項目: ${termOrFact}`;
    openEcosiaAiWithPrompt(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 animate-fadeIn">
      
      {/* 画面ヘッダー */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              時事用語・全ファクト逆引き辞書
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                {ALL_FACTS.length} 論点完全収録
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              クイズの問題文・選択肢・解説・ファクトデータから単語を即時検索し、そのまま演習できます
            </p>
          </div>
        </div>
      </div>

      {/* 検索バー ＆ フィルター */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* 検索入力窓 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (initialKeyword && onClearInitialKeyword) {
                onClearInitialKeyword();
              }
            }}
            placeholder="調べたい単語・用語・ファクトを入力（例: ブロック経済、日銀、関税、比例代表...）"
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                if (onClearInitialKeyword) onClearInitialKeyword();
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 人気のキーワードタグ（初期表示やクイック検索用） */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3" />
            人気ワード:
          </span>
          {POPULAR_KEYWORDS.map(kw => (
            <button
              key={kw}
              onClick={() => setSearchQuery(kw)}
              className={`text-xs px-2.5 py-1 rounded-xl transition-all ${
                searchQuery === kw
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>

        {/* カテゴリ & 習得状況フィルター */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* カテゴリ切替 */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1">分野:</span>
            {['all', '政治', '経済'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'すべて' : cat}
              </button>
            ))}
          </div>

          {/* 習得状況フィルター */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1">進捗:</span>
            {[
              { id: 'all' as const, label: 'すべて' },
              { id: 'unattempted' as const, label: '未解答' },
              { id: 'reviewing' as const, label: '復習中' },
              { id: 'completed' as const, label: '完全習得' },
              { id: 'bookmarked' as const, label: '★ 保存中' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setMasteryFilter(f.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  masteryFilter === f.id
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* 検索タブ切替（ファクト一覧 / クイズ・解説マッチ） */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('facts')}
          className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
            activeSubTab === 'facts'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>重要ファクト・論点</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
            {filteredFacts.length} 件
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('quizzes')}
          className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
            activeSubTab === 'quizzes'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>問題・解説一覧</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
            {filteredQuizzes.length} 問
          </span>
        </button>
      </div>

      {/* 検索結果一覧：重要ファクト・論点タブ */}
      {activeSubTab === 'facts' && (
        <div className="space-y-3.5">
          {filteredFacts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                該当するファクト・論点が見つかりませんでした
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                別のキーワードで検索するか、上の「人気ワード」ボタンをお試しください。
              </p>
            </div>
          ) : (
            filteredFacts.map(fact => {
              const relatedQuizzes = factToQuizzesMap.get(fact.id) || [];
              const quizIds = relatedQuizzes.map(q => q.id);
              const hasCompleted = relatedQuizzes.some(q => quizStatusMap.get(q.id) === 'completed');
              const hasReviewing = relatedQuizzes.some(q => quizStatusMap.get(q.id) === 'reviewing');

              return (
                <div
                  key={fact.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {fact.id}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {fact.category}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {fact.section}
                      </span>
                    </div>

                    {/* 習得バッジ */}
                    {hasCompleted ? (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                        🏆 完全習得
                      </span>
                    ) : hasReviewing ? (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 flex items-center gap-1">
                        🔄 復習サイクル中
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        未解答 / 演習可能
                      </span>
                    )}
                  </div>

                  {/* ファクト本文 */}
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                    {highlightText(fact.factText, searchQuery)}
                  </p>

                  {/* アクションバー */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-400">
                      対応クイズ: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{relatedQuizzes.length}問</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeepDiveEcosia(`${fact.section} - ${fact.factText.slice(0, 40)}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
                        title="Ecosia AIで背景や歴史を深掘り"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                        <span>AI深掘り</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>

                      {relatedQuizzes.length > 0 && (
                        <button
                          onClick={() => onStartQuizSession(quizIds, `辞書演習: ${fact.id} (${fact.section})`)}
                          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>このファクトのクイズを解く ({relatedQuizzes.length}問)</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* 検索結果一覧：クイズ・解説マッチタブ */}
      {activeSubTab === 'quizzes' && (
        <div className="space-y-3.5">
          {filteredQuizzes.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-4xl">❓</div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                クイズの問題文や解説に一致する項目は見つかりませんでした
              </h3>
            </div>
          ) : (
            filteredQuizzes.map(quiz => {
              const status = quizStatusMap.get(quiz.id);

              return (
                <div
                  key={quiz.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white">
                        {quiz.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {quiz.sourceSection}
                      </span>
                    </div>

                    {status === 'completed' && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        🏆 完全習得
                      </span>
                    )}
                  </div>

                  {/* 問題文 */}
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {highlightText(quiz.question, searchQuery)}
                  </h4>

                  {/* 解説抜粋プレビュー */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <span>💡 解説からの抜粋:</span>
                    </div>
                    <p className="leading-relaxed">
                      {highlightText(quiz.explanations.overall, searchQuery)}
                    </p>
                  </div>

                  {/* 解くボタン */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onStartQuizSession([quiz.id], `辞書演習: ${quiz.category} (${quiz.sourceSection})`)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>この問題を解く</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
