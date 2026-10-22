// ブラウザ通知（Web Notification API）ヘルパー
// サーバーPushは使わず、アプリ起動中・復帰時にローカルで1日1回スケジュールする。

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendStudyReminder(
  message: string = '今日の30問に挑戦して、連続学習記録を伸ばしましょう！🔥'
): boolean {
  if (!('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const notification = new Notification('🧠 超難問クイズマスター', {
      body: message,
      tag: 'quiz-master-daily-reminder',
      icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>',
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    return true;
  } catch (error) {
    console.error('Failed to send study reminder', error);
    return false;
  }
}
