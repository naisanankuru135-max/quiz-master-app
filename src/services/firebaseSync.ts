import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
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
  Firestore, 
  serverTimestamp 
} from 'firebase/firestore';
import { UserProgress } from '../types/quiz';

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
  return onAuthStateChanged(auth, callback);
};

/**
 * ローカル進捗とクラウド進捗を賢くマージする
 */
export const mergeUserProgress = (local: UserProgress, cloud: UserProgress): UserProgress => {
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

  return {
    history: mergedHistory,
    bookmarks: mergedBookmarks,
    streak: {
      current: streakCurrent,
      lastActiveDate: lastActiveDate || new Date().toISOString().split('T')[0],
    },
    dailyGoal: local.dailyGoal || cloud.dailyGoal || 30,
    activityHistory: mergedActivityHistory,
    notificationTime: local.notificationTime || cloud.notificationTime || '20:00',
    notificationEnabled: local.notificationEnabled ?? cloud.notificationEnabled ?? false,
    activeSession: local.activeSession || cloud.activeSession || null,
  };
};

/**
 * クラウド（Firestore）に進捗データを保存
 */
export const saveProgressToCloud = async (userId: string, progress: UserProgress): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;

  const userDocRef = doc(db, 'quiz_users', userId);
  await setDoc(userDocRef, {
    progress,
    updatedAt: serverTimestamp(),
  }, { merge: true });
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
