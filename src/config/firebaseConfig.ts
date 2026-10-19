import { FirebaseConfig } from '../services/firebaseSync';

/**
 * アプリ組み込みのデフォルトFirebaseプロジェクト設定
 * 
 * あなたのFirebaseプロジェクト設定（apiKey, authDomain, projectId等）をここに設定すると、
 * アプリのすべての利用者が設定入力不要で、Googleログインボタンを押すだけで
 * このプロジェクトに自動同期できるようになります。
 */
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig | null = null;
