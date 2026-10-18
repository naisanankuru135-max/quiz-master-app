/**
 * 超難問クイズ自動生成スクリプト（Node.js / Gemini API対応）
 * 
 * 使い方:
 *   1. sources/ フォルダに新しいMarkdownファイル（例: ニュース検定　社会.md）を追加します。
 *   2. ターミナルでAPIキーを設定して実行します:
 *      $env:GEMINI_API_KEY="あなたのGemini APIキー"
 *      node scripts/generate_quizzes.mjs
 *   3. 自動的に各セクションからクイズが生成され、src/data/quizzes/ にJSONファイルとして保存されます。
 *   4. アプリ側（Vite）は追加されたJSONを自動検知して即座に反映します！
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '..');
const SOURCES_DIR = path.join(BASE_DIR, 'sources');
const OUTPUT_DIR = path.join(BASE_DIR, 'src', 'data', 'quizzes');
const CHECKPOINT_FILE = path.join(BASE_DIR, 'data', 'checkpoint.json');

// フォルダ準備
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const dataDir = path.dirname(CHECKPOINT_FILE);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const QUIZ_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      category: { type: "string" },
      sourceFile: { type: "string" },
      sourceSection: { type: "string" },
      question: { type: "string" },
      options: {
        type: "array",
        items: {
          type: "object",
          properties: {
            key: { type: "string", enum: ["A", "B", "C", "D"] },
            text: { type: "string" }
          },
          required: ["key", "text"]
        }
      },
      correctAnswers: {
        type: "array",
        items: { type: "string", enum: ["A", "B", "C", "D"] }
      },
      explanations: {
        type: "object",
        properties: {
          overall: { type: "string" },
          details: {
            type: "object",
            properties: {
              A: { type: "string" },
              B: { type: "string" },
              C: { type: "string" },
              D: { type: "string" }
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

const PROMPT_TEMPLATE = (sourceFile, sectionName, chunkText) => `
あなたは超難関資格試験の作問委員長です。
以下の【提供ソーステキスト】の内容**だけ**を根拠として、受験者が細部まで正確に理解していないと絶対に正解できない「超高難易度の4択・複数回答クイズ（3〜5問程度）」を作成してください。

### 【極めて重要な作問ルール】
1. **ソースの内容を100%忠実に反映し、余すことなく網羅すること**
   - 外部知識や推測は一切含めず、提供されたテキスト内に書かれている事実・数字・制度・法律・判例のみを出題根拠にしてください。
2. **複数回答形式（正解は1つまたは複数）**
   - 正解となる選択肢は「1つのみ」「2つ」「3つ」「4つ全て」のパターンを混在させてください。
   - 「消去法」が通用しないよう、選択肢A〜Dすべてについて受験者が個別に正誤判定できる深さを持たせてください。
3. **精巧なディストラクター（もっともらしい誤答）を作成すること**
   - 一見正解に見えるが、「数字の微妙な改ざん」「主語・管轄のすり替え」「例外規定の混同」「別制度との混同」を巧妙に織り交ぜてください。
4. **全選択肢の詳細解説**
   - 「なぜ正しいのか」または「どこが誤りなのか（正しくは何なのか）」を各選択肢ごとに具体的に記述してください。
5. **出力形式**
   - 指定されたJSONスキーマに厳密に準拠したJSON配列のみを出力してください。

【対象ソースファイル名】: ${sourceFile}
【対象セクション名】: ${sectionName}
【提供ソーステキスト】:
${chunkText}
`;

function loadCheckpoint() {
  if (fs.existsSync(CHECKPOINT_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf-8'));
    } catch {
      // fallback
    }
  }
  return { completed_sections: [], total_generated: 0 };
}

function saveCheckpoint(data) {
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function callGemini(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA,
      temperature: 0.3
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API Error (${res.status}): ${errText}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return JSON.parse(text);
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("[INFO] GEMINI_API_KEY が環境変数に設定されていません。");
    console.log("実行時は以下のようにAPIキーを設定して実行してください:");
    console.log("  $env:GEMINI_API_KEY=\"あなたのGemini APIキー\"");
    console.log("  node scripts/generate_quizzes.mjs\n");
    return;
  }

  const checkpoint = loadCheckpoint();
  const sourceFiles = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
  console.log(`[START] 発見されたソースファイル数: ${sourceFiles.length}`);

  for (const sf of sourceFiles) {
    console.log(`\n--- 処理中: ${sf} ---`);
    const filePath = path.join(SOURCES_DIR, sf);
    const content = fs.readFileSync(filePath, 'utf-8');

    // セクション分割 (## 見出し)
    const rawSections = content.split(/\n##\s+/);
    for (let i = 0; i < rawSections.length; i++) {
      const sec = rawSections[i];
      if (!sec.trim()) continue;
      const lines = sec.split('\n');
      const secTitle = lines[0].replace(/[*#]/g, '').trim();
      const secBody = lines.slice(1).join('\n').trim();

      if (!secBody) continue;

      const secKey = `${sf}::${secTitle}`;
      if (checkpoint.completed_sections.includes(secKey)) {
        console.log(`  [SKIP] 完了済み: ${secTitle}`);
        continue;
      }

      console.log(`  [GENERATE] セクション生成開始: ${secTitle}`);
      const prompt = PROMPT_TEMPLATE(sf, secTitle, secBody);

      try {
        const quizzes = await callGemini(apiKey, prompt);
        console.log(`    -> ${quizzes.length} 問 生成完了`);

        // ファイル名整形
        const outFileName = sf.replace(/\.[^.]+$/, '') + '.json';
        const outPath = path.join(OUTPUT_DIR, outFileName);

        let existing = [];
        if (fs.existsSync(outPath)) {
          try {
            existing = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
          } catch {
            existing = [];
          }
        }

        existing.push(...quizzes);
        fs.writeFileSync(outPath, JSON.stringify(existing, null, 2), 'utf-8');

        checkpoint.completed_sections.push(secKey);
        checkpoint.total_generated += quizzes.length;
        saveCheckpoint(checkpoint);

        // レートリミット配慮
        await new Promise(r => setTimeout(r, 2000));
      } catch (err) {
        console.error(`    [ERROR] 生成失敗 (${secTitle}):`, err.message);
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }

  console.log(`\n[DONE] 全セクションの処理が完了しました！ 総生成問題数: ${checkpoint.total_generated}`);
}

main().catch(console.error);
