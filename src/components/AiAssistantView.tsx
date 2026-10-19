import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../types/quiz';
import { 
  getStoredApiKey, saveApiKey, removeApiKey, askGemini, ChatMessage 
} from '../services/aiService';
import { 
  Sparkles, Key, Send, Trash2, ShieldCheck, ExternalLink, Bot, User, BookOpen, AlertCircle, RefreshCw,
  Sprout, CheckCircle2
} from 'lucide-react';
import { openEcosiaAiWithPrompt } from '../utils/ecosiaAi';

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
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [inputKey, setInputKey] = useState<string>('');
  const [isKeyEditing, setIsKeyEditing] = useState<boolean>(!getStoredApiKey());
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: `こんにちは！「超難問クイズマスター」専任AIチューターです。\n\n全289問（政治・経済の全607論点）のクイズやソーステキストの内容をもとに、法律の背景、経済動向、制度の仕組み、選択肢の引っかけ理由などを徹底解説します。\n\nGemini APIキーを設定して、疑問に思ったことを何でも質問してください！`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeQuizContext, setActiveQuizContext] = useState<QuizQuestion | null>(initialQuizContext || null);
  const [ecosiaSearchText, setEcosiaSearchText] = useState<string>('');
  const [ecosiaOpenedNotice, setEcosiaOpenedNotice] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleOpenEcosiaDirect = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;
    const fullPrompt = `【ニュース検定・時事学習の質問】
質問内容: ${q}

上記のテーマについて、ニュース検定（1級・2級レベル）対策として知っておくべき法律・制度の背景や対立軸、最新の動向をわかりやすく丁寧に解説してください。`;
    openEcosiaAiWithPrompt(fullPrompt);
    setEcosiaOpenedNotice(true);
    setTimeout(() => setEcosiaOpenedNotice(false), 5000);
  };

  // 初期問題コンテキストが渡された場合の反映
  useEffect(() => {
    if (initialQuizContext) {
      setActiveQuizContext(initialQuizContext);
      setInputQuery(`この問題（ID: ${initialQuizContext.id}「${initialQuizContext.sourceSection}」）の選択肢の引っかけポイントと背景について詳しく解説してください。`);
    }
  }, [initialQuizContext]);

  // メッセージ追加時の自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    saveApiKey(inputKey.trim());
    setApiKey(inputKey.trim());
    setIsKeyEditing(false);
    setInputKey('');
  };

  const handleRemoveKey = () => {
    if (confirm('保存されたAPIキーを削除しますか？')) {
      removeApiKey();
      setApiKey('');
      setIsKeyEditing(true);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    if (!apiKey) {
      alert('AIに質問するには、まずGemini APIキーを入力して保存してください。');
      setIsKeyEditing(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quizContextId: activeQuizContext?.id,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // 過去のチャット履歴（直近4往復程度）
      const chatHistory = messages
        .filter(m => m.id !== 'welcome')
        .slice(-8)
        .map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          parts: [{ text: m.text }],
        }));

      const responseText = await askGemini({
        apiKey,
        prompt: textToSend,
        quizContext: activeQuizContext ? {
          id: activeQuizContext.id,
          question: activeQuizContext.question,
          category: activeQuizContext.category,
          sourceSection: activeQuizContext.sourceSection,
          options: activeQuizContext.options,
          correctAnswers: activeQuizContext.correctAnswers,
          explanations: activeQuizContext.explanations,
        } : undefined,
        chatHistory,
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: `⚠️ エラーが発生しました: ${err.message || '通信に失敗しました。APIキーが有効かご確認ください。'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // おすすめ質問サンプル
  const samplePrompts = [
    '令和のコメ騒動から一転した2026年「コメ安」の背景と農家の課題は？',
    '第7次エネルギー基本計画で「原発低減」文言が削除された経緯を教えて',
    '核燃料サイクルのプルサーマルと高速炉の違い、六ヶ所村の現状は？',
    '参議院選挙の「1票の格差・合区」をめぐる最高裁判例の流れは？',
    '2022年成立の経済安全保障推進法の主要な4本柱について解説して',
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* 画面ヘッダー */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              AI学習アシスタント相談室
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                BYOK方式
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              本アプリの全{allQuizzes.length}問・全607論点（政治・経済）とAI知識を元に、あらゆる疑問に答えます
            </p>
          </div>
        </div>

        {/* APIキー設定ボタン */}
        <div className="flex items-center gap-2">
          {apiKey ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Gemini連携中</span>
              <button 
                onClick={() => setIsKeyEditing(!isKeyEditing)}
                className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
              >
                {isKeyEditing ? '閉じる' : '設定'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsKeyEditing(!isKeyEditing)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              Gemini API設定 (任意)
            </button>
          )}
        </div>
      </div>

      {/* 🌱 【メイン】Ecosia AI 即時質問カード（登録・API不要） */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-500/20">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">
                  🌱 Ecosia AI に質問する
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  登録・API不要！完全無料
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                質問がすでに入力された状態でEcosia AIが開きます。地球の植樹と再エネ100%で動くエシカルAIです。
              </p>
            </div>
          </div>
          <a
            href="https://www.ecosia.org/ai-chat"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Ecosia公式を開く <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 自由質問入力フォーム */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleOpenEcosiaDirect(ecosiaSearchText);
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2"
        >
          <input
            type="text"
            value={ecosiaSearchText}
            onChange={(e) => setEcosiaSearchText(e.target.value)}
            placeholder="知りたい時事用語・政策・疑問を入力（例: 2026年コメ安の要因、第7次エネルギー基本計画...）"
            className="flex-1 px-4 py-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!ecosiaSearchText.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all shrink-0"
          >
            <Sprout className="w-4 h-4" />
            <span>Ecosia AIで開く</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
          </button>
        </form>

        {/* Ecosia開いた通知 */}
        {ecosiaOpenedNotice && (
          <div className="p-3 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>プロンプトを自動入力してEcosia AIを開きました！（クリップボードにもコピー済みです）</span>
          </div>
        )}

        {/* おすすめ質問クイックタグ */}
        <div className="pt-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
            👇 ワンタップで質問できる注目の頻出時事テーマ（タップですぐにEcosia AIが開きます）：
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '🌾 2026年コメ安・農業政策の転換', q: '2024年のコメ高騰から一転した2026年のコメ安の背景、生産調整や農家の収益構造の課題について' },
              { label: '⚡ 第7次エネルギー基本計画と原発', q: '第7次エネルギー基本計画で「原発低減」文言が削除された経緯と脱炭素電源の位置付けについて' },
              { label: '🗳️ 参院選の1票の格差・合区問題', q: '参議院選挙の「1票の格差」をめぐる最高裁違憲状態判決の流れと「合区」解消の議論について' },
              { label: '🛡️ 経済安全保障推進法の主要4本柱', q: '経済安全保障推進法（基幹インフラ、特定重要物資、先端技術官民協力、特許非公開）のポイントについて' },
              { label: '📈 日銀の追加利上げと為替・物価動向', q: '日本銀行のマイナス金利解除後の追加利上げ方針と、円安・インフレへの影響について' },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleOpenEcosiaDirect(item.q)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-500 dark:hover:border-emerald-400 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>{item.label}</span>
                <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* APIキー編集パネル（Gemini） */}
      {isKeyEditing && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-slideDown">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-500" />
                Gemini APIキーの設定（画面内インライン対話用 / BYOK）
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                ※ Ecosia AIをご利用の場合はAPIキーは不要です。アプリ画面内で直接チャット対話を行いたい場合のみ設定してください。キーはお使いのブラウザ内部にのみ保存されます。
              </p>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
            >
              無料キー取得 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <form onSubmit={handleSaveKey} className="mt-4 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder={apiKey ? '新しいAPIキーを入力して上書き（AIzaSy...）' : 'Gemini APIキーを入力（AIzaSy...）'}
              className="w-full flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                保存する
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleRemoveKey}
                  className="px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all"
                  title="キーを削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* 選択中の問題コンテキストバナー */}
      {activeQuizContext && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
              <span>参照中の問題: {activeQuizContext.id}（{activeQuizContext.category} / {activeQuizContext.sourceSection}）</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
              {activeQuizContext.question}
            </p>
          </div>
          <button
            onClick={() => {
              setActiveQuizContext(null);
              onClearQuizContext?.();
            }}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shrink-0 font-bold"
          >
            解除 ✕
          </button>
        </div>
      )}

      {/* チャットメッセージ表示エリア */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 min-h-[420px] flex flex-col justify-between">
        
        {/* メッセージリスト */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* アバター */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : m.sender === 'system'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                    : 'bg-gradient-to-tr from-violet-600 to-indigo-500 text-white'
                }`}
              >
                {m.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : m.sender === 'system' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* メッセージ本文 */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10'
                    : m.sender === 'system'
                    ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 rounded-tl-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-1.5 text-right opacity-60 ${
                    m.sender === 'user' ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* AI応答生成中スピナー */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                <span>クイズデータと知識を分析して回答を生成中...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 下部：おすすめ質問チップ & 入力フォーム */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          
          {/* おすすめチップ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">💡 質問の例:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p)}
                disabled={isLoading}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-300 transition-colors whitespace-nowrap text-xs font-medium border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
              >
                {p}
              </button>
            ))}
          </div>

          {/* 入力フォーム */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                apiKey
                  ? 'クイズの疑問、法律の背景、選択肢の理由などを入力して質問...'
                  : '質問するには、まず上部でGemini APIキーを設定してください'
              }
              disabled={isLoading || !apiKey}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim() || !apiKey}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0"
              title="送信"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
