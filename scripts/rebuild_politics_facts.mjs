import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. 環境変数読み込み
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

const ai = new GoogleGenAI({ vertexai: true, apiKey });
const MODEL_NAME = 'gemini-3.8-flash';

// 2. ソース読み込みとセクション分割
const sourcePath = path.join(ROOT_DIR, 'sources/ニュース検定　政治.md');
const rawText = fs.readFileSync(sourcePath, 'utf8');

// ## でセクション分割
const rawSections = rawText.split(/^##\s+/m);
const sections = [];

for (const sec of rawSections) {
  const trimmed = sec.trim();
  if (!trimmed || trimmed === 'ニュース検定　政治') continue;
  const firstLineEnd = trimmed.indexOf('\n');
  const sectionTitle = firstLineEnd > 0 ? trimmed.slice(0, firstLineEnd).trim() : trimmed;
  const sectionContent = firstLineEnd > 0 ? trimmed.slice(firstLineEnd).trim() : '';
  
  if (sectionContent) {
    sections.push({ title: sectionTitle, content: sectionContent });
  }
}

console.log(`📋 政治ソース解析完了: 全 ${sections.length} セクション`);

// リトライ付きAPI呼び出し
async function callWithRetry(prompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      return res.text ? JSON.parse(res.text.trim()) : [];
    } catch (err) {
      console.warn(`[API Attempt ${attempt} failed]: ${err.message}`);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000 * attempt));
      } else {
        throw err;
      }
    }
  }
}

async function rebuildPoliticsFacts() {
  console.log('🚀 政治分野の新FactID再構築を開始します...\n');
  const allGeneratedFacts = [];
  let factCounter = 1;

  for (let sIdx = 0; sIdx < sections.length; sIdx++) {
    const sec = sections[sIdx];
    console.log(`⏳ [${sIdx + 1}/${sections.length}] セクション処理中: 「${sec.title}」...`);

    const prompt = `あなたは時事・ニュース検定および大学入試レベルの最高峰のファクトデータ構築責任者です。
クイズアプリの解説や出題論点として学習者に提供する、正確無比な【独立したファクト知識】をゼロから再構築します。

以下の【入力テキスト】を精読し、1つの事項（論点）ごとに、一切の情報を削らず、完全に独立して意味が通じる文章を作成してください。

---
【入力テキスト（分野：政治 / セクション：${sec.title}）】:
${sec.content}

---
【最重要・厳格な遵守ルール】:
1. **書かれている内容を1つも省略しない（完全保持）**:
   - 年号（西暦・年・月）、具体的な数字（議席数、割合％、金額、日数、定数）、人名（歴代首相・閣僚・学者など）、条文番号（憲法条数・法律名）、括弧内の注釈、比較対象（諸外国、過去の選挙など）を【絶対に要約して削ったり捨てたりしないでください】。
   - クイズの作問根拠になるため、微細な数字や固有名詞の1つ1つが極めて重要です。

2. **AIの知識カットオフによる誤認・改変の絶対禁止**:
   - 本テキストは【2026年10月現在】の最新時事データです。
   - 2024年〜2026年の出来事（選挙結果、法改正、高市内閣、政権動向など）が多数記載されています。
   - あなたの古い知識基準で「未実施の未来のはずだ」「架空の年号だ」と勝手に疑ったり、過去に書き換えたり、削除したりすることは【絶対に禁止】です。書かれている事実・年号は100%現実の確定情報としてそのまま扱ってください。

3. **1つの事項ごとに完全に独立した文章にする**:
   - 1ファクト＝それ単体で読んでも前後の文脈なしで誰にでも完全に意味が通じる文章にしてください。
   - 主語（例:「衆議院の定数は…」「日本国憲法下における…」）を明確に補完してください。
   - 文末の述語を「〜である。」「〜となっている。」「〜と規定されている。」などの公的な時事解説文として完全に完結させてください（体言止めや途中で切れた文は完全禁止）。
   - ネットスラング（「デフォ」等）や、走り書きメモの記号（「？」「now」「old」等）は、自然で端正な公的日本語に直してください。

4. **1行に複数事項がある場合は適切に分割する**:
   - 異なる制度や歴史的事実が1行に並んでいる場合は、独立したファクトとして複数件に分けてください。

【出力フォーマット】:
必ず以下のJSON配列形式のみを出力してください：
[
  {
    "factText": "主語・述語・数字・固有名詞がすべて揃った、一切の省略がない完全な独立文。"
  }
]`;

    const generated = await callWithRetry(prompt);
    console.log(`  ✓ 抽出された事項数: ${generated.length} 件`);

    for (const item of generated) {
      if (item && item.factText) {
        const id = `POL-${String(factCounter++).padStart(3, '0')}`;
        allGeneratedFacts.push({
          id,
          category: '政治',
          section: sec.title,
          factText: item.factText.trim(),
          charCount: item.factText.trim().length,
        });
      }
    }
  }

  console.log(`\n🎉 全セクション処理完了！ 総生成ファクト数: ${allGeneratedFacts.length} 件`);

  // 保存
  const outDir = path.join(ROOT_DIR, 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outJsonPath = path.join(outDir, 'new_facts_politics.json');
  fs.writeFileSync(outJsonPath, JSON.stringify(allGeneratedFacts, null, 2), 'utf8');

  // 確認用Markdownレポート
  let md = `# 📘 新・政治ファクト知識集 (全${allGeneratedFacts.length}件)\n\n`;
  md += `**生成日時**: ${new Date().toISOString()}\n`;
  md += `**ソース**: sources/ニュース検定　政治.md\n`;
  md += `**特徴**: 内容の省略ゼロ、主述・数字・年号・固有名詞完全補完、独立完結文\n\n`;
  md += `---\n\n`;

  let currentSection = '';
  allGeneratedFacts.forEach(f => {
    if (f.section !== currentSection) {
      currentSection = f.section;
      md += `\n## 🏷️ ${currentSection}\n\n`;
    }
    md += `- **[${f.id}]** (${f.charCount}字)\n  ${f.factText}\n\n`;
  });

  const outMdPath = path.join(outDir, 'new_facts_politics.md');
  fs.writeFileSync(outMdPath, md, 'utf8');

  console.log(`💾 JSON保存完了: ${outJsonPath}`);
  console.log(`📄 Markdown保存完了: ${outMdPath}`);
}

rebuildPoliticsFacts().catch(err => {
  console.error('致命的エラー:', err);
  process.exit(1);
});
