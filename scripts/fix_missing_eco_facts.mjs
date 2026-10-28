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

const ai = new GoogleGenAI({ vertexai: true, apiKey });
const MODEL_NAME = 'gemini-3.8-flash';

// 2. 経済ソースのタスクを再構築
const sourcePath = path.join(ROOT_DIR, 'sources/ニュース検定　経済.md');
const rawText = fs.readFileSync(sourcePath, 'utf8');

const rawSections = rawText.split(/^##\s+/m);
const sectionTasks = [];

for (const sec of rawSections) {
  const trimmed = sec.trim();
  if (!trimmed || trimmed.includes('# **ニュース検定　経済**')) continue;
  const firstLineEnd = trimmed.indexOf('\n');
  let rawTitle = firstLineEnd > 0 ? trimmed.slice(0, firstLineEnd).trim() : trimmed;
  const cleanTitle = rawTitle.replace(/^\*+\s*\d+[\.\\、\s]*/, '').replace(/\*+$/, '').trim();
  const sectionContent = firstLineEnd > 0 ? trimmed.slice(firstLineEnd).trim() : '';

  if (!sectionContent) continue;

  const lines = sectionContent.split('\n').filter(l => l.trim().length > 0);
  const CHUNK_SIZE = 18;
  if (lines.length > CHUNK_SIZE) {
    for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
      const chunkLines = lines.slice(i, i + CHUNK_SIZE);
      sectionTasks.push({
        title: cleanTitle,
        subIndex: Math.floor(i / CHUNK_SIZE) + 1,
        totalSubs: Math.ceil(lines.length / CHUNK_SIZE),
        content: chunkLines.join('\n'),
      });
    }
  } else {
    sectionTasks.push({
      title: cleanTitle,
      subIndex: 1,
      totalSubs: 1,
      content: sectionContent,
    });
  }
}

// 3. 一時保存データの読み込み
const tempJsonPath = path.join(ROOT_DIR, 'data/new_facts_economics_temp.json');
let tempFacts = JSON.parse(fs.readFileSync(tempJsonPath, 'utf8'));

// 既存のタスクキー一覧
const existingKeys = new Set(tempFacts.map(f => f._taskKey));

console.log(`全タスク数: ${sectionTasks.length}`);
console.log(`完了済みタスク数: ${existingKeys.size}`);

const missingTasks = sectionTasks.filter(t => !existingKeys.has(`${t.title}__sub_${t.subIndex}`));
console.log('未完了タスク:', missingTasks.map(t => `${t.title} (Part ${t.subIndex}/${t.totalSubs})`));

if (missingTasks.length === 0) {
  console.log('全タスク完了済みです。');
  process.exit(0);
}

// リトライ付きAPI呼び出し（429対策でウェイトを長く）
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
      console.warn(`[API Attempt ${attempt} failed]: ${err.message}`);
      if (attempt < maxRetries) {
        const delay = attempt * 5000; // 5s, 10s, 15s, 20s
        console.log(`⏳ ${delay}ms 待機してリトライします...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

async function fixMissing() {
  for (const task of missingTasks) {
    const taskKey = `${task.title}__sub_${task.subIndex}`;
    const subLabel = task.totalSubs > 1 ? ` (Part ${task.subIndex}/${task.totalSubs})` : '';
    console.log(`⏳ 未完了タスクを実行中: 「${task.title}${subLabel}」...`);

    const prompt = `あなたは時事・ニュース検定および大学入試レベルの最高峰のファクトデータ構築責任者です。
クイズアプリの解説や出題論点として学習者に提供する、正確無比な【独立したファクト知識】をゼロから再構築します。

以下の【入力テキスト】を精読し、1つの事項（論点）ごとに、一切の情報を削らず、完全に独立して意味が通じる文章を作成してください。

---
【入力テキスト（分野：経済 / セクション：${task.title}${subLabel}）】:
${task.content}

---
【最重要・厳格な遵守ルール】:
1. **書かれている内容を1つも省略しない（完全保持）**:
   - 年号（西暦・年・月）、具体的な数字（予算額、国債発行額、税収、税率、日数、GDP比など）、人名、法律名、制度名、括弧内の注釈、比較対象を【絶対に要約して削ったり捨てたりしないでください】。
2. **AIの知識カットオフによる誤認・改変の絶対禁止**:
   - 本テキストは【2026年10月現在】の最新時事データです。確定情報として扱ってください。
3. **1つの事項ごとに完全に独立した文章にする**:
   - 主語を明確に補完し、文末は「〜である。」「〜となっている。」などの端正な公的文末調で完結させてください。

【出力フォーマット（JSON配列のみ）】:
[
  {
    "factText": "主語・述語・数字・固有名詞がすべて揃った、一切の省略がない完全な独立文。"
  }
]`;

    const generated = await callWithRetry(prompt);
    console.log(`  ✓ 抽出された事項数: ${generated.length} 件`);

    for (const item of generated) {
      if (item && item.factText) {
        tempFacts.push({
          id: 'ECO-TEMP',
          category: '経済',
          sourceFile: 'ニュース検定　経済.md',
          section: task.title,
          factText: item.factText.trim(),
          charCount: item.factText.trim().length,
          _taskKey: taskKey,
        });
      }
    }
  }

  // タスクの順番通りにソート
  const taskOrderMap = new Map();
  sectionTasks.forEach((t, i) => taskOrderMap.set(`${t.title}__sub_${t.subIndex}`, i));

  tempFacts.sort((a, b) => {
    const orderA = taskOrderMap.get(a._taskKey) ?? 999;
    const orderB = taskOrderMap.get(b._taskKey) ?? 999;
    return orderA - orderB;
  });

  // 番号の一括正式採番 (ECO-001, ECO-002, ...)
  const finalizedFacts = tempFacts.map((f, idx) => {
    const { _taskKey, ...rest } = f;
    return {
      ...rest,
      id: `ECO-${String(idx + 1).padStart(3, '0')}`,
    };
  });

  console.log(`\n🎉 全タスク完全補完完了！ 総生成ファクト数: ${finalizedFacts.length} 件`);

  // 保存
  const outDir = path.join(ROOT_DIR, 'data');
  const outJsonPath = path.join(outDir, 'new_facts_economics.json');
  fs.writeFileSync(outJsonPath, JSON.stringify(finalizedFacts, null, 2), 'utf8');

  // 確認用Markdownレポート
  let md = `# 📘 新・経済ファクト知識集 (全${finalizedFacts.length}件)\n\n`;
  md += `**生成日時**: ${new Date().toISOString()}\n`;
  md += `**ソース**: sources/ニュース検定　経済.md\n`;
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

  const outMdPath = path.join(outDir, 'new_facts_economics.md');
  fs.writeFileSync(outMdPath, md, 'utf8');

  console.log(`💾 JSON保存完了: ${outJsonPath}`);
  console.log(`📄 Markdown保存完了: ${outMdPath}`);
}

fixMissing().catch(err => {
  console.error('致命的エラー:', err);
  process.exit(1);
});
