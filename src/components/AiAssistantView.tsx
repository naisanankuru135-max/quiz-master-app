import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types/quiz';
import { 
  Sprout, ExternalLink, BookOpen, CheckCircle2,
  Landmark, TrendingUp, Wheat, Zap, Globe2, HelpCircle,
  ArrowUpRight
} from 'lucide-react';
import { formatQuizPromptForEcosia, openEcosiaAiWithPrompt } from '../utils/ecosiaAi';

interface AiAssistantViewProps {
  allQuizzes: QuizQuestion[];
  initialQuizContext?: QuizQuestion | null;
  onClearQuizContext?: () => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  allQuizzes,
  initialQuizContext,
  onClearQuizContext,
}) => {
  const [activeQuizContext, setActiveQuizContext] = useState<QuizQuestion | null>(initialQuizContext || null);
  const [queryText, setQueryText] = useState<string>('');
  const [noticeMessage, setNoticeMessage] = useState<string>('');

  useEffect(() => {
    if (initialQuizContext) {
      setActiveQuizContext(initialQuizContext);
    }
  }, [initialQuizContext]);

  const showNotification = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(''), 5000);
  };

  // 自由入力質問をEcosia AIで開く
  const handleAskFreeText = (customQuery?: string) => {
    const text = (customQuery || queryText).trim();
    if (!text) return;

    const prompt = `【ニュース検定・時事問題の学習相談】
質問内容: ${text}

【お願い】
上記について、ニュース検定（1級・2級レベル）対策として知っておくべき法律・制度の背景、対立軸、最新の動向や重要ポイントを、初学者にもわかりやすく丁寧に解説してください。`;

    openEcosiaAiWithPrompt(prompt);
    showNotification('🌱 プロンプトをセットしてEcosia AIを開きました！（クリップボードにもコピー済み）');
    if (!customQuery) {
      setQueryText('');
    }
  };

  // 参照中のクイズについてEcosia AIで質問する
  const handleAskAboutQuiz = () => {
    if (!activeQuizContext) return;
    const prompt = formatQuizPromptForEcosia(activeQuizContext);
    openEcosiaAiWithPrompt(prompt);
    showNotification(`🌱 問題「${activeQuizContext.id}」の深掘りプロンプトをセットしてEcosia AIを開きました！`);
  };

  // カテゴリ別おすすめ質問プリセット
  const topicCategories = [
    {
      category: '政治・統治機構',
      icon: <Landmark className="w-4 h-4 text-indigo-500" />,
      color: 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20',
      questions: [
        { label: '参院選の1票の格差・合区問題', q: '参議院選挙の「1票の格差」をめぐる最高裁判例の流れと、地方代表権・合区解消に向けた議論の要点について' },
        { label: '政治資金規正法の改正ポイント', q: '政治資金規正法改正におけるパーティー券購入者の公開基準引き下げ、政策活動費の監査・使途公開の論点について' },
        { label: '防衛関連3文書と防衛費増額財源', q: '国家安全保障戦略など安保3文書の改定、反撃能力の保有、GDP比2%への防衛費増額と歳出改革・増税議論について' },
        { label: '憲法改正をめぐる主要論点', q: '憲法9条への自衛隊明記、緊急事態条項の新設、参院選合区解消など、憲法審査会で議論されている主要論点について' },
      ]
    },
    {
      category: '日本経済・財政政策',
      icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
      color: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20',
      questions: [
        { label: '日銀の利上げ方針と円安・物価', q: 'マイナス金利解除後の日本銀行の追加利上げ方針と、為替（円安）や家計・中小企業への影響について' },
        { label: '基礎的財政収支（PB）黒字化目標', q: '国の基礎的財政収支（プライマリーバランス）黒字化目標の達成時期と、社会保障費増大を踏まえた財政再建の課題について' },
        { label: '新NISAの仕組みと家計資産形成', q: '新NISA（少額投資非課税制度）の恒久化・非課税枠拡大の仕組みと、「貯蓄から投資へ」が経済に与える影響について' },
        { label: '春闘の賃上げと実質賃金・消費動向', q: '高水準の賃上げが続く春闘と、物価高に追いつくかどうかの「実質賃金」プラス定着への課題について' },
      ]
    },
    {
      category: '社会保障・農業・生活',
      icon: <Wheat className="w-4 h-4 text-amber-500" />,
      color: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20',
      questions: [
        { label: '2026年コメ安と農業政策の転換', q: '2024年のコメ高騰から一転した2026年のコメ安の背景、生産調整（減反）の見直しや農家の収益安定化の課題について' },
        { label: '子ども・子育て支援金と少子化対策', q: '「こども未来戦略」に基づく児童手当拡充と、公的医療保険料に上乗せして徴収される「子ども・子育て支援金」の仕組みについて' },
        { label: '年金財政検証と基礎年金の底上げ', q: '5年ごとの年金財政検証、マクロ経済スライドの調整期間一致による基礎年金の給付水準底上げ論点について' },
        { label: '医療・介護の2024・2026年同時改定', q: '診療報酬・介護報酬の改定動向と、現役世代の保険料負担軽減に向けた高所得高齢者の負担見直しについて' },
      ]
    },
    {
      category: 'エネルギー・環境・科学技術',
      icon: <Zap className="w-4 h-4 text-emerald-500" />,
      color: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20',
      questions: [
        { label: '第7次エネルギー基本計画と原発', q: '第7次エネルギー基本計画で「原発低減」文言が削除された経緯と、次世代革新炉への建て替え・脱炭素電源の位置付けについて' },
        { label: 'GX（脱炭素）経済移行債の仕組み', q: 'GX経済移行債を活用した今後10年で150兆円の官民投資計画、および将来の化石燃料賦課金・排出量取引（カーボンプライシング）について' },
        { label: '経済安全保障推進法の主要4本柱', q: '経済安全保障推進法の4本柱（特定重要物資の安定供給、基幹インフラ事前審査、先端重要技術官民協力、特許出願非公開）について' },
        { label: '国内生成AI開発と著作権・規制動向', q: '国産基盤モデル開発への支援と、文化庁の著作権ガイドライン、AI推進法案などリスク管理の枠組みについて' },
      ]
    },
    {
      category: '国際情勢・外交・安全保障',
      icon: <Globe2 className="w-4 h-4 text-purple-500" />,
      color: 'border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20',
      questions: [
        { label: '米中対立と半導体・サプライチェーン', q: '米国の対中半導体規制と日米欧の連携、半導体の国内誘致（ラピダスやTSMC熊本工場）の戦略的意義について' },
        { label: 'グローバルサウスの台頭と国際秩序', q: 'インドやブラジルなど新興国・途上国（グローバルサウス）の台頭と、多極化する国際秩序における日本の外交役割について' },
        { label: 'ウクライナ情勢・中東危機とエネルギー', q: '長期化するウクライナ戦争や中東情勢の緊迫化が世界のエネルギー市場、食料供給、国際連合の機能不全に与える影響について' },
        { label: '日米同盟の抑止力強化と地域連携', q: '自衛隊と米軍の指揮統制枠組みの向上、日米豪印（QUAD）や日米韓の安全保障協力の進展について' },
      ]
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 animate-fadeIn">
      
      {/* 画面ヘッダー */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                🌱 Ecosia AI 学習相談室
              </h2>
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                完全無料・登録不要
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              APIキーやログインは一切不要。ニュース検定（政治・経済・暮らし・社会環境・国際 全{allQuizzes.length}問）の疑問を地球に優しいAIで解決します
            </p>
          </div>
        </div>

        <a
          href="https://www.ecosia.org/ai-chat"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start md:self-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all shrink-0"
        >
          <span>Ecosia AIを開く</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 通知トースト */}
      {noticeMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs sm:text-sm flex items-center gap-3 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1 font-medium">{noticeMessage}</div>
        </div>
      )}

      {/* 直近のクイズが選択されている場合のハイライトカード */}
      {activeQuizContext && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-50/90 via-emerald-50/80 to-transparent dark:from-indigo-950/40 dark:via-emerald-950/30 border-2 border-emerald-400/50 dark:border-emerald-600/40 shadow-md space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>選択中の問題: {activeQuizContext.id}（{activeQuizContext.category}）</span>
            </div>
            <button
              onClick={() => {
                setActiveQuizContext(null);
                onClearQuizContext?.();
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-bold"
            >
              解除 ✕
            </button>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
            {activeQuizContext.question}
          </p>

          <button
            type="button"
            onClick={handleAskAboutQuiz}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
          >
            <Sprout className="w-4 h-4" />
            <span>この問題の背景・引っかけ理由をEcosia AIで質問する</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
          </button>
        </div>
      )}

      {/* 自由質問入力カード */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            知りたい時事用語・ニュースの疑問を自由に質問
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            入力したキーワードをニュース検定対策プロンプトに自動変換し、Ecosia AIを開きます
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskFreeText();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="例: 第7次エネルギー基本計画で原発が推進された理由、2026年コメ安の背景..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!queryText.trim()}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all shrink-0"
          >
            <Sprout className="w-4 h-4" />
            <span>Ecosia AIで質問する</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* カテゴリ別クイック質問ハブ */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>📚 頻出時事テーマ別 クイック深掘りハブ</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            気になる論点をタップするだけで、プロンプトが事前入力された状態でEcosia AIが即座に起動します
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicCategories.map((group, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border ${group.color} bg-white dark:bg-slate-900 shadow-sm space-y-3`}
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                {group.icon}
                <span>{group.category}</span>
              </div>

              <div className="space-y-2">
                {group.questions.map((item, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => handleAskFreeText(item.q)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex items-center justify-between group"
                  >
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                      • {item.label}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosia AIの利用メリット紹介バナー */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <Sprout className="w-4 h-4" />
            <span>なぜ本アプリは Ecosia AI に一本化したのか？</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            APIキー取得やログインのハードルを完全になくし、すべての受験者が1秒で高度なAI解説を活用できるようにするためです。さらに、質問や検索によって地球上に木が植えられ、100%再生可能エネルギーで動く、最もサステナブルな学習体験をお届けします。
          </p>
        </div>

        <a
          href="https://www.ecosia.org/about"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>Ecosiaの取り組み</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
