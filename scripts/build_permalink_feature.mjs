import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// .env から APIキー取得
const envPath = path.join(ROOT_DIR, '.env');
let apiKey = '';
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('GOOGLE_CLOUD_API_KEY=')) {
      apiKey = trimmed.slice('GOOGLE_CLOUD_API_KEY='.length).trim();
      if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
        apiKey = apiKey.slice(1, -1);
      }
      break;
    }
  }
}

if (!apiKey) {
  console.error('❌ GOOGLE_CLOUD_API_KEY が見つかりません。');
  process.exit(1);
}

const ai = new GoogleGenAI({
  vertexai: true,
  apiKey: apiKey,
});

async function askArgon(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-4-argon',
    contents: prompt,
  });
  return response.text;
}

function cleanMarkdownCode(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```tsx') || cleaned.startsWith('```typescript') || cleaned.startsWith('```javascript') || cleaned.startsWith('```ts') || cleaned.startsWith('```js')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n```$/, '');
  }
  return cleaned;
}

async function main() {
  console.log('🚀 gemini-4-argon による「個別パーマリンク＆Ecosia連携強化」のコード執筆を開始します...');

  // --- Task 1: src/utils/ecosiaAi.ts の改修 ---
  console.log('\n📝 [Task 1/2] src/utils/ecosiaAi.ts を執筆中...');
  const currentEcosiaPath = path.join(ROOT_DIR, 'src/utils/ecosiaAi.ts');
  const currentEcosiaCode = fs.readFileSync(currentEcosiaPath, 'utf8');

  const promptEcosia = `
あなたはTypeScriptのエキスパートです。
以下のファイルは Ecosia AI 連携ロジック（src/utils/ecosiaAi.ts）です。

【要件】
スマホのURL長さ制限（2,000文字）を回避し、Ecosia AIのチャットボックスに直接プロンプトを入力させるため、
長大なプロンプトを直接URLに乗せるのではなく、「クイズ個別ページの短いURL（パーマリンク）」をEcosiaに渡す新しい方式を実装してください。
また、画面上で選択肢がシャッフルされていても、ユーザーが選んだ選択肢が元データの選択肢と矛盾しないよう、元データのキー（A, B, C, D）に正規化する関数も実装してください。

【具体的な追加・改修内容】
1. \`normalizeSelectedOptions(displayQuiz: QuizQuestion, userSelectedKeys: ('A' | 'B' | 'C' | 'D')[], originalQuiz: QuizQuestion): ('A' | 'B' | 'C' | 'D')[]\`
   - displayQuiz（シャッフル表示中の問題）で選ばれたキーの選択肢テキストを取得。
   - originalQuiz（元の問題）の中から同じテキストを持つ選択肢を探し、そのオリジナルの key（A〜D）を返す。
   - ソートして返す。
2. \`getQuizPermalinkUrl(quizSequentialIndex: number, originalUserAns?: ('A' | 'B' | 'C' | 'D')[]): string\`
   - GitHub PagesのベースURL（通常は window.location.origin + window.location.pathname、または https://naisanankuru135-max.github.io/quiz-master-app/）を基準にする。
   - URLクエリパラメータ: \`?q=\${quizSequentialIndex}\` (通し番号 1〜435)
   - もし originalUserAns があれば \`&userAns=\${originalUserAns.join(',')}\` を付加。
3. \`formatShortEcosiaPrompt(quiz: QuizQuestion, quizSequentialIndex: number, categoryIndex: number, originalUserAns?: ('A' | 'B' | 'C' | 'D')[]): string\`
   - 短いパーマリンクURLを取得。
   - プロンプト文例:
     \`\${permalinkUrl} の【\${quiz.category} 第\${categoryIndex}問】(Quiz#\${String(quizSequentialIndex).padStart(3, '0')})について、私の回答【\${originalUserAns.join(', ')}】の誤答理由と出題ファクトの内容をあわせて詳しく解説して\`
     ※originalUserAnsがない場合は「について、正解の理由と出題ファクトの内容をあわせて詳しく解説して」
   - 長さは100〜150文字程度。
4. \`openEcosiaAiWithPermalink(quiz: QuizQuestion, quizSequentialIndex: number, categoryIndex: number, originalUserAns?: ('A' | 'B' | 'C' | 'D')[], fullPromptFallback?: string): Promise<boolean>\`
   - 短いプロンプトで Ecosia AI URL (\`https://www.ecosia.org/ai-chat?q=\${encodeURIComponent(shortPrompt)}\`) を生成。
   - 念のため fullPromptFallback（詳細プロンプト）または短いプロンプトをクリップボードにコピー（非同期エラーはキャッチ）。
   - window.open でEcosiaを開く。
5. 既存の関数（getEcosiaAiUrl, formatQuizPromptForEcosia, openEcosiaAiWithPrompt）も後方互換性のために残してください。
6. コードブロック（\`\`\`typescript ... \`\`\`）のみを出力してください。

【現在の ecosiaAi.ts】:
${currentEcosiaCode}
`;

  const newEcosiaCodeRaw = await askArgon(promptEcosia);
  const newEcosiaCode = cleanMarkdownCode(newEcosiaCodeRaw);
  if (newEcosiaCode.length > 1000 && newEcosiaCode.includes('normalizeSelectedOptions')) {
    fs.writeFileSync(currentEcosiaPath, newEcosiaCode, 'utf8');
    console.log('✓ src/utils/ecosiaAi.ts を更新しました！');
  } else {
    throw new Error('Task 1 の生成に失敗しました。');
  }

  // --- Task 2: src/components/QuizPermalinkView.tsx の新規作成 ---
  console.log('\n📝 [Task 2/2] src/components/QuizPermalinkView.tsx を新規作成中...');
  const permalinkViewPath = path.join(ROOT_DIR, 'src/components/QuizPermalinkView.tsx');

  const promptView = `
あなたはReact + TypeScript + Tailwind CSSのフロントエンドエキスパートです。
URLに \`?q=1&userAns=A\` などのクイズパーマリンクが指定された際に表示する、
個別クイズ閲覧コンポーネント（src/components/QuizPermalinkView.tsx）を作成してください。

【背景と課題】
Ecosia AIのクローラーや人間がこのページを見た時に、問題番号とファクトIDが混同せず、
かつ出題されたファクト（論点）の「内容（factText）」まで明快に把握できるようにしたい。

【要件・仕様】
1. Props:
   - \`quiz: QuizQuestion\` (表示対象の問題)
   - \`quizSequentialNumber: number\` (全体通し番号、例: 1)
   - \`categoryQuestionNumber: number\` (分野内番号、例: 1)
   - \`userAnswers?: ('A' | 'B' | 'C' | 'D')[]\` (URLから渡された回答、例: ['A'])
   - \`factMap: Record<string, { factText: string; section?: string }>\` (ファクトIDからfactTextを引く辞書)
   - \`onGoToApp: () => void\` (「アプリでクイズを解く」ボタン押下時のコールバック)
2. デザイン（Tailwind CSSでモダンかつ美しく）:
   - ヘッダー情報（混同防止の構造分離型）:
     - 📌 問題番号: \`【\${quiz.category} 第\${categoryQuestionNumber}問】\` (通し番号: \`Quiz#\${String(quizSequentialNumber).padStart(3, '0')}\`)
     - 🏷️ カテゴリ・セクション: \`\${quiz.category} ／ \${quiz.sourceSection || ''}\`
     - 🎯 出題ファクト（論点）セクション:
       - quiz.coveredFactIds の各IDについて、factMapから factText を取得し、リスト表示：
         \`• [\${factId}] \${factText}\`
       - バッジと背景色で、問題IDとは明確に異なるデザインにする。
     - 👤 受験者の解答（userAnswersが存在する場合）:
       - ユーザーの解答記号、正解/不正解判定、正解との対比を表示。
   - クイズ本体:
     - 📝 問題文
     - 🔘 選択肢一覧 (A〜D)
       - 正解の選択肢には緑色のチェック・正解バッジ
       - ユーザーが選んで間違えた選択肢には赤色の選択バッジ
     - 💡 公式解説:
       - 全体概要: quiz.explanations.overall
       - 各選択肢の詳細解説: A〜D
   - アクション:
     - 「🚀 クイズマスターで他の問題を解く」ボタン（onGoToAppを呼ぶ）
     - 「🌿 Ecosia AIでこの問題を深掘り質問する」ボタン
3. Lucide React のアイコン（CheckCircle2, XCircle, BookOpen, ExternalLink, HelpCircle, ArrowLeft など）を効果的に使用。
4. ダークモード対応（dark:クラス）。
5. 完全な TypeScript/TSX コードをコードブロック（\`\`\`tsx ... \`\`\`）のみで出力してください。
`;

  const newViewCodeRaw = await askArgon(promptView);
  const newViewCode = cleanMarkdownCode(newViewCodeRaw);
  if (newViewCode.length > 2000 && newViewCode.includes('QuizPermalinkView')) {
    fs.writeFileSync(permalinkViewPath, newViewCode, 'utf8');
    console.log('✓ src/components/QuizPermalinkView.tsx を作成しました！');
  } else {
    throw new Error('Task 2 の生成に失敗しました。');
  }

  console.log('\n🎉 gemini-4-argon によるコード執筆が完了しました！');
}

main().catch(err => {
  console.error('\n❌ エラー:', err.message);
  process.exit(1);
});
