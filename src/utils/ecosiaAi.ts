import { QuizQuestion } from '../types/quiz';

/**
 * Ecosia AI Chat URLを生成
 */
export const getEcosiaAiUrl = (prompt: string): string => {
  return `https://www.ecosia.org/ai-chat?q=${encodeURIComponent(prompt)}`;
};

/**
 * シャッフル表示中の選択肢キーを、元データの選択肢キー（A〜D）に正規化してソートして返す
 */
export const normalizeSelectedOptions = (
  displayQuiz: QuizQuestion,
  userSelectedKeys: ('A' | 'B' | 'C' | 'D')[],
  originalQuiz: QuizQuestion
): ('A' | 'B' | 'C' | 'D')[] => {
  if (!userSelectedKeys || userSelectedKeys.length === 0) return [];

  const normalizedKeys = userSelectedKeys
    .map(selectedKey => {
      // 表示中のクイズから選択された選択肢のテキストを取得
      const selectedOption = displayQuiz.options.find(opt => opt.key === selectedKey);
      if (!selectedOption) return selectedKey;

      // 元のクイズデータから同じテキストを持つ選択肢を探す
      const originalOption = originalQuiz.options.find(opt => opt.text === selectedOption.text);
      return originalOption ? originalOption.key : selectedKey;
    })
    .filter((key, index, self) => self.indexOf(key) === index);

  return [...normalizedKeys].sort();
};

/**
 * クイズ個別ページのパーマリンクURLを生成
 */
export const getQuizPermalinkUrl = (
  quizSequentialIndex: number,
  originalUserAns?: ('A' | 'B' | 'C' | 'D')[]
): string => {
  let baseUrl = 'https://naisanankuru135-max.github.io/quiz-master-app/';
  if (typeof window !== 'undefined' && window.location) {
    // ローカル開発時や別ホストでも正しく動くよう、ただしEcosia側がクロールできるよう基本は現在のorigin+pathnameを使用
    // もしlocalhostの場合はGitHub Pagesの本番URLにフォールバックさせることでEcosiaのWeb参照を成立させる
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      baseUrl = `${window.location.origin}${window.location.pathname}`;
    }
  }

  // 末尾のスラッシュを正規化
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const params = new URLSearchParams();
  params.set('q', String(quizSequentialIndex));

  if (originalUserAns && originalUserAns.length > 0) {
    const sortedAns = [...originalUserAns].sort();
    params.set('userAns', sortedAns.join(','));
  }

  return `${cleanBaseUrl}?${params.toString()}`;
};

/**
 * Ecosia AIのチャットボックスに直接入る短いプロンプト（100〜150文字程度）を生成
 */
export const formatShortEcosiaPrompt = (
  quiz: QuizQuestion,
  quizSequentialIndex: number,
  categoryIndex: number,
  originalUserAns?: ('A' | 'B' | 'C' | 'D')[]
): string => {
  const permalinkUrl = getQuizPermalinkUrl(quizSequentialIndex, originalUserAns);
  const paddedSeq = String(quizSequentialIndex).padStart(3, '0');
  const sortedAns =
    originalUserAns && originalUserAns.length > 0 ? [...originalUserAns].sort() : [];

  if (sortedAns.length > 0) {
    return `${permalinkUrl} の【${quiz.category} 第${categoryIndex}問】(Quiz#${paddedSeq})について、私の回答【${sortedAns.join(', ')}】の誤答理由と出題ファクトの内容をあわせて詳しく解説して`;
  }

  return `${permalinkUrl} の【${quiz.category} 第${categoryIndex}問】(Quiz#${paddedSeq})について、正解の理由と出題ファクトの内容をあわせて詳しく解説して`;
};

/**
 * 短いパーマリンク付きプロンプトでEcosia AIを開き、クリップボードにもプロンプトを退避コピーする
 */
export const openEcosiaAiWithPermalink = async (
  quiz: QuizQuestion,
  quizSequentialIndex: number,
  categoryIndex: number,
  originalUserAns?: ('A' | 'B' | 'C' | 'D')[],
  fullPromptFallback?: string
): Promise<boolean> => {
  const shortPrompt = formatShortEcosiaPrompt(
    quiz,
    quizSequentialIndex,
    categoryIndex,
    originalUserAns
  );

  const textToCopy = fullPromptFallback || shortPrompt;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToCopy);
    }
  } catch (err) {
    console.warn('Clipboard write failed:', err);
  }

  const url = getEcosiaAiUrl(shortPrompt);
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
};

/**
 * クイズの問題データから、Ecosia AI用の深掘りプロンプトを構築（詳細版・後方互換＆クリップボード用）
 */
export const formatQuizPromptForEcosia = (
  quiz: QuizQuestion,
  userSelected?: ('A' | 'B' | 'C' | 'D')[]
): string => {
  const optionsText = quiz.options
    .map(opt => `  ${opt.key}: ${opt.text}`)
    .join('\n');

  const detailsText = (['A', 'B', 'C', 'D'] as const)
    .map(k => `  - 選択肢${k}: ${quiz.explanations.details[k]}`)
    .join('\n');

  // 回答者の選択記号を押した順ではなくアルファベット順（A, B, C, D）にソート
  const sortedSelected = userSelected && userSelected.length > 0
    ? [...userSelected].sort()
    : [];

  const userSelectionStr = sortedSelected.length > 0
    ? `■ 受験者の選択: 【 ${sortedSelected.join(', ')} 】\n`
    : '';

  const sortedCorrect = [...quiz.correctAnswers].sort();

  return `【ニュース検定・時事問題の学習相談】
以下のクイズについて、理解を深めるための詳しい解説をお願いします。

■ 分野・テーマ: ${quiz.category}（出典: ${quiz.sourceSection}）
■ 問題文:
${quiz.question}

■ 選択肢:
${optionsText}

■ 正解: 【 ${sortedCorrect.join(', ')} 】
${userSelectionStr}■ アプリ内の解説:
・全体概要: ${quiz.explanations.overall}
${detailsText}

【質問と深掘りのリクエスト】
1. この問題のテーマがニュースや時事で注目されている歴史的背景や社会的な重要性を教えてください。
2. 不正解の選択肢について、なぜそれが引っかけとして設定されているのか、正しい事実と対比して詳しく解説してください。
3. 初学者でもスッキリ理解できるように、要点を分かりやすく整理してください。`;
};

/**
 * プロンプトをクリップボードにコピーした上で、Ecosia AIを別タブで開く（後方互換用）
 */
export const openEcosiaAiWithPrompt = async (prompt: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(prompt);
    }
  } catch (err) {
    // クリップボードが使えない環境でもURL遷移は実行する
    console.warn('Clipboard write failed:', err);
  }

  const url = getEcosiaAiUrl(prompt);
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
};