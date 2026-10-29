import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types/quiz';
import { ALL_FACTS } from '../data/facts';
import { 
  exportProgressJson, importProgressJson, resetAllProgress, saveProgress, getTodayString
} from '../utils/storage';
import { requestNotificationPermission, sendStudyReminder } from '../utils/notification';
import { 
  getStoredFirebaseConfig, 
  saveFirebaseConfig, 
  removeFirebaseConfig, 
  loginWithGoogle, 
  logoutFromFirebase, 
  onAuthStatusChange, 
  fetchProgressFromCloud, 
  saveProgressToCloud, 
  mergeUserProgress, 
  FirebaseConfig 
} from '../services/firebaseSync';
import { User } from 'firebase/auth';
import { 
  Moon, Sun, Bell, Download, Upload, RotateCcw, 
  ExternalLink, Settings, Shuffle,
  Sprout, Trees, Lock, Zap,
  Cloud, CheckCircle2, LogIn, LogOut, RefreshCw, KeyRound, ChevronDown, ChevronUp, AlertCircle
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
  const [importStatus, setImportStatus] = useState<string>('');
  
  // Firebase / Google Cloud 同期ステート
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig | null>(getStoredFirebaseConfig());
  const [configInput, setConfigInput] = useState<string>('');
  const [isConfigEditing, setIsConfigEditing] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // 認証状態の購読
  useEffect(() => {
    const unsubscribe = onAuthStatusChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [firebaseConfig]);

  const showSyncMessage = (text: string, isError = false) => {
    setSyncMessage({ text, isError });
    setTimeout(() => setSyncMessage(null), 5000);
  };

  // 貼り付けられたFirebase設定テキストを柔軟にパース
  const parseFirebaseConfig = (rawText: string): FirebaseConfig | null => {
    const text = rawText.trim();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {}

    try {
      const cleaned = text
        .replace(/const\s+firebaseConfig\s*=\s*/, '')
        .replace(/;/g, '')
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
        .replace(/'/g, '"');
      return JSON.parse(cleaned);
    } catch {}

    const apiKey = text.match(/apiKey["']?\s*:\s*["']([^"']+)["']/)?.[1];
    const authDomain = text.match(/authDomain["']?\s*:\s*["']([^"']+)["']/)?.[1];
    const projectId = text.match(/projectId["']?\s*:\s*["']([^"']+)["']/)?.[1];
    const storageBucket = text.match(/storageBucket["']?\s*:\s*["']([^"']+)["']/)?.[1];
    const messagingSenderId = text.match(/messagingSenderId["']?\s*:\s*["']([^"']+)["']/)?.[1];
    const appId = text.match(/appId["']?\s*:\s*["']([^"']+)["']/)?.[1];

    if (apiKey && projectId) {
      return {
        apiKey,
        authDomain: authDomain || `${projectId}.firebaseapp.com`,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
      };
    }
    return null;
  };

  // Firebase設定の保存
  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFirebaseConfig(configInput);
    if (!parsed) {
      showSyncMessage('Firebase設定を認識できませんでした。コンソールに表示される firebaseConfig オブジェクトまたはJSONを貼り付けてください。', true);
      return;
    }

    saveFirebaseConfig(parsed);
    setFirebaseConfig(parsed);
    setConfigInput('');
    setIsConfigEditing(false);
    showSyncMessage('✅ Google Cloud (Firebase) 設定を保存しました！');
  };

  // Firebase設定の削除
  const handleRemoveFirebaseConfig = () => {
    if (confirm('Google Cloud / Firebase設定を削除しますか？クラウド同期が解除されます。')) {
      removeFirebaseConfig();
      setFirebaseConfig(null);
      setIsConfigEditing(true);
      showSyncMessage('Firebase設定を削除しました。');
    }
  };

  // Googleログイン実行＆データ同期
  const handleGoogleLogin = async () => {
    if (!firebaseConfig) {
      setIsConfigEditing(true);
      showSyncMessage('先にGoogle Cloud / Firebaseプロジェクト設定を登録してください。', true);
      return;
    }

    try {
      setIsSyncing(true);
      const user = await loginWithGoogle();
      if (user) {
        // クラウドの進捗を取得してローカルとマージ
        const cloudProgress = await fetchProgressFromCloud(user.uid);
        if (cloudProgress) {
          const merged = mergeUserProgress(progress, cloudProgress);
          saveProgress(merged);
          setProgress(merged);
          await saveProgressToCloud(user.uid, merged);
          showSyncMessage(`🎉 ${user.displayName || 'Googleユーザー'} でログインし、クラウド進捗と同期しました！`);
        } else {
          // クラウドにまだデータがない場合はローカル進捗を初回アップロード
          await saveProgressToCloud(user.uid, progress);
          showSyncMessage(`🎉 ${user.displayName || 'Googleユーザー'} でログインし、現在の進捗をクラウドに保存しました！`);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        showSyncMessage('⚠️ Firebaseコンソールで「Authentication」のGoogleプロバイダーを有効化してください。', true);
      } else if (err.code === 'auth/popup-blocked') {
        showSyncMessage('⚠️ ポップアップがブロックされました。ブラウザのポップアップを許可するか、もう一度お試しください。', true);
      } else if (err.code === 'auth/unauthorized-domain') {
        showSyncMessage(`⚠️ 承認されていないドメインです。Firebase Consoleの「承認済みドメイン」にこのURLを追加してください。`, true);
      } else {
        showSyncMessage(`⚠️ ログインエラー: ${err.message || 'ログインに失敗しました'}`, true);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // ログアウト
  const handleLogout = async () => {
    try {
      await logoutFromFirebase();
      showSyncMessage('ログアウトしました。ローカルデータは端末に残ります。');
    } catch (err: any) {
      console.error(err);
    }
  };

  // 手動今すぐ同期
  const handleManualSync = async () => {
    if (!currentUser) return;
    try {
      setIsSyncing(true);
      const cloudProgress = await fetchProgressFromCloud(currentUser.uid);
      if (cloudProgress) {
        const merged = mergeUserProgress(progress, cloudProgress);
        saveProgress(merged);
        setProgress(merged);
        await saveProgressToCloud(currentUser.uid, merged);
        showSyncMessage('☁️ クラウドと双方向同期が完了しました！');
      } else {
        await saveProgressToCloud(currentUser.uid, progress);
        showSyncMessage('☁️ クラウドへ最新データを保存しました！');
      }
    } catch (err: any) {
      console.error(err);
      showSyncMessage(`⚠️ 同期エラー: ${err.message}`, true);
    } finally {
      setIsSyncing(false);
    }
  };

  // 通知リマインダー切り替え
  const handleNotifyToggle = async () => {
    if (!progress.notificationEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        const next = {
          ...progress,
          notificationEnabled: true,
          // 有効化した日の即時通知と、スケジューラの同日通知を重複させない
          lastNotificationDate: getTodayString(),
        };
        saveProgress(next);
        setProgress(next);
        if (currentUser) saveProgressToCloud(currentUser.uid, next);
        sendStudyReminder('リマインダー通知が有効になりました！毎日学習をサポートします。');
        showSyncMessage('学習リマインダーをONにしました。指定時刻にアプリ起動中または起動時に通知します。');
      } else {
        showSyncMessage('通知が許可されませんでした。ブラウザの通知設定を確認してください。', true);
      }
    } else {
      const next = { ...progress, notificationEnabled: false };
      saveProgress(next);
      setProgress(next);
      if (currentUser) saveProgressToCloud(currentUser.uid, next);
      showSyncMessage('学習リマインダーをOFFにしました。');
    }
  };

  // 通知時刻の変更
  const handleNotificationTimeChange = (time: string) => {
    const next = { ...progress, notificationTime: time };
    saveProgress(next);
    setProgress(next);
    if (currentUser) saveProgressToCloud(currentUser.uid, next);
  };

  // データエクスポート
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

  // データインポート
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importProgressJson(content);
        if (ok) {
          const parsed = JSON.parse(content);
          setImportStatus('✅ データを正常に復元しました！');
          setProgress(parsed);
          if (currentUser) {
            saveProgressToCloud(currentUser.uid, parsed);
          }
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

  // データ全初期化
  const handleResetData = () => {
    if (confirm('⚠️ すべての学習進捗・正答履歴・ブックマークを初期化しますか？この操作は取り消せません。')) {
      const next = resetAllProgress();
      setProgress(next);
      if (currentUser) {
        saveProgressToCloud(currentUser.uid, next);
      }
      showSyncMessage('すべてのデータを初期化しました。');
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
            設定 & クラウド同期
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Google Cloud同期・外観・通知・データのバックアップを管理します
          </p>
        </div>
      </div>

      {/* 同期通知メッセージ */}
      {syncMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-fadeIn ${
            syncMessage.isError
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
              : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
          }`}
        >
          {syncMessage.isError ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{syncMessage.text}</span>
        </div>
      )}

      {/* 1. ☁️ Google Cloud アカウント同期（公式サーバー連携） */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-transparent border-2 border-indigo-500/30 dark:border-indigo-500/20 shadow-md space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20 shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                  Google Cloud アカウント同期
                </h3>
                {currentUser ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    クラウド同期中
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    公式サーバー接続済
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Googleアカウントでログインすると、スマホ・PCなどの別端末間でも学習進捗・正答履歴・ストリークが自動で同期されます
              </p>
            </div>
          </div>
        </div>

        {/* ログイン中 / 未ログインの表示切替 */}
        {currentUser ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User'} 
                  className="w-11 h-11 rounded-full border-2 border-emerald-500 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                  {currentUser.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                  <span>{currentUser.displayName || 'Googleアカウント'}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? '同期中...' : '今すぐ同期'}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1 transition-colors"
                title="ログアウト"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ログアウト</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <span>ワンタップでクラウド同期を開始</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  設定入力不要
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Googleでログインすると、あなた専用の学習データがGoogle Cloud (Firestore) に自動保存されます。
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSyncing}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all shrink-0 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSyncing ? '接続中...' : 'Googleでログインして同期'}</span>
            </button>
          </div>
        )}

        {/* 高度な設定トグル（通常は不要） */}
        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsConfigEditing(!isConfigEditing)}
            className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 font-medium transition-colors"
          >
            <KeyRound className="w-3 h-3" />
            <span>{isConfigEditing ? '高度な設定を閉じる' : '⚙️ 高度な設定（カスタムFirebase）'}</span>
          </button>
        </div>

        {/* カスタムFirebase設定フォーム（折りたたみ） */}
        {isConfigEditing && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-slideDown text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                独自のFirebaseプロジェクトに差し替える場合のみ使用
              </span>
              <button
                type="button"
                onClick={() => setIsGuideOpen(!isGuideOpen)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                <span>手順ガイド</span>
                {isGuideOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {isGuideOpen && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <div>Firebase Consoleの「プロジェクトの設定」➔「マイアプリ」からWeb設定をコピーして貼り付けてください。</div>
              </div>
            )}

            <form onSubmit={handleSaveFirebaseConfig} className="space-y-2">
              <textarea
                value={configInput}
                onChange={(e) => setConfigInput(e.target.value)}
                placeholder={`{\n  "apiKey": "AIzaSy...",\n  "projectId": "your-project"\n}`}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="submit"
                  disabled={!configInput.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition-all text-[11px]"
                >
                  カスタム設定を保存
                </button>
                {firebaseConfig && (
                  <button
                    type="button"
                    onClick={handleRemoveFirebaseConfig}
                    className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-[11px]"
                  >
                    公式設定にリセット
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 2. 外観設定（テーマ切替） */}
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

      {/* ④ 演習設定（選択肢シャッフル） */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-indigo-500" />
          出題・選択肢のシャッフル
        </h3>
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              選択肢（A〜D）の並び順を毎回ランダムに入れ替え
            </div>
            <div className="text-[11px] text-slate-400">
              {progress.shuffleOptions !== false ? '有効（場所で覚えるのを防ぎ、真の知識定着を促します）' : '無効（元の固定順序のまま出題します）'}
            </div>
          </div>
          <button
            onClick={() => {
              const current = progress.shuffleOptions !== false;
              const next = { ...progress, shuffleOptions: !current };
              saveProgress(next);
              setProgress(next);
              if (currentUser) {
                saveProgressToCloud(currentUser.uid, next);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              progress.shuffleOptions !== false
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {progress.shuffleOptions !== false ? 'シャッフル ON ✓' : 'シャッフル OFF'}
          </button>
        </div>
      </div>

      {/* 3. 学習リマインダー通知 */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          毎日の学習リマインダー
        </h3>
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              学習リマインダー通知
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {progress.notificationEnabled ? '毎日の学習習慣化通知が有効です' : '通知をONにすると毎日の継続を応援します'}
            </div>
          </div>
          <button
            onClick={handleNotifyToggle}
            aria-pressed={progress.notificationEnabled}
            aria-label={progress.notificationEnabled ? '学習リマインダー通知をOFFにする' : '学習リマインダー通知をONにする'}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              progress.notificationEnabled
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {progress.notificationEnabled ? '通知 ON ✓' : '通知 OFF'}
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label htmlFor="notification-time" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
            通知時刻
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="notification-time"
              type="time"
              value={progress.notificationTime || '20:00'}
              onChange={(e) => handleNotificationTimeChange(e.target.value)}
              disabled={!progress.notificationEnabled}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              アプリ起動中／起動時に、この時刻を過ぎていれば1日1回通知
            </span>
          </div>
        </div>
      </div>

      {/* 4. 🌱 Ecosia AIについて（おすすめの理由） */}
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
              リアルタイムWeb検索と連動しており、法改正や最新の政治・経済・暮らしの動向、用語の対立軸も鮮度の高い情報で詳しく答えてくれます。
            </p>
          </div>
        </div>
      </div>

      {/* 5. 学習データのバックアップ & 復元 */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Download className="w-4 h-4 text-teal-500" />
          データの保存・手動ファイル書き出し
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Google Cloud同期のほかに、進捗データをJSONファイルとして直接バックアップ・復元することも可能です。
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

      {/* 6. アプリケーション情報 */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-1 text-xs text-slate-400">
        <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
          <span>🧠 超難問クイズマスター PRO</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
            v1.1.0
          </span>
        </div>
        <p className="text-[11px]">
          総問題数: {totalQuizzesCount}問 ｜ 政治・経済・暮らし・社会環境 全{ALL_FACTS.length}論点 100% 完全網羅
        </p>
        <p className="text-[10px] opacity-75">
          Google Cloud (Firebase Firestore) 自動同期 ＆ PWA 対応
        </p>
      </div>

    </div>
  );
};
