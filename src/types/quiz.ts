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
}

export type QuizMode = 
  | 'daily30'      // 今日の30問
  | 'unattempted'  // 未踏ランダム
  | 'mockTest'     // 実力テスト
  | 'reviewWeak'   // 苦手克服
  | 'category'     // カテゴリ別
;
