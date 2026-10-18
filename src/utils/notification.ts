// ブラウザ通知（Web Notification API）ヘルパー

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    alert('お使いのブラウザはWeb通知に対応していません。');
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

export function sendStudyReminder(message: string = '今日の30問に挑戦して、連続学習記録を伸ばしましょう！🔥'): void {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification('🧠 超難問クイズマスター', {
      body: message,
      icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>',
    });
  }
}
