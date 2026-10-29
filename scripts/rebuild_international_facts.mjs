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

// 2. ソース読み込みとタスク分割
const filePath = path.join(ROOT_DIR, 'sources/ニュース検定　国際.md');
const text = fs.readFileSync(filePath, 'utf8');

const rawSections = text.split(/^##\s+/m);
const tasks = [];

for (const sec of rawSections) {
  const trimmed = sec.trim();
  if (!trimmed || trimmed.includes('# ニュース検定　国際')) continue;
  const firstLineEnd = trimmed.indexOf('\n');
  const secTitle = firstLineEnd > 0 ? trimmed.slice(0, firstLineEnd).trim() : trimmed;
  const cleanSecTitle = secTitle.replace(/^\d+[\.\s]*/, '').trim();
  const secBody = firstLineEnd > 0 ? trimmed.slice(firstLineEnd).trim() : '';

  const lines = secBody.split('\n').filter(l => l.trim().length > 0);
  const MAX_CHUNK = 20;

  if (lines.length > MAX_CHUNK) {
    const numParts = Math.ceil(lines.length / MAX_CHUNK);
    const chunkSize = Math.ceil(lines.length / numParts);
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunkLines = lines.slice(i, i + chunkSize);
      tasks.push({
        section: cleanSecTitle,
        part: Math.floor(i / chunkSize) + 1,
        totalParts: numParts,
        content: chunkLines.join('\n'),
      });
    }
  } else {
    tasks.push({
      section: cleanSecTitle,
      part: 1,
      totalParts: 1,
      content: lines.join('\n'),
    });
  }
}

console.log(`📋 国際ソース解析完了: 全 ${tasks.length} タスクブロック`);

// リトライ付きAPI呼び出し
async function callWithRetry(prompt, maxRetries = 5) {
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
      const isRateLimit = err.message && (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED'));
      console.warn(`[API Attempt ${attempt} failed]: ${err.message}`);
      if (attempt < maxRetries) {
        const delay = isRateLimit ? attempt * 4000 : 2000;
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

async function rebuildInternationalFacts() {
  console.log('\n======================================================');
  console.log(`🚀 国際分野の新FactID（INT-001〜）再構築を開始します...`);
  console.log(`全 ${tasks.length} タスクブロックを順次高精度抽出`);
  console.log('======================================================\n');

  const outDir = path.join(ROOT_DIR, 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const tempJsonPath = path.join(outDir, 'new_facts_international_temp.json');

  let allGeneratedFacts = [];

  if (fs.existsSync(tempJsonPath)) {
    try {
      const cached = JSON.parse(fs.readFileSync(tempJsonPath, 'utf8'));
      if (Array.isArray(cached) && cached.length > 0) {
        allGeneratedFacts = cached;
        console.log(`📦 既存の一時保存データを検出: ${allGeneratedFacts.length} 件復帰済み`);
      }
    } catch (e) {}
  }

  for (let tIdx = 0; tIdx < tasks.length; tIdx++) {
    const task = tasks[tIdx];
    const taskKey = `${task.section}__part_${task.part}`;

    if (allGeneratedFacts.some(f => f._taskKey === taskKey)) {
      continue;
    }

    const subLabel = task.totalParts > 1 ? ` (Part ${task.part}/${task.totalParts})` : '';
    console.log(`⏳ [${tIdx + 1}/${tasks.length}] 処理中: 「${task.section}${subLabel}」...`);

    const prompt = `あなたは時事・ニュース検定および大学入試レベルの最高峰のファクトデータ構築責任者です。
クイズアプリの解説や出題論点として学習者に提供する、正確無比な【独立したファクト知識】をゼロから再構築します。

以下の【入力テキスト】を精読し、1つの事項（論点）ごとに、一切の情報を削らず、完全に独立して意味が通じる文章を作成してください。

---
【入力テキスト（分野：国際 / セクション：${task.section}${subLabel}）】:
${task.content}

---
【最重要・厳格な遵守ルール】:
1. **書かれている内容を1つも省略しない（完全保持）**:
   - 年号（西暦・年・月）、具体的な数字（金額、割合％、人数、日数、保有発数、議席数、加盟国数、被害想定数、射程など）、人名（トランプ、習近平、プーチン、ネタニヤフ、マドゥロ、アサド、赤根智子、岩沢雄司、グテレスなど）、法律名・条約名（憲法、NPT、核禁条約、オタワ条約、オスロ条約、USMCA、ローマ規定、国連憲章、ジェノサイド条約など）、機関名・組織名（ICC、ICJ、NATO、UNHCR、IAEA、ICAN、ASEAN、BRICS、SCO、AfD、RN、USAIDなど）、括弧内の注釈（原因や背景、補足説明）、比較対象（諸外国、過去データなど）を【絶対に要約して削ったり捨てたりしないでください】。
   - クイズの作問根拠になるため、微細な数字や固有名詞の1つ1つが極めて重要です。

2. **AIの知識カットオフによる誤認・改変の絶対禁止**:
   - 本テキストは【2026年10月現在】の最新時事データです。
   - 2024年〜2026年の出来事・確定時事（トランプ第2次政権2025年発足、ベネズエラマドゥロ拘束2026年1月、パリ協定再離脱2025年1月、NATO防衛費GDP比5%目標2025年6月、66の国際枠組み離脱指示2026年1月、アサド政権崩壊2024年12月、ガザ停戦2025年10月、イスラエル・イラン12日間戦争2025年6月、ICC赤根智子所長制裁2026年8月、新START2026年2月失効、オタワ条約運用停止・離脱2025年、陸自自爆ドローン310機導入2026年度、日本原水爆被団協ノーベル平和賞2024年など）が多数記載されています。
   - あなたの古い知識基準で「未実施の未来のはずだ」「架空の年号だ」と勝手に疑ったり、過去に書き換えたり、削除したりすることは【絶対に禁止】です。書かれている事実・年号は100%現実の確定情報としてそのまま扱ってください。

3. **1つの事項ごとに完全に独立した文章にする**:
   - 1ファクト＝それ単体で読んでも前後の文脈なしで誰にでも完全に意味が通じる文章にしてください。
   - 主語（例:「米国の大統領制において…」「連邦議会の上院は…」「中国の習近平指導部では…」「国際刑事裁判所（ICC）は…」）を明確に補完してください。
   - 文末の述語を「〜である。」「〜となっている。」「〜と規定されている。」「〜とされている。」などの公的な時事解説文として完全に完結させてください（体言止めや途中で切れた文は完全禁止）。
   - ネットスラングや走り書きメモの記号（矢印や箇条書きの断片）は、自然で端正な公的日本語に直してください。

4. **1行に複数事項がある場合は適切に分割する**:
   - 異なる制度や歴史的事実、複数の数値が1行に並んでいる場合は、独立したファクトとして複数件に分けてください。

【出力フォーマット】:
必ず以下のJSON配列形式のみを出力してください：
[
  {
    "factText": "主語・述語・数字・固有名詞がすべて揃った、一切の省略がない完全な独立文。"
  }
]`;

    try {
      const generated = await callWithRetry(prompt);
      console.log(`  ✓ 抽出された事項数: ${generated.length} 件`);

      for (const item of generated) {
        if (item && item.factText) {
          allGeneratedFacts.push({
            id: 'INT-TEMP',
            category: '国際',
            sourceFile: 'ニュース検定　国際.md',
            section: task.section,
            factText: item.factText.trim(),
            charCount: item.factText.trim().length,
            _taskKey: taskKey,
          });
        }
      }

      fs.writeFileSync(tempJsonPath, JSON.stringify(allGeneratedFacts, null, 2), 'utf8');
    } catch (err) {
      console.error(`❌ タスク ${taskKey} でエラー発生:`, err);
      process.exit(1);
    }
  }

  console.log(`\n🎉 全タスク完了！抽出された生ファクト数: ${allGeneratedFacts.length} 件`);

  // 3. 正式なFactIDの採番 (INT-001 〜)
  const finalFacts = allGeneratedFacts.map((fact, index) => {
    const idNum = (index + 1).toString().padStart(3, '0');
    const { _taskKey, ...rest } = fact;
    return {
      id: `INT-${idNum}`,
      ...rest,
    };
  });

  const finalJsonPath = path.join(outDir, 'new_facts_international.json');
  fs.writeFileSync(finalJsonPath, JSON.stringify(finalFacts, null, 2), 'utf8');
  console.log(`💾 JSON保存完了: ${finalJsonPath} (${finalFacts.length} 件)`);

  // 4. 人間可読なMarkdownファイルの作成
  const mdLines = [
    `# ニュース検定 国際分野 新FactID一覧（INT-001 〜 INT-${finalFacts.length.toString().padStart(3, '0')}）`,
    `\n作成日時: ${new Date().toLocaleString('ja-JP')}`,
    `総ファクト数: ${finalFacts.length} 件\n`,
  ];

  let currentSection = '';
  for (const f of finalFacts) {
    if (f.section !== currentSection) {
      currentSection = f.section;
      mdLines.push(`\n## ${currentSection}\n`);
    }
    mdLines.push(`- **[${f.id}]** ${f.factText} （${f.charCount}文字）`);
  }

  const finalMdPath = path.join(outDir, 'new_facts_international.md');
  fs.writeFileSync(finalMdPath, mdLines.join('\n'), 'utf8');
  console.log(`📄 Markdown保存完了: ${finalMdPath}`);

  // 一時ファイルの削除
  if (fs.existsSync(tempJsonPath)) {
    fs.unlinkSync(tempJsonPath);
  }

  console.log('\n======================================================');
  console.log(`✨ 国際分野の新ファクト再構築が完全完了しました！`);
  console.log(`合計: ${finalFacts.length} 件 (INT-001 〜 INT-${finalFacts.length.toString().padStart(3, '0')})`);
  console.log('======================================================\n');
}

rebuildInternationalFacts().catch(e => {
  console.error('Fatal Error:', e);
  process.exit(1);
});
