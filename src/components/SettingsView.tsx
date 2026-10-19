import React, { useState } from 'react';
import { UserProgress } from '../types/quiz';
import { 
  getStoredApiKey, saveApiKey, removeApiKey 
} from '../services/aiService';
import { 
  exportProgressJson, importProgressJson, resetAllProgress, saveProgress 
} from '../utils/storage';
import { requestNotificationPermission, sendStudyReminder } from '../utils/notification';
import { 
  Moon, Sun, Bell, Key, Download, Upload, RotateCcw, 
  ShieldCheck, ExternalLink, Check, Settings,
  Sprout, Trees, Lock, Zap
} from 'lucide-react';

interface SettingsViewProps {
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  totalQuizzesCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  progress,
  setProgress,
  darkMode,
  setDarkMode,
  totalQuizzesCount,
}) => {
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [inputKey, setInputKey] = useState<string>('');
  const [keySavedMsg, setKeySavedMsg] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    saveApiKey(inputKey.trim());
    setApiKey(inputKey.trim());
    setInputKey('');
    setKeySavedMsg(true);
    setTimeout(() => setKeySavedMsg(false), 3000);
  };

  const handleRemoveKey = () => {
    if (confirm('保存されたAPIキーを削除しますか？')) {
      removeApiKey();
      setApiKey('');
    }
  };

  const handleNotifyToggle = async () => {
    if (!progress.notificationEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        const next = { ...progress, notificationEnabled: true };
        saveProgress(next);
        setProgress(next);
        sendStudyReminder('リマインダー通知が有効になりました！毎日学習をサポートします。');
      }
    } else {
      const next = { ...progress, notificationEnabled: false };
      saveProgress(next);
      setProgress(next);
    }
  };

  const handleExport = () => {
    const jsonStr = exportProgressJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_progress_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importProgressJson(content);
        if (ok) {
          setImportStatus('✅ データを正常に復元しました！');
          setProgress(JSON.parse(content));
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          setImportStatus('❌ ファイル形式が正しくありません。');
          setTimeout(() => setImportStatus(''), 4000);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (confirm('⚠️ すべての学習進捗・正答履歴・ブックマークを初期化しますか？この操作は取り消せません。')) {
      const next = resetAllProgress();
      setProgress(next);
      alert('すべてのデータを初期化しました。');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24 animate-fadeIn">
      
      {/* 画面ヘッダー */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xl font-bold">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            設定 & カスタマイズ
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            外観・通知・AIキー・データのバックアップを管理します
          </p>
        </div>
      </div>

      {/* 1. 外観設定（テーマ切替） */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          画面の表示テーマ
        </h3>
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {darkMode ? 'ダークモード（夜間・省電力）' : 'ライトモード（標準）'}
            </div>
            <div className="text-[11px] text-slate-400">
              お使いの端末や好みに合わせて背景の明暗を切り替えます
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              darkMode
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {darkMode ? 'ライトに変更' : 'ダークに変更'}
          </button>
        </div>
      </div>

      {/* 2. 学習リマインダー通知 */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          毎日の学習リマインダー
        </h3>
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              プッシュ通知による復習のお知らせ
            </div>
            <div className="text-[11px] text-slate-400">
              {progress.notificationEnabled ? '毎日の学習習慣化通知が有効です' : '通知をONにすると毎日の継続を応援します'}
            </div>
          </div>
          <button
            onClick={handleNotifyToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              progress.notificationEnabled
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {progress.notificationEnabled ? '通知 ON ✓' : '通知 OFF'}
          </button>
        </div>
      </div>

      {/* 3. 🌱 Ecosia AIについて（おすすめの理由） */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-lg shadow-md shadow-emerald-500/20 shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                  🌱 Ecosia AI をおすすめする理由
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  推奨
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                本アプリでは、環境保護・手軽さ・高精度の観点からEcosia AIとの連携を最も推奨しています
              </p>
            </div>
          </div>

          <a
            href="https://www.ecosia.org/ai-chat"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
          >
            <span>Ecosia AIを開く</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4つの素晴らしさポイント */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>登録不要・APIキー完全不要</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              GoogleアカウントやAPIキーの取得といった面倒な初期設定は一切不要。タップ1つで即座にAI解説が受けられます。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Trees className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>地球を再生するグリーンAI</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              収益の100%を気候変動対策・世界各地の植樹活動に還元。自社太陽光発電により消費電力の200%を発電するエコAIです。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>徹底したプライバシー保護</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              個人プロファイルの作成や広告主へのデータ転売を行わず、検索履歴も数日で完全に匿名化される高いプライバシー基準です。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Sprout className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>最新時事ニュースの網羅性</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              リアルタイムWeb検索と連動しており、法改正や最新の政治・経済の動向、用語の対立軸も鮮度の高い情報で詳しく答えてくれます。
            </p>
          </div>

        </div>
      </div>

      {/* 4. Gemini APIキー設定（BYOK / 上級者向け） */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Key className="w-4 h-4 text-violet-500" />
            Gemini API設定（画面内インライン対話用 / BYOK）
          </h3>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
          >
            キーを無料取得 <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          入力されたキーはお使いのブラウザ内部（LocalStorage）にのみ安全に保存され、**外部サーバーや運営者には1ミリも送信されず一切見えません**。Google公式エンドポイントへ直接安全に通信します。
        </p>

        {apiKey ? (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>APIキーが安全に設定されています</span>
            </div>
            <button
              onClick={handleRemoveKey}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 text-rose-600 text-xs font-bold hover:bg-rose-50"
            >
              削除
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSaveKey} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder={apiKey ? '新しいキーを入力して上書き（AIzaSy...）' : 'Gemini APIキーを入力（AIzaSy...）'}
            className="w-full flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={!inputKey.trim()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-sm"
          >
            保存する
          </button>
        </form>

        {keySavedMsg && (
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-fadeIn">
            <Check className="w-3.5 h-3.5" /> APIキーを安全に保存しました！
          </div>
        )}
      </div>

      {/* 4. 学習データのバックアップ & 復元 */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Download className="w-4 h-4 text-teal-500" />
          データの保存・別端末への引き継ぎ
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          PCからスマホへ、または機種変更時に学習履歴をそのまま移行できます。
        </p>

        {importStatus && (
          <div className="text-xs font-bold p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleExport}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-teal-500" />
            データを書き出し (JSON)
          </button>

          <label className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-500" />
            データ読み込み (復元)
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {/* データリセット */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-rose-500 font-medium">
            全成績・履歴の初期化
          </div>
          <button
            type="button"
            onClick={handleResetData}
            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            全履歴リセット
          </button>
        </div>
      </div>

      {/* 5. アプリケーション情報 */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-1 text-xs text-slate-400">
        <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
          <span>🧠 超難問クイズマスター PRO</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
            v1.0.0
          </span>
        </div>
        <p className="text-[11px]">
          総問題数: {totalQuizzesCount}問 ｜ 政治・経済 全607論点 100% 完全網羅
        </p>
        <p className="text-[10px] opacity-75">
          GitHub Pages & PWA 対応 ｜ モバイル完全最適化
        </p>
      </div>

    </div>
  );
};
