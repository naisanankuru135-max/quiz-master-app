import { UserProgress, AnswerRecord, ResumeSession } from '../types/quiz';

const STORAGE_KEY = 'quiz_master_progress_v1';

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultProgress(): UserProgress {
  return {
    history: {},
    bookmarks: [],
    streak: {
      current: 1,
      lastActiveDate: getTodayString(),
    },
    dailyGoal: 30,
    activityHistory: [
      { date: getTodayString(), count: 0, correctCount: 0 }
    ],
    activeSession: null,
    notificationTime: '20:00',
    notificationEnabled: false,
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const data = JSON.parse(raw) as UserProgress;

    // ストリークの更新チェック（昨日学習していれば維持、2日以上空いていればリセット）
    const today = getTodayString();
    if (data.streak.lastActiveDate !== today) {
      const last = new Date(data.streak.lastActiveDate);
      const cur = new Date(today);
      const diffDays = Math.floor((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        data.streak.current = 0; // 連続日数途切れ
      }
    }
    return data;
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function recordAnswer(
  quizId: string,
  category: string,
  userAnswers: ('A' | 'B' | 'C' | 'D')[],
  correctAnswers: ('A' | 'B' | 'C' | 'D')[]
): UserProgress {
  const progress = loadProgress();
  const today = getTodayString();

  // 完全一致判定
  const sortedUser = [...userAnswers].sort();
  const sortedCorrect = [...correctAnswers].sort();
  const isFullyCorrect = 
    sortedUser.length === sortedCorrect.length &&
    sortedUser.every((val, idx) => val === sortedCorrect[idx]);

  // スコア計算（部分点: 正しい選択肢を当てた割合 - 誤答を選んだペナルティ）
  const correctHits = userAnswers.filter(a => correctAnswers.includes(a)).length;
  const incorrectHits = userAnswers.filter(a => !correctAnswers.includes(a)).length;
  const rawScore = (correctHits - incorrectHits) / correctAnswers.length;
  const score = Math.max(0, Math.min(1, rawScore));

  const record: AnswerRecord = {
    quizId,
    category,
    userAnswers,
    correctAnswers,
    isFullyCorrect,
    score,
    answeredAt: new Date().toISOString(),
  };

  progress.history[quizId] = record;

  // ストリーク更新
  if (progress.streak.lastActiveDate !== today) {
    const last = new Date(progress.streak.lastActiveDate);
    const cur = new Date(today);
    const diffDays = Math.floor((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      progress.streak.current += 1;
    } else if (diffDays > 1) {
      progress.streak.current = 1;
    }
    progress.streak.lastActiveDate = today;
  }

  // 本日のアクティビティ履歴更新
  let todayActivity = progress.activityHistory.find(a => a.date === today);
  if (!todayActivity) {
    todayActivity = { date: today, count: 0, correctCount: 0 };
    progress.activityHistory.push(todayActivity);
  }
  todayActivity.count += 1;
  if (isFullyCorrect) {
    todayActivity.correctCount += 1;
  }

  saveProgress(progress);
  return progress;
}

export function saveActiveSession(session: ResumeSession): void {
  const progress = loadProgress();
  progress.activeSession = session;
  saveProgress(progress);
}

export function clearActiveSession(): void {
  const progress = loadProgress();
  progress.activeSession = null;
  saveProgress(progress);
}

export function toggleBookmark(quizId: string): boolean {
  const progress = loadProgress();
  const idx = progress.bookmarks.indexOf(quizId);
  let isBookmarked = false;
  if (idx >= 0) {
    progress.bookmarks.splice(idx, 1);
  } else {
    progress.bookmarks.push(quizId);
    isBookmarked = true;
  }
  saveProgress(progress);
  return isBookmarked;
}

export function exportProgressJson(): string {
  const progress = loadProgress();
  return JSON.stringify(progress, null, 2);
}

export function importProgressJson(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr) as UserProgress;
    if (data && typeof data === 'object' && data.history) {
      saveProgress(data);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to import progress JSON', e);
    return false;
  }
}

export function resetAllProgress(): UserProgress {
  const def = getDefaultProgress();
  saveProgress(def);
  return def;
}
