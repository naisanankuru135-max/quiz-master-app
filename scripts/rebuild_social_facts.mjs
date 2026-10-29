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
const filePath = path.join(ROOT_DIR, 'sources/ニュース検定　社会環境.md');
const text = fs.readFileSync(filePath, 'utf8');

const rawSections = text.split(/^##\s+/m);
const tasks = [];

for (const sec of rawSections) {
  const trimmed = sec.trim();
  if (!trimmed || trimmed.includes('# ニュース検定　社会環境')) continue;
  const firstLineEnd = trimmed.indexOf('\n');
  const secTitle = firstLineEnd > 0 ? trimmed.slice(0, firstLineEnd).trim() : trimmed;
  const cleanSecTitle = secTitle.replace(/^\d+[\.\s]*/, '').trim();
  const secBody = firstLineEnd > 0 ? trimmed.slice(firstLineEnd).trim() : '';

  const rawSubSections = secBody.split(/^###\s+/m);
  for (const sub of rawSubSections) {
    const subTrimmed = sub.trim();
    if (!subTrimmed) continue;
    const subFirstLineEnd = subTrimmed.indexOf('\n');
    const subTitle = subFirstLineEnd > 0 ? subTrimmed.slice(0, subFirstLineEnd).trim() : '全般';
    const subContent = subFirstLineEnd > 0 ? subTrimmed.slice(subFirstLineEnd).trim() : subTrimmed;

    const lines = subContent.split('\n').filter(l => l.trim().length > 0);
    const CHUNK_SIZE = 16;

    if (lines.length > CHUNK_SIZE) {
      for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
        const chunkLines = lines.slice(i, i + CHUNK_SIZE);
        tasks.push({
          section: cleanSecTitle,
          subSection: subTitle,
          part: Math.floor(i / CHUNK_SIZE) + 1,
          totalParts: Math.ceil(lines.length / CHUNK_SIZE),
          content: chunkLines.join('\n'),
        });
      }
    } else {
      tasks.push({
        section: cleanSecTitle,
        subSection: subTitle,
        part: 1,
        totalParts: 1,
        content: subContent,
      });
    }
  }
}

console.log(`📋 社会環境ソース解析完了: 全 ${tasks.length} タスクブロック`);

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

async function rebuildSocialFacts() {
  console.log('\n======================================================');
  console.log(`🚀 社会環境分野の新FactID（SOC-001〜）再構築を開始します...`);
  console.log(`全 ${tasks.length} タスクブロックを順次高精度抽出`);
  console.log('======================================================\n');

  const outDir = path.join(ROOT_DIR, 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const tempJsonPath = path.join(outDir, 'new_facts_social_temp.json');

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
    const taskKey = `${task.section}__${task.subSection}__part_${task.part}`;

    if (allGeneratedFacts.some(f => f._taskKey === taskKey)) {
      continue;
    }

    const subLabel = task.totalParts > 1 ? ` (Part ${task.part}/${task.totalParts})` : '';
    console.log(`⏳ [${tIdx + 1}/${tasks.length}] 処理中: 「${task.section} / ${task.subSection}${subLabel}」...`);

    const prompt = `あなたは時事・ニュース検定および大学入試レベルの最高峰のファクトデータ構築責任者です。
クイズアプリの解説や出題論点として学習者に提供する、正確無比な【独立したファクト知識】をゼロから再構築します。

以下の【入力テキスト】を精読し、1つの事項（論点）ごとに、一切の情報を削らず、完全に独立して意味が通じる文章を作成してください。

---
【入力テキスト（分野：社会環境 / セクション：${task.section} - ${task.subSection}${subLabel}）】:
${task.content}

---
【最重要・厳格な遵守ルール】:
1. **書かれている内容を1つも省略しない（完全保持）**:
   - 年号（西暦・年・月）、具体的な数字（金額、割合％、人数、日数、上限額、被害想定数、温度など）、人名、法律名・条文番号（憲法条数、こども基本法、改正刑法など）、制度名・組織名、括弧内の注釈（原因や背景、補足説明）、比較対象（諸外国、過去データなど）を【絶対に要約して削ったり捨てたりしないでください】。
   - クイズの作問根拠になるため、微細な数字や固有名詞の1つ1つが極めて重要です。

2. **AIの知識カットオフによる誤認・改変の絶対禁止**:
   - 本テキストは【2026年10月現在】の最新時事データです。
   - 2024年〜2026年の出来事・制度改正（高校授業料無償化上限45.7万円・所得制限撤廃、日本版DBS法2026年12月施行、改正民法共同親権2026年4月施行、育成就労2027年移行、拘禁刑2025年6月施行、再審改正法2026年7月成立、成年後見改正2026年6月、緊急避妊薬2026年試験販売、防災庁2026年設置可決、COP30等）が多数記載されています。
   - あなたの古い知識基準で「未実施の未来のはずだ」「架空の年号だ」と勝手に疑ったり、過去に書き換えたり、削除したりすることは【絶対に禁止】です。書かれている事実・年号は100%現実の確定情報としてそのまま扱ってください。

3. **1つの事項ごとに完全に独立した文章にする**:
   - 1ファクト＝それ単体で読んでも前後の文脈なしで誰にでも完全に意味が通じる文章にしてください。
   - 主語（例:「高校授業料の実質無償化制度において…」「こども性暴力防止法（日本版DBS）では…」「日本国憲法第26条第1項では…」）を明確に補完してください。
   - 文末の述語を「〜である。」「〜となっている。」「〜と規定されている。」などの公的な時事解説文として完全に完結させてください（体言止めや途中で切れた文は完全禁止）。
   - ネットスラングや走り書きメモの記号は、自然で端正な公的日本語に直してください。

4. **1行に複数事項がある場合は適切に分割する**:
   - 異なる制度や歴史的事実が1行に並んでいる場合は、独立したファクトとして複数件に分けてください。

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
            id: 'SOC-TEMP',
            category: '社会環境',
            sourceFile: 'ニュース検定　社会環境.md',
            section: `${task.section} / ${task.subSection}`,
            factText: item.factText.trim(),
            charCount: item.factText.trim().length,
            _taskKey: taskKey,
          });
        }
      }

      fs.writeFileSync(tempJsonPath, JSON.stringify(allGeneratedFacts, null, 2), 'utf8');
    } catch (err) {
      console.error(`❌ タスク「${task.section} / ${task.subSection}${subLabel}」エラー:`, err.message);
    }
  }

  // タスクの順番通りにソート
  const taskOrderMap = new Map();
  tasks.forEach((t, i) => taskOrderMap.set(`${t.section}__${t.subSection}__part_${t.part}`, i));

  allGeneratedFacts.sort((a, b) => {
    const orderA = taskOrderMap.get(a._taskKey) ?? 999;
    const orderB = taskOrderMap.get(b._taskKey) ?? 999;
    return orderA - orderB;
  });

  // 番号の一括正式採番 (SOC-001, SOC-002, ...)
  const finalizedFacts = allGeneratedFacts.map((f, idx) => {
    const { _taskKey, ...rest } = f;
    return {
      ...rest,
      id: `SOC-${String(idx + 1).padStart(3, '0')}`,
    };
  });

  console.log(`\n🎉 全タスク完全抽出完了！ 総生成ファクト数: ${finalizedFacts.length} 件`);

  // 本保存
  const outJsonPath = path.join(outDir, 'new_facts_social.json');
  fs.writeFileSync(outJsonPath, JSON.stringify(finalizedFacts, null, 2), 'utf8');

  // 確認用Markdownレポート
  let md = `# 📘 新・社会環境ファクト知識集 (全${finalizedFacts.length}件)\n\n`;
  md += `**生成日時**: ${new Date().toISOString()}\n`;
  md += `**ソース**: sources/ニュース検定　社会環境.md\n`;
  md += `**カテゴリ**: 社会環境\n`;
  md += `**特徴**: 内容の省略ゼロ、主述・数字・年号・固有名詞完全補完、独立完結文\n\n`;
  md += `---\n\n`;

  let currentSection = '';
  finalizedFacts.forEach(f => {
    if (f.section !== currentSection) {
      currentSection = f.section;
      md += `\n## 🏷️ ${currentSection}\n\n`;
    }
    md += `- **[${f.id}]** (${f.charCount}字)\n  ${f.factText}\n\n`;
  });

  const outMdPath = path.join(outDir, 'new_facts_social.md');
  fs.writeFileSync(outMdPath, md, 'utf8');

  console.log(`💾 JSON保存完了: ${outJsonPath}`);
  console.log(`📄 Markdown保存完了: ${outMdPath}`);
}

rebuildSocialFacts().catch(err => {
  console.error('致命的エラー:', err);
  process.exit(1);
});
