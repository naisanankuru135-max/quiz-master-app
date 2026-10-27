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
  console.error('❌ GOOGLE_CLOUD_API_KEY が見つかりません');
  process.exit(1);
}

// 2. モジュールテスト
async function main() {
  console.log('🔍 Ecosia中継＆パーマリンク機能の総合検証を開始します...');

  // 仮想的なクイズデータ
  const testQuiz = {
    id: 'politics-001',
    category: '政治',
    sourceSection: '国会の内閣・行政制度',
    question: '日本国憲法下における衆議院の解散および内閣不信任決議に関する記述として最も適切なものはどれか。',
    coveredFactIds: ['POL-025', 'POL-030'],
    options: [
      { key: 'A', text: '衆議院で内閣不信任決議案が可決された場合、内閣は5日以内に総辞職しなければならない。' },
      { key: 'B', text: '衆議院の解散が行われた場合、解散の日から60日以内に総選挙を行わなければならない。' },
      { key: 'C', text: '衆議院で内閣不信任案が可決されたときは、10日以内に衆議院が解散されない限り、内閣は総辞職をしなければならない。' },
      { key: 'D', text: '参議院でも内閣不信任案を可決することができ、その効果は衆議院と同等である。' },
    ],
    correctAnswers: ['C'],
  };

  const userSelectedOriginal = ['B']; // 不正解を選んだ
  const permalinkUrl = `https://naisanankuru135-max.github.io/quiz-master-app/?q=1&userAns=B`;
  const shortPrompt = `${permalinkUrl} の【${testQuiz.category} 第1問】(Quiz#001)について、私の回答【B】の誤答理由と出題ファクトの内容をあわせて詳しく解説して`;

  console.log('📌 生成されたパーマリンクURL:', permalinkUrl);
  console.log('📝 生成された短縮プロンプト (文字数: ' + shortPrompt.length + '字):');
  console.log(shortPrompt);

  console.log('\n🤖 Google Cloud Agent Platform API (gemini-4-argon) に評価・模擬応答をリクエスト中...');
  const ai = new GoogleGenAI({ vertexai: true, apiKey });

  const evaluationPrompt = `
あなたは教育工学とAIクローラーの専門家です。
以下の仕様で構築した「スマホ向けEcosia AI中継システム」の妥当性を評価し、Ecosia AIがこのパーマリンクURLおよび短縮プロンプトを受け取った際に想定される応答シミュレーションを行ってください。

【入力された短縮プロンプト】:
"${shortPrompt}"

【対象パーマリンクページの掲載情報】:
- 問題ID: 【政治 第1問】 (Quiz#001)
- カテゴリ: 政治 / 国会の内閣・行政制度
- 対象ファクト:
  ・[POL-025] 衆議院で内閣不信任案が可決されたときは、10日以内に衆議院が解散されない限り、内閣は総辞職をしなければならない（憲法69条）。
  ・[POL-030] 衆議院解散の日から40日以内に総選挙を行い、選挙の日から30日以内に特別国会を召集する（憲法54条）。
- 選択肢: A〜D
- 正解: C
- ユーザーの解答: B（不正解）

【確認事項】:
1. プロンプト長（約120字）がスマホ版EcosiaのURL長制限（2KB）を安全にクリアできているか。
2. 問題番号（政治 第1問）とファクトID（POL-025, POL-030）の分離によって、混同が防止されているか。
3. 受験者の誤答「B」に対する解説として、POL-030（「60日」ではなく「40日以内」）に言及した指導ができるか。
`;

  const response = await ai.models.generateContent({
    model: 'gemini-4-argon',
    contents: evaluationPrompt,
  });

  console.log('\n================== gemini-4-argon の評価・シミュレーション ==================');
  console.log(response.text);
  console.log('===============================================================================\n');
}

main().catch(err => {
  console.error('エラー:', err);
  process.exit(1);
});
