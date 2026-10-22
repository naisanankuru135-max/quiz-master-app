import { UserProgress, AnswerRecord, ResumeSession, QuizMode, MockHistoryRecord } from '../types/quiz';

const STORAGE_KEY = 'quiz_master_progress_v1';

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return toLocalDateString(new Date());
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function getDefaultProgress(): UserProgress {
  return {
    history: {},
    bookmarks: [],
    streak: {
      current: 0,
      lastActiveDate: '',
    },
    dailyGoal: 30,
    activityHistory: [
      { date: getTodayString(), count: 0, correctCount: 0 }
    ],
    activeSession: null,
    notificationTime: '20:00',
    notificationEnabled: false,
    lastNotificationDate: '',
    dailyCompletedDate: '',
    dailyCompletedQuizIds: [],
    spacedRepetition: {},
    dailyLogs: {},
    mockHistory: [],
    shuffleOptions: true,
    unlockedAchievements: [],
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const data = JSON.parse(raw) as UserProgress;

    if (!data.spacedRepetition) data.spacedRepetition = {};
    if (!data.dailyLogs) data.dailyLogs = {};
    if (!data.mockHistory) data.mockHistory = [];
    if (data.shuffleOptions === undefined) data.shuffleOptions = true;
    if (!data.unlockedAchievements) data.unlockedAchievements = [];
    if (data.lastNotificationDate === undefined) data.lastNotificationDate = '';
    if (data.dailyCompletedDate === undefined) data.dailyCompletedDate = '';
    if (!data.dailyCompletedQuizIds) data.dailyCompletedQuizIds = [];

    // 既存の履歴データ（history）からの初期マイグレーション
    // dailyLogs が空の「初回だけ」実行する。spacedRepetition が空でも、
    // すでに日別ログがある場合は再マイグレーションしない（重複防止）。
    if (
      Object.keys(data.spacedRepetition).length === 0 &&
      Object.keys(data.dailyLogs).length === 0 &&
      Object.keys(data.history).length > 0
    ) {
      Object.values(data.history).forEach(h => {
        const answeredAt = new Date(h.answeredAt);
        // UTC の日付文字列ではなく、ユーザーのローカル日付で移行する
        const ansDate = Number.isNaN(answeredAt.getTime())
          ? getTodayString()
          : toLocalDateString(answeredAt);
        data.spacedRepetition[h.quizId] = {
          quizId: h.quizId,
          firstAnsweredDate: ansDate,
          currentStage: 1,
          lastAnsweredDate: ansDate,
          nextReviewDate: addDays(ansDate, 1),
          stageHistory: [{ stage: 0, answeredDate: ansDate, isFullyCorrect: h.isFullyCorrect }]
        };
        if (!data.dailyLogs[ansDate]) data.dailyLogs[ansDate] = [];
        data.dailyLogs[ansDate].push({
          quizId: h.quizId,
          category: h.category,
          isFullyCorrect: h.isFullyCorrect,
          answeredAt: h.answeredAt,
          stage: 'initial'
        });
      });
    }

    // ストリークの更新チェック（昨日学習していれば維持、2日以上空いていればリセット）
    const today = getTodayString();
    if (data.streak.lastActiveDate && data.streak.lastActiveDate !== today) {
      const last = new Date(data.streak.lastActiveDate);
      const cur = new Date(today);
      const diffDays = Math.floor((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        data.streak.current = 0; // 連続日数途切れ
        saveProgress(data); // 永続化
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

export function isAnswerFullyCorrect(
  userAnswers: ('A' | 'B' | 'C' | 'D')[],
  correctAnswers: ('A' | 'B' | 'C' | 'D')[]
): boolean {
  const sortedUser = [...userAnswers].sort();
  const sortedCorrect = [...correctAnswers].sort();
  return (
    sortedUser.length === sortedCorrect.length &&
    sortedUser.every((val, idx) => val === sortedCorrect[idx])
  );
}

export function recordAnswer(
  quizId: string,
  category: string,
  userAnswers: ('A' | 'B' | 'C' | 'D')[],
  correctAnswers: ('A' | 'B' | 'C' | 'D')[],
  mode?: QuizMode,
  persist = true
): UserProgress {
  const progress = loadProgress();
  const today = getTodayString();

  const isFullyCorrect = isAnswerFullyCorrect(userAnswers, correctAnswers);

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

  // 忘却曲線の更新（エビングハウスの忘却曲線レコメンド）
  if (!progress.spacedRepetition) progress.spacedRepetition = {};
  const srItem = progress.spacedRepetition[quizId];
  let currentLogStage: number | 'completed' | 'initial' = 'initial';

  if (!srItem) {
    // 初回解答：ステージ1（1日後待ち）に登録
    progress.spacedRepetition[quizId] = {
      quizId,
      firstAnsweredDate: today,
      currentStage: 1,
      lastAnsweredDate: today,
      nextReviewDate: addDays(today, 1),
      stageHistory: [
        { stage: 0, answeredDate: today, isFullyCorrect }
      ]
    };
    currentLogStage = 'initial';
  } else if (srItem.currentStage === 'completed') {
    // 殿堂入り後でも、誤答したら stage1 に戻して翌日やり直す
    currentLogStage = 'completed';
    if (!isFullyCorrect) {
      srItem.currentStage = 1;
      srItem.lastAnsweredDate = today;
      srItem.nextReviewDate = addDays(today, 1);
      srItem.stageHistory.push({
        stage: 5,
        answeredDate: today,
        isFullyCorrect
      });
    }
  } else {
    // 復習解答：期日を迎えている場合のみステージを進める
    // （早期の解き直しでは昇格させない＝同じ問題を連続で解いても完全習得にならない）
    const prevStage = srItem.currentStage;
    currentLogStage = prevStage;
    const isDue = !srItem.nextReviewDate || srItem.nextReviewDate <= today;

    if (!isDue) {
      // 期日前の早期解答：ステージ・次回期日は維持し、履歴だけ残す
      srItem.lastAnsweredDate = today;
      srItem.stageHistory.push({
        stage: prevStage,
        answeredDate: today,
        isFullyCorrect
      });
    } else {
      // 完全正解時のみ忘却曲線ステージが進級。誤答・部分正解時は1段降格（最低ステージ1）し、翌日(+1日)に必ず再出題！
      let nextStage: 1 | 2 | 3 | 4 | 5 | 'completed' = 'completed';
      let addedDays = 0;

      if (isFullyCorrect) {
        if (prevStage === 1) {
          // 1日後正解 -> 3日後へ (+2日)
          nextStage = 2;
          addedDays = 2;
        } else if (prevStage === 2) {
          // 3日後正解 -> 1週間後へ (+4日)
          nextStage = 3;
          addedDays = 4;
        } else if (prevStage === 3) {
          // 1週間後正解 -> 2週間後へ (+7日)
          nextStage = 4;
          addedDays = 7;
        } else if (prevStage === 4) {
          // 2週間後正解 -> 1ヶ月後へ (+16日)
          nextStage = 5;
          addedDays = 16;
        } else if (prevStage === 5) {
          // 1ヶ月後正解 -> 完全習得（殿堂入り）へ
          nextStage = 'completed';
          addedDays = 0;
        }
      } else {
        // 不正解・部分正解：1段階降格（最低ステージ1）し、翌日(+1日後)にやり直す
        nextStage = prevStage > 1 ? ((prevStage - 1) as 1 | 2 | 3 | 4) : 1;
        addedDays = 1;
      }

      srItem.currentStage = nextStage;
      srItem.lastAnsweredDate = today;
      srItem.nextReviewDate = nextStage === 'completed' ? '' : addDays(today, addedDays);
      srItem.stageHistory.push({
        stage: prevStage,
        answeredDate: today,
        isFullyCorrect
      });
    }
  }

  // 日別解答ログの記録（全問題・全履歴）
  if (!progress.dailyLogs) progress.dailyLogs = {};
  if (!progress.dailyLogs[today]) progress.dailyLogs[today] = [];
  progress.dailyLogs[today].push({
    quizId,
    category,
    isFullyCorrect,
    answeredAt: record.answeredAt,
    stage: currentLogStage,
    mode
  });

  // ストリーク更新
  if (!progress.streak.lastActiveDate) {
    // 初回解答時
    progress.streak.current = 1;
    progress.streak.lastActiveDate = today;
  } else if (progress.streak.lastActiveDate !== today) {
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

  // 本日のアクティビティ履歴更新（模試は学習目標・学習推移から除外）
  if (mode !== 'mockTest') {
    let todayActivity = progress.activityHistory.find(a => a.date === today);
    if (!todayActivity) {
      todayActivity = { date: today, count: 0, correctCount: 0 };
      progress.activityHistory.push(todayActivity);
    }
    todayActivity.count += 1;
    if (isFullyCorrect) {
      todayActivity.correctCount += 1;
    }
  }

  if (persist) saveProgress(progress);
  return progress;
}

/**
 * 本日の学習数（模試を除く・問題IDでユニーク）
 * 同じ問題を何度解き直しても1問としてカウントする
 */
export function getTodayStudyCount(progress: UserProgress): number {
  const today = getTodayString();
  const logs = progress.dailyLogs?.[today] || [];
  const ids = new Set<string>();
  for (const log of logs) {
    if (log.mode === 'mockTest') continue;
    ids.add(log.quizId);
  }
  return ids.size;
}

/** 本日の模試解答数（デイリー目標とは別カウント・問題IDでユニーク） */
export function getTodayMockCount(progress: UserProgress): number {
  const today = getTodayString();
  const ids = new Set<string>();
  for (const log of progress.dailyLogs?.[today] || []) {
    if (log.mode === 'mockTest') ids.add(log.quizId);
  }
  return ids.size;
}

/** 模試結果を履歴に追加（新しい順・最大50件） */
export function addMockHistory(record: MockHistoryRecord): UserProgress {
  const progress = loadProgress();
  const history = progress.mockHistory || [];
  if (!history.some(item => item.id === record.id)) {
    progress.mockHistory = [record, ...history].slice(0, 50);
  }
  saveProgress(progress);
  return progress;
}

export function resetSpacedRepetition(quizId: string): UserProgress {
  const progress = loadProgress();
  if (progress.spacedRepetition && progress.spacedRepetition[quizId]) {
    delete progress.spacedRepetition[quizId];
  }
  if (progress.history && progress.history[quizId]) {
    delete progress.history[quizId];
  }
  saveProgress(progress);
  return progress;
}

export function saveActiveSession(
  session: ResumeSession,
  base?: UserProgress,
  persist = true
): UserProgress {
  const progress = base || loadProgress();
  progress.activeSession = session;
  progress.sessionUpdatedAt = new Date().toISOString();
  if (persist) saveProgress(progress);
  return progress;
}

export function clearActiveSession(base?: UserProgress, persist = true): UserProgress {
  const progress = base || loadProgress();
  progress.activeSession = null;
  progress.sessionUpdatedAt = new Date().toISOString();
  if (persist) saveProgress(progress);
  return progress;
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

export function setShuffleOptions(enabled: boolean): UserProgress {
  const progress = loadProgress();
  progress.shuffleOptions = enabled;
  saveProgress(progress);
  return progress;
}

export function resetAllProgress(): UserProgress {
  const def = getDefaultProgress();
  saveProgress(def);
  return def;
}
