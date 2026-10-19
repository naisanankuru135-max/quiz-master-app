import { QuizQuestion } from '../types/quiz';

/**
 * Ecosia AI Chat URLを生成
 */
export const getEcosiaAiUrl = (prompt: string): string => {
  return `https://www.ecosia.org/ai-chat?q=${encodeURIComponent(prompt)}`;
};

/**
 * クイズの問題データから、Ecosia AI用の深掘りプロンプトを構築
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
 * プロンプトをクリップボードにコピーした上で、Ecosia AIを別タブで開く
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
