import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  Firestore, 
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { UserProgress, MockHistoryRecord } from '../types/quiz';

import { DEFAULT_FIREBASE_CONFIG } from '../config/firebaseConfig';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const CONFIG_STORAGE_KEY = 'quiz_firebase_config_v1';

/**
 * 保存されたFirebase設定を取得（デフォルト設定があれば自動フォールバック）
 */
export const getStoredFirebaseConfig = (): FirebaseConfig | null => {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored firebase config:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
};

/**
 * Firebase設定をLocalStorageに保存
 */
export const saveFirebaseConfig = (config: FirebaseConfig): void => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};

/**
 * Firebase設定を削除
 */
export const removeFirebaseConfig = (): void => {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
};

let currentApp: FirebaseApp | null = null;
let currentAuth: Auth | null = null;
let currentDb: Firestore | null = null;

/**
 * Firebaseインスタンスを初期化または取得
 */
export const getFirebaseServices = (config?: FirebaseConfig | null): { 
  app: FirebaseApp | null; 
  auth: Auth | null; 
  db: Firestore | null 
} => {
  const targetConfig = config || getStoredFirebaseConfig();
  if (!targetConfig || !targetConfig.apiKey || !targetConfig.projectId) {
    return { app: null, auth: null, db: null };
  }

  try {
    if (getApps().length > 0) {
      currentApp = getApp();
    } else {
      currentApp = initializeApp(targetConfig);
    }
    currentAuth = getAuth(currentApp);
    currentDb = getFirestore(currentApp);
    return { app: currentApp, auth: currentAuth, db: currentDb };
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return { app: null, auth: null, db: null };
  }
};

/**
 * Googleアカウントでサインイン（ポップアップ、ブロック時はリダイレクト）
 */
export const loginWithGoogle = async (): Promise<User | null> => {
  const { auth } = getFirebaseServices();
  if (!auth) {
    throw new Error('Google Cloud / Firebase設定が未登録です。設定画面からプロジェクト設定を入力してください。');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (popupErr: any) {
    // ポップアップがブロックされた場合はリダイレクトにフォールバック
    if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw popupErr;
  }
};

/**
 * ログアウト
 */
export const logoutFromFirebase = async (): Promise<void> => {
  const { auth } = getFirebaseServices();
  if (auth) {
    await signOut(auth);
  }
};

/**
 * 認証状態の監視リスナー
 */
export const onAuthStatusChange = (callback: (user: User | null) => void): (() => void) => {
  const { auth } = getFirebaseServices();
  if (!auth) {
    callback(null);
    return () => {};
  }
  // リダイレクト復帰時の認証結果を確認
  getRedirectResult(auth).catch((err) => {
    console.warn('Redirect auth result check:', err);
  });
  return onAuthStateChanged(auth, callback);
};

/**
 * ローカル進捗とクラウド進捗を賢くマージする
 */
export const mergeUserProgress = (
  local: UserProgress,
  cloud: UserProgress,
  validQuizIds?: string[]
): UserProgress => {
  // 1. 解答履歴のマージ（最新の解答日時または完全正解を優先）
  const mergedHistory = { ...cloud.history };
  for (const [quizId, localRecord] of Object.entries(local.history)) {
    const cloudRecord = mergedHistory[quizId];
    if (!cloudRecord) {
      mergedHistory[quizId] = localRecord;
    } else {
      // どちらかが完全正解なら完全正解を採用、日付が新しい方を採用
      const isNewer = new Date(localRecord.answeredAt).getTime() > new Date(cloudRecord.answeredAt).getTime();
      const isFullyCorrect = localRecord.isFullyCorrect || cloudRecord.isFullyCorrect;
      mergedHistory[quizId] = {
        ...(isNewer ? localRecord : cloudRecord),
        isFullyCorrect,
      };
    }
  }

  // 2. ブックマークのマージ（重複のないSet）
  const mergedBookmarks = Array.from(new Set([...(local.bookmarks || []), ...(cloud.bookmarks || [])]));

  // 3. ストリークのマージ（大きい方・新しい方を保持）
  const streakCurrent = Math.max(local.streak?.current || 0, cloud.streak?.current || 0);
  const lastActiveDate = (local.streak?.lastActiveDate || '') > (cloud.streak?.lastActiveDate || '')
    ? local.streak?.lastActiveDate
    : cloud.streak?.lastActiveDate;

  // 4. 日別アクティビティ履歴のマージ
  const activityMap = new Map<string, { count: number; correctCount: number }>();
  for (const item of [...(cloud.activityHistory || []), ...(local.activityHistory || [])]) {
    const prev = activityMap.get(item.date) || { count: 0, correctCount: 0 };
    activityMap.set(item.date, {
      count: Math.max(prev.count, item.count),
      correctCount: Math.max(prev.correctCount, item.correctCount),
    });
  }
  const mergedActivityHistory = Array.from(activityMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 5. 中断セッション（activeSession）のマージ
  // sessionUpdatedAt または activeSession.timestamp を比較して、より最新のセッション状態を採用
  let mergedActiveSession = local.activeSession;
  const localTime = new Date(local.sessionUpdatedAt || local.activeSession?.timestamp || 0).getTime();
  const cloudTime = new Date(cloud.sessionUpdatedAt || cloud.activeSession?.timestamp || 0).getTime();

  if (cloudTime > localTime) {
    // クラウド側がより新しい場合（別端末で更新・完了・破棄された）
    mergedActiveSession = cloud.activeSession;
  } else if (localTime > cloudTime) {
    // ローカル側がより新しい場合
    mergedActiveSession = local.activeSession;
  } else {
    // 同時刻または不明な場合は、存在する方を採用
    mergedActiveSession = local.activeSession || cloud.activeSession || null;
  }

  const mergedSessionUpdatedAt = cloudTime > localTime 
    ? cloud.sessionUpdatedAt 
    : (local.sessionUpdatedAt || cloud.sessionUpdatedAt);

  // 忘却曲線復習ステータスのマージ
  const mergedSR = { ...(cloud.spacedRepetition || {}), ...(local.spacedRepetition || {}) };

  // 有効なクイズIDが指定されている場合は孤立ID（旧問題）を除外
  let finalHistory = mergedHistory;
  let finalBookmarks = mergedBookmarks;
  let finalSR = mergedSR;

  if (validQuizIds && validQuizIds.length > 0) {
    const validSet = new Set(validQuizIds);

    finalHistory = {};
    for (const [id, rec] of Object.entries(mergedHistory)) {
      if (validSet.has(id)) finalHistory[id] = rec;
    }

    finalBookmarks = mergedBookmarks.filter(id => validSet.has(id));

    finalSR = {};
    for (const [id, item] of Object.entries(mergedSR)) {
      if (validSet.has(id)) finalSR[id] = item;
    }
  }
  // 日別解答ログのマージ
  const mergedDailyLogs: Record<string, any[]> = {};
  const allLogDates = new Set([
    ...Object.keys(local.dailyLogs || {}),
    ...Object.keys(cloud.dailyLogs || {})
  ]);
  allLogDates.forEach(date => {
    const lList = (local.dailyLogs || {})[date] || [];
    const cList = (cloud.dailyLogs || {})[date] || [];
    // timestamp または quizId+answeredAt でユニーク化
    const byKey = new Map<string, any>();
    for (const item of [...lList, ...cList]) {
      const key = `${item.quizId}_${item.answeredAt}`;
      const prev = byKey.get(key);
      if (!prev) {
        byKey.set(key, item);
      } else if (!prev.mode && item.mode) {
        // 旧ログ（modeなし）より、モード付きのログを優先
        byKey.set(key, { ...prev, mode: item.mode });
      }
    }
    mergedDailyLogs[date] = Array.from(byKey.values());
  });

  // 模試履歴のマージ（idでユニーク・新しい順・最大50件）
  const mockMap = new Map<string, MockHistoryRecord>();
  for (const item of [...(local.mockHistory || []), ...(cloud.mockHistory || [])]) {
    mockMap.set(item.id, item);
  }
  const mergedMockHistory = Array.from(mockMap.values())
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 50);

  return {
    history: finalHistory,
    bookmarks: finalBookmarks,
    streak: {
      current: streakCurrent,
      lastActiveDate: lastActiveDate || new Date().toISOString().split('T')[0],
    },
    dailyGoal: local.dailyGoal || cloud.dailyGoal || 30,
    activityHistory: mergedActivityHistory,
    notificationTime: local.notificationTime || cloud.notificationTime || '20:00',
    notificationEnabled: local.notificationEnabled ?? cloud.notificationEnabled ?? false,
    activeSession: mergedActiveSession,
    sessionUpdatedAt: mergedSessionUpdatedAt,
    spacedRepetition: finalSR,
    dailyLogs: mergedDailyLogs,
    mockHistory: mergedMockHistory,
    shuffleOptions: local.shuffleOptions ?? cloud.shuffleOptions ?? true,
    unlockedAchievements: Array.from(new Set([
      ...(local.unlockedAchievements || []),
      ...(cloud.unlockedAchievements || [])
    ])),
  };
};

/**
 * クラウド（Firestore）に進捗データを保存
 */
export const saveProgressToCloud = async (userId: string, progress: UserProgress): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;

  const userDocRef = doc(db, 'quiz_users', userId);
  // undefined値を除去して安全にシリアライズ
  const sanitized = JSON.parse(JSON.stringify(progress));
  await setDoc(userDocRef, {
    progress: sanitized,
    updatedAt: serverTimestamp(),
  });
};

/**
 * クラウド（Firestore）から進捗データを取得
 */
export const fetchProgressFromCloud = async (userId: string): Promise<UserProgress | null> => {
  const { db } = getFirebaseServices();
  if (!db) return null;

  const userDocRef = doc(db, 'quiz_users', userId);
  const snapshot = await getDoc(userDocRef);
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return (data?.progress as UserProgress) || null;
};

/**
 * クラウド（Firestore）の変更をリアルタイム購読（別端末での中断・進捗更新を即座に反映）
 */
export const subscribeToCloudProgress = (
  userId: string,
  onUpdate: (cloudProgress: UserProgress) => void
): Unsubscribe => {
  const { db } = getFirebaseServices();
  if (!db) return () => {};

  const userDocRef = doc(db, 'quiz_users', userId);
  return onSnapshot(userDocRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data?.progress) {
        onUpdate(data.progress as UserProgress);
      }
    }
  }, (err) => {
    console.warn('Realtime progress subscription error:', err);
  });
};
