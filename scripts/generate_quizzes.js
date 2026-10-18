/**
 * 450〜500問 完全網羅バッチ生成スクリプト（Node.js / Gemini API REST）
 * 政治（約160問）＋ 経済（約340問）
 * 1回のリクエストを8〜10問に小分けしてAPIに送り、超高速かつ確実に全論点を網羅します。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '..');
const SOURCES_DIR = path.join(BASE_DIR, 'sources');
const OUTPUT_DIR = path.join(BASE_DIR, 'src', 'data', 'quizzes');
const CHECKPOINT_FILE = path.join(BASE_DIR, 'data', 'checkpoint_batch.json');
const ENV_FILE = path.join(BASE_DIR, '.env');

function getApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }
  if (fs.existsSync(ENV_FILE)) {
    const lines = fs.readFileSync(ENV_FILE, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('GEMINI_API_KEY=')) {
        return trimmed.replace('GEMINI_API_KEY=', '').replace(/^["']|["']$/g, '').trim();
      }
    }
  }
  return null;
}

const QUIZ_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      id: { type: "STRING" },
      category: { type: "STRING" },
      sourceFile: { type: "STRING" },
      sourceSection: { type: "STRING" },
      question: { type: "STRING" },
      options: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            key: { type: "STRING", enum: ["A", "B", "C", "D"] },
            text: { type: "STRING" }
          },
          required: ["key", "text"]
        }
      },
      correctAnswers: {
        type: "ARRAY",
        items: { type: "STRING", enum: ["A", "B", "C", "D"] }
      },
      explanations: {
        type: "OBJECT",
        properties: {
          overall: { type: "STRING" },
          details: {
            type: "OBJECT",
            properties: {
              A: { type: "STRING" },
              B: { type: "STRING" },
              C: { type: "STRING" },
              D: { type: "STRING" }
            },
            required: ["A", "B", "C", "D"]
          }
        },
        required: ["overall", "details"]
      }
    },
    required: ["id", "category", "sourceFile", "sourceSection", "question", "options", "correctAnswers", "explanations"]
  }
};

const SYSTEM_INSTRUCTION = `あなたは超難関国家試験およびニュース検定最上級（1級）の主席作問委員です。
提供されたテキストの内容【だけ】を100%忠実に根拠とし、細部まで徹底的に理解していないと絶対に正解できない超高難易度の4択・複数回答クイズを作成してください。

【厳格な作問ルール】
1. テキストに書かれている具体的な数値（％、年度、人数、金額）、法律名、判例、制度の仕組み、固有名詞の1つ1つを余すことなく問題の選択肢・論点として網羅すること。
2. 複数回答形式（正解は1つ、2つ、3つ、4つのパターンをバランスよく混ぜる）。消去法が一切通用しないこと。
3. ディストラクター（もっともらしい誤答）は、「数字の微妙な改ざん」「主語・目的語の入れ替え」「一般論と例外のすり替え」「類似する他制度との混同」など、しっかり理解していないと引っかかる精巧なものにすること。
4. 解説には、なぜ正解なのかに加え、他の選択肢が「どこをどう改ざんして誤りにしているか（本来はどうなのか）」を全選択肢について詳しく明記すること。
5. 必ず指定されたJSONスキーマに完全準拠したJSON配列のみを出力すること。`;

async function callGemini(apiKey, prompt, maxRetries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA,
      temperature: 0.2
    }
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        if ((response.status === 429 || response.status === 503) && attempt < maxRetries) {
          console.warn(`    [RETRY] HTTP ${response.status}. Retrying in ${attempt * 3}s...`);
          await new Promise(r => setTimeout(r, attempt * 3000));
          continue;
        }
        throw new Error(`API Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      return JSON.parse(text);
    } catch (err) {
      if (attempt < maxRetries) {
        console.warn(`    [RETRY] Attempt ${attempt} failed: ${err.message}. Retrying in ${attempt * 3}s...`);
        await new Promise(r => setTimeout(r, attempt * 3000));
      } else {
        throw err;
      }
    }
  }
}

function parseSections(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const sections = [];
  let currentTitle = '';
  let currentBody = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentTitle && currentBody.join('\n').trim().length > 50) {
        sections.push({ title: currentTitle, text: currentBody.join('\n').trim() });
      }
      currentTitle = line.replace(/^##\s*/, '').replace(/\*+/g, '').trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  if (currentTitle && currentBody.join('\n').trim().length > 50) {
    sections.push({ title: currentTitle, text: currentBody.join('\n').trim() });
  }
  return sections;
}

// テキスト量に応じて生成回数・問題数を決定
function calculateBatches(textLength) {
  if (textLength < 1500) {
    return [{ batchNum: 1, totalBatches: 1, count: 8, focus: 'セクション全体の重要事実・数字' }];
  } else if (textLength < 3500) {
    return [
      { batchNum: 1, totalBatches: 2, count: 9, focus: '前半部分の制度・定義・最新動向' },
      { batchNum: 2, totalBatches: 2, count: 9, focus: '後半部分の統計数値・例外・比較' }
    ];
  } else if (textLength < 6000) {
    return [
      { batchNum: 1, totalBatches: 3, count: 9, focus: '基礎知識・重要概念・法律制度' },
      { batchNum: 2, totalBatches: 3, count: 9, focus: '具体的統計数値・パーセンテージ・年度' },
      { batchNum: 3, totalBatches: 3, count: 9, focus: '判例・課題・最新政策・例外事項' }
    ];
  } else {
    return [
      { batchNum: 1, totalBatches: 4, count: 9, focus: 'パート1: 制度概要・歴史的経緯・法的位置づけ' },
      { batchNum: 2, totalBatches: 4, count: 9, focus: 'パート2: 各種数値データ・年度・目標値' },
      { batchNum: 3, totalBatches: 4, count: 9, focus: 'パート3: 他国・他制度との比較・課題' },
      { batchNum: 4, totalBatches: 4, count: 9, focus: 'パート4: 直近最新動向（2024〜2026年）の微細事項' }
    ];
  }
}

async function main() {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY が見つかりません。');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(CHECKPOINT_FILE), { recursive: true });

  let checkpoint = { completed: {}, total: 0 };
  if (fs.existsSync(CHECKPOINT_FILE)) {
    try {
      checkpoint = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf-8'));
    } catch (e) {}
  }

  const tasks = [
    {
      category: '政治',
      prefix: 'pol',
      sourceFile: 'ニュース検定　政治.md',
      outputFile: path.join(OUTPUT_DIR, 'politics.json')
    },
    {
      category: '経済',
      prefix: 'eco',
      sourceFile: 'ニュース検定　経済.md',
      outputFile: path.join(OUTPUT_DIR, 'economics.json')
    }
  ];

  for (const task of tasks) {
    console.log(`\n========================================`);
    console.log(`【分野開始】: ${task.category} (${task.sourceFile})`);
    console.log(`========================================`);

    const sourcePath = path.join(SOURCES_DIR, task.sourceFile);
    if (!fs.existsSync(sourcePath)) {
      console.warn(`ソースが見つかりません: ${sourcePath}`);
      continue;
    }

    const sections = parseSections(sourcePath);
    console.log(`有効セクション数: ${sections.length}`);

    let allQuizzes = [];
    if (fs.existsSync(task.outputFile)) {
      try {
        allQuizzes = JSON.parse(fs.readFileSync(task.outputFile, 'utf-8'));
      } catch (e) {}
    }

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const sec = sections[sIdx];
      const batches = calculateBatches(sec.text.length);

      console.log(`\n[SECTION ${sIdx + 1}/${sections.length}] ${sec.title} (${sec.text.length}字, ${batches.length}バッチ)`);

      for (const b of batches) {
        const batchKey = `${task.category}::${sec.title}::batch_${b.batchNum}_of_${b.totalBatches}`;

        if (checkpoint.completed[batchKey]) {
          console.log(`  [SKIP] 完了済み: バッチ ${b.batchNum}/${b.totalBatches}`);
          continue;
        }

        const startIndex = allQuizzes.length + 1;
        const prompt = `【分野】: ${task.category}
【ソース名】: ${task.sourceFile}
【セクション】: ${sec.title}
【今回の着眼点】: ${b.focus}
【出題数】: ${b.count} 問
【ID開始】: ${task.prefix}-${String(startIndex).padStart(3, '0')}

以下のテキストから、【今回の着眼点】に合致する事実・数値を優先して抽出し、他と重複しない超高難度の4択複数回答クイズを作成してください。

---
【テキスト本文】:
${sec.text}
---`;

        console.log(`  -> バッチ ${b.batchNum}/${b.totalBatches} 生成中 (${b.count}問目標)...`);

        try {
          const quizzes = await callGemini(apiKey, prompt);
          console.log(`  -> 成功: ${quizzes.length}問 追加 (現在累計: ${allQuizzes.length + quizzes.length}問)`);

          allQuizzes.push(...quizzes);
          fs.writeFileSync(task.outputFile, JSON.stringify(allQuizzes, null, 2), 'utf-8');

          checkpoint.completed[batchKey] = quizzes.length;
          checkpoint.total += quizzes.length;
          fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), 'utf-8');

          // 短いインターバル
          await new Promise(r => setTimeout(r, 1500));
        } catch (err) {
          console.error(`  [ERROR] バッチ ${b.batchNum} 失敗: ${err.message}`);
          await new Promise(r => setTimeout(r, 4000));
        }
      }
    }

    console.log(`\n【分野完了】 ${task.category}: 合計 ${allQuizzes.length} 問 蓄積完了！`);
  }

  console.log(`\n🎉 全生成パイプライン完了！ 総問題数: ${checkpoint.total} 問`);
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
