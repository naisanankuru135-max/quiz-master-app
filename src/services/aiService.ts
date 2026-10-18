// BYOK (Bring Your Own Key) 方式の Gemini API 連携サービス
// ユーザーのAPIキーはブラウザのLocalStorageにのみ保存され、管理者や外部サーバーには一切送信されません。

const STORAGE_KEY = 'quiz_user_gemini_api_key';
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  quizContextId?: string;
}

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch (e) {
    console.error('Failed to save API key:', e);
  }
}

export function removeApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to remove API key:', e);
  }
}

export async function askGemini(params: {
  apiKey: string;
  prompt: string;
  quizContext?: {
    id: string;
    question: string;
    category: string;
    sourceSection: string;
    options: { key: string; text: string }[];
    correctAnswers: string[];
    explanations: { overall: string; details: Record<string, string> };
  };
  chatHistory?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}): Promise<string> {
  const { apiKey, prompt, quizContext, chatHistory = [] } = params;

  if (!apiKey) {
    throw new Error('Gemini APIキーが設定されていません。右上の設定からAPIキーを入力してください。');
  }

  let systemInstructionText = `
あなたは「超難問クイズマスター」の専任AI学習チューターです。
ユーザーは政治・経済・社会保障・時事問題などの高度な資格試験・検定に向けた学習を行っています。
回答にあたっては、以下のガイドラインを徹底してください：
1. 提供されたクイズデータや出題ソース（ニュース検定政治・経済等）の公式記載を最優先の根拠として回答してください。
2. 背景となる法律の趣旨、歴史的経緯、関連する制度や国際情勢、最新のニュース動向と結びつけて、論理的かつ分かりやすく深掘り解説してください。
3. 選択肢のディストラクター（引っかけ）の意図や、なぜその選択肢が誤りなのかの微妙なニュアンスも丁寧に解き明かしてください。
4. Markdown形式で見出し、箇条書き、強調を効果的に用いて構造化された読みやすい文章で回答してください。
`;

  if (quizContext) {
    systemInstructionText += `\n【現在ユーザーが解いている問題のコンテキスト】
- 問題ID: ${quizContext.id} (${quizContext.category} / ${quizContext.sourceSection})
- 問題文: ${quizContext.question}
- 選択肢:
${quizContext.options.map(o => `  ${o.key}: ${o.text}`).join('\n')}
- 正解: ${quizContext.correctAnswers.join(', ')}
- 総合解説: ${quizContext.explanations.overall}
- 各選択肢の解説:
${Object.entries(quizContext.explanations.details).map(([k, v]) => `  ${k}: ${v}`).join('\n')}
`;
  }

  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  // 過去のチャット履歴を含める
  if (chatHistory.length > 0) {
    contents.push(...chatHistory);
  }

  // 今回のユーザープロンプト
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const requestBody = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    },
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048,
    }
  };

  let lastError: Error | null = null;

  for (const model of CANDIDATE_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error?.message || `HTTPエラー ${response.status}: ${response.statusText}`;
        // モデル利用不可エラーや404等の場合は次のモデルを試行
        if (response.status === 404 || message.includes('no longer available') || message.includes('not found')) {
          console.warn(`Model ${model} unavailable, trying next candidate...`);
          lastError = new Error(`Gemini API呼び出しエラー (${model}): ${message}`);
          continue;
        }
        throw new Error(`Gemini API呼び出しエラー: ${message}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        throw new Error('AIからの応答を正常に受信できませんでした。');
      }

      return candidate.content.parts[0].text;
    } catch (err: any) {
      if (err.message?.includes('no longer available') || err.message?.includes('404')) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('利用可能なGeminiモデルが見つかりませんでした。');
}
