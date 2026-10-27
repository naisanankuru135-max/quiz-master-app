import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. .env からキー取得
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
  console.log('🚀 gemini-4-argon による「復習ゴースト問題（孤立ID）自動解消」改修を開始します...');

  // --- Task 1: storage.ts の改修 ---
  console.log('\n📝 [Task 1/3] src/utils/storage.ts に cleanOrphanProgress を実装中...');
  const storagePath = path.join(ROOT_DIR, 'src/utils/storage.ts');
  const storageCode = fs.readFileSync(storagePath, 'utf8');

  const promptStorage = `
あなたはTypeScriptのエキスパートです。
以下のファイルはクイズアプリの進捗保存ロジック（src/utils/storage.ts）です。

【課題】
問題データの再生成・改番に伴い、過去に解いた問題のIDが現在のクイズ一覧から消えてしまい、
spacedRepetition, history, bookmarks に孤立した旧ID（ゴーストID）が残り続ける問題が発生しています。

【要求】
以下の仕様を満たす関数 \`cleanOrphanProgress\` を追加し、既存のコードを維持した完全な TypeScript コードを出力してください：

1. export function cleanOrphanProgress(validQuizIds: string[]): { cleanedCount: number; progress: UserProgress }
   - validQuizIds（現行問題のID配列）を Set に変換。
   - spacedRepetition 内で validQuizIds に含まれないキーを削除。
   - history 内で validQuizIds に含まれないキーを削除。
   - bookmarks 内で validQuizIds に含まれないIDを除外。
   - 削除されたユニークな問題IDの合計数を cleanedCount とする。
   - cleanedCount > 0 の場合、saveProgress(progress) で保存する。
   - { cleanedCount, progress } を返す。
2. 既存の関数（loadProgress, saveProgress, recordAnswer, getTodayStudyCount など）のロジックやコメントを一切破壊・省略せず、完全なコードを出力してください。
3. コードブロック（\`\`\`typescript ... \`\`\`）のみを出力してください。説明文は不要です。

【現在の storage.ts】:
${storageCode}
`;

  const newStorageCodeRaw = await askArgon(promptStorage);
  const newStorageCode = cleanMarkdownCode(newStorageCodeRaw);
  if (newStorageCode.length > 2000 && newStorageCode.includes('cleanOrphanProgress')) {
    fs.writeFileSync(storagePath, newStorageCode, 'utf8');
    console.log('✓ src/utils/storage.ts を更新しました！');
  } else {
    throw new Error('Task 1 のコード生成が不正です。');
  }

  // --- Task 2: ReviewWorkspaceView.tsx の改修 ---
  console.log('\n📝 [Task 2/3] src/components/ReviewWorkspaceView.tsx を改修中...');
  const reviewPath = path.join(ROOT_DIR, 'src/components/ReviewWorkspaceView.tsx');
  const reviewCode = fs.readFileSync(reviewPath, 'utf8');

  const promptReview = `
あなたはReact + TypeScript + Tailwind CSSのエキスパートです。
以下のファイルは復習画面（src/components/ReviewWorkspaceView.tsx）です。

【課題】
現在の435問に存在しない旧問題IDが spacedRepetition に残っている場合、復習対象件数にカウントされてしまい、解けない問題が永遠に残る構造になっています。

【要求】
1. 復習対象の抽出（getStageGroups, allDueItems, sortedDueItems など）において、
   必ず「allQuizzes（または quizMap.has(item.quizId)）に実体が存在するアイテムのみ」を対象とするようフィルタリングを徹底してください。
2. もし allQuizzes に存在しない孤立IDが spacedRepetition に存在する場合（orphanCount > 0）：
   画面上部（または適切な場所）にスリムな案内バナーを表示し、
   「データ更新に伴う旧問題の復習データが \${orphanCount}件 あります [今すぐ整理する]」
   というボタンを配置してください。
   ボタンクリック時に、親から渡されたハンドラー、または onResetOrphans (クリーンアップ実行) を呼べるように props を拡張してください。
   ※ ReviewWorkspaceViewProps に \`onCleanOrphanData?: () => void\` を追加。
3. 既存の5ステージ表示、日付グルーピング、一括復習ボタン、スタイリングなどを一切破壊せず、完全な TypeScript/TSX コードを出力してください。
4. コードブロック（\`\`\`tsx ... \`\`\`）のみを出力してください。説明文は不要です。

【現在の ReviewWorkspaceView.tsx】:
${reviewCode}
`;

  const newReviewCodeRaw = await askArgon(promptReview);
  const newReviewCode = cleanMarkdownCode(newReviewCodeRaw);
  if (newReviewCode.length > 3000 && newReviewCode.includes('quizMap.has')) {
    fs.writeFileSync(reviewPath, newReviewCode, 'utf8');
    console.log('✓ src/components/ReviewWorkspaceView.tsx を更新しました！');
  } else {
    throw new Error('Task 2 のコード生成が不正です。');
  }

  console.log('\n🎉 gemini-4-argon による自動改修が完了しました！');
}

main().catch(err => {
  console.error('\n❌ エラーが発生しました:', err.message);
  process.exit(1);
});
