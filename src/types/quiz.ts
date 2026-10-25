export interface QuizOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  sourceFile: string;
  sourceSection: string;
  question: string;
  options: QuizOption[];
  correctAnswers: ('A' | 'B' | 'C' | 'D')[];
  explanations: {
    overall: string;
    details: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
  };
}

export interface AnswerRecord {
  quizId: string;
  category: string;
  userAnswers: ('A' | 'B' | 'C' | 'D')[];
  correctAnswers: ('A' | 'B' | 'C' | 'D')[];
  isFullyCorrect: boolean;
  score: number; // 0 to 1
  answeredAt: string; // ISO string
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  count: number;
  correctCount: number;
}

export interface ResumeSession {
  mode: QuizMode;
  category?: string;
  quizIds: string[];
  currentIndex: number;
  answers: Record<string, ('A' | 'B' | 'C' | 'D')[]>;
  timestamp: string;
  /** 模試の終了時刻（epoch ms）。再開・リロードしても残り時間を維持する */
  mockDeadline?: number;
  /** 模試の制限時間（秒） */
  mockDurationSeconds?: number;
}

export interface SpacedRepetitionItem {
  quizId: string;
  firstAnsweredDate: string; // YYYY-MM-DD
  currentStage: 1 | 2 | 3 | 4 | 5 | 'completed'; // 1: 1日後, 2: 3日後, 3: 1週後, 4: 2週後, 5: 1ヶ月後, completed: 完全習得
  lastAnsweredDate: string;  // YYYY-MM-DD（直近で解いた日）
  nextReviewDate: string;    // YYYY-MM-DD（この日以降に出現）
  stageHistory: Array<{
    stage: number;
    answeredDate: string;
    isFullyCorrect: boolean;
  }>;
}

export interface DailyLogRecord {
  quizId: string;
  category: string;
  isFullyCorrect: boolean;
  answeredAt: string; // ISO string
  stage?: number | 'completed' | 'initial';
  mode?: QuizMode; // 目標カウントから模試を除外するために使用
}

export interface MockHistoryRecord {
  id: string;
  completedAt: string; // ISO string
  date: string; // YYYY-MM-DD
  score: number;
  total: number;
  accuracy: number; // 0-100
  elapsedSeconds: number;
  passed: boolean;
  categoryStats: Record<string, { correct: number; total: number }>;
  incorrectIds: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // 絵文字
  category: 'streak' | 'count' | 'mastery' | 'special';
  target: number;
}

export interface UserProgress {
  history: Record<string, AnswerRecord>; // quizId -> last record
  bookmarks: string[]; // quizId list
  streak: {
    current: number;
    lastActiveDate: string; // YYYY-MM-DD
  };
  dailyGoal: number; // default 30
  activityHistory: DayActivity[];
  activeSession: ResumeSession | null;
  sessionUpdatedAt?: string; // セッションの開始/更新/破棄日時（端末間同期用）
  notificationTime: string; // e.g. "20:00"
  notificationEnabled: boolean;
  /** 最後に学習リマインダーを送った日（YYYY-MM-DD）。同日の重複通知を防ぐ */
  lastNotificationDate?: string;
  /** 今日の30問を完了した日（YYYY-MM-DD） */
  dailyCompletedDate?: string;
  /** 完了した今日の30問のID（同じ30問を復習として再演習するため） */
  dailyCompletedQuizIds?: string[];
  spacedRepetition: Record<string, SpacedRepetitionItem>; // 忘却曲線復習ステータス
  dailyLogs: Record<string, DailyLogRecord[]>; // 日別解答履歴 (YYYY-MM-DD -> records)
  mockHistory?: MockHistoryRecord[]; // 本番模試の結果履歴（新しい順）
  shuffleOptions?: boolean; // 選択肢のシャッフル設定（デフォルト true）
  unlockedAchievements?: string[]; // 解除済みアチーブメントID配列
}

export interface FactItem {
  id: string;
  category: string;
  sourceFile: string;
  section: string;
  factText: string;
  charCount?: number;
  /** ファクト単体の話題ラベル（例: 年収の壁、国民年金の被保険者） */
  topic?: string;
  /** 元MDの該当行テキスト（監査・再生成用） */
  sourceText?: string;
  /** 元MDの行番号（1始まり） */
  sourceLines?: number[];
}

export type QuizMode = 
  | 'daily30'          // 今日の30問
  | 'unattempted'      // 未踏ランダム
  | 'mockTest'         // 実力テスト
  | 'reviewWeak'       // 苦手克服
  | 'category'         // カテゴリ別
  | 'spacedRepetition' // 忘却曲線復習
  | 'dailyHistory'     // 日別履歴の再演習
  | 'dictionarySearch' // 辞書からの演習
  | 'bookmark'         // ブックマーク演習
;
