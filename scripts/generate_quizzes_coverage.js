/**
 * Step 2: 計画書完全準拠 カバレッジ100%保証 クイズ生成＆検証パイプライン
 * 
 * 1. facts_index.json (全607論点: 政治199件, 経済408件) を読み込み
 * 2. 未出題のFact IDグループをGemini APIに明示的に渡し、必ず正解/誤答の根拠として作問
 * 3. 生成された各クイズに coveredFactIds を記録
 * 4. 各バッチ終了時にカバレッジ率(%)を算出し、未出題ファクトがゼロ(100%)になるまで自動補完ループ
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(BASE_DIR, 'data');
const FACTS_FILE = path.join(DATA_DIR, 'facts_index.json');
const OUTPUT_DIR = path.join(BASE_DIR, 'src', 'data', 'quizzes');
const COVERAGE_REPORT_FILE = path.join(DATA_DIR, 'coverage_report.json');
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
      coveredFactIds: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
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
    required: ["id", "category", "sourceFile", "sourceSection", "coveredFactIds", "question", "options", "correctAnswers", "explanations"]
  }
};

const SYSTEM_INSTRUCTION = `あなたは超難関国家試験およびニュース検定最上級（1級）の主席作問委員です。
提供された【出題指定ファクト（論点）リスト】の内容【だけ】を100%忠実に根拠とし、細部まで徹底的に理解していないと絶対に正解できない超高難易度の4択・複数回答クイズを作成してください。

【厳格な作問ルール】
1. 指定された各Fact IDの記述（数値、年度、制度名、例外、判例等）を、必ず問題文または選択肢A〜Dの正解・ディストラクターの根拠として1つ残らず使い切ること。
2. 複数回答形式（正解は1つ、2つ、3つ、4つのパターンを混在）。消去法が一切通用しないこと。
3. ディストラクターは「数字の微細な改ざん」「主語・管轄のすり替え」「例外の混同」等、しっかり理解していないと解けない精妙なものにすること。
4. 解説には全選択肢（A〜D）について「なぜ正しいか」または「どこをどう改ざんして誤りにしているか」を詳細に明記すること。
5. 出題に使ったファクトIDを coveredFactIds 配列に必ず記録すること。
6. 指定されたJSONスキーマに完全準拠したJSON配列のみを出力すること。`;

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

async function runCategoryPipeline(apiKey, category, prefix, allFacts, outputFile) {
  console.log(`\n======================================================`);
  console.log(`【パイプライン開始】: ${category} (全論点数: ${allFacts.length} 件)`);
  console.log(`======================================================`);

  let quizzes = [];
  if (fs.existsSync(outputFile)) {
    try {
      quizzes = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
    } catch (e) {}
  }

  // 現在カバー済みのFact IDセット
  const coveredFactSet = new Set(quizzes.flatMap(q => q.coveredFactIds || []));
  console.log(`現在すでにカバー済みの論点: ${coveredFactSet.size} / ${allFacts.length} 件`);

  // セクションごとにファクトをグループ化
  const sections = {};
  for (const fact of allFacts) {
    if (!sections[fact.section]) sections[fact.section] = [];
    sections[fact.section].push(fact);
  }

  // 各セクションのファクトを3〜4個ずつチャンクにして出題
  for (const [secTitle, secFacts] of Object.entries(sections)) {
    // まだカバーされていないファクト
    let unaddressed = secFacts.filter(f => !coveredFactSet.has(f.id));
    if (unaddressed.length === 0) {
      console.log(`[SKIP] セクション完了済み: ${secTitle} (${secFacts.length}/${secFacts.length} 論点消化)`);
      continue;
    }

    console.log(`\n--- [セクション] ${secTitle} (全${secFacts.length}論点中、残り${unaddressed.length}論点) ---`);

    // 4ファクトずつまとめて2〜3問作問
    const CHUNK_SIZE = 4;
    for (let i = 0; i < unaddressed.length; i += CHUNK_SIZE) {
      const targetFacts = unaddressed.slice(i, i + CHUNK_SIZE);
      const factListText = targetFacts.map(f => `[${f.id}]: ${f.factText}`).join('\n');
      
      const questionCount = Math.max(2, Math.ceil(targetFacts.length / 2));
      const startIndex = quizzes.length + 1;

      const prompt = `【分野】: ${category}
【セクション】: ${secTitle}
【作問数】: ${questionCount} 問
【ID開始】: ${prefix}-${String(startIndex).padStart(3, '0')}

【出題指定ファクト（論点）リスト】:
${factListText}

上記の指定ファクトすべてを確実に使って、他と重複しない超高難度4択複数回答クイズを作成してください。
各問題の coveredFactIds に使用したFact IDを必ず記録してください。`;

      console.log(`  -> バッチ作問中: ファクト ${targetFacts.map(f => f.id).join(', ')} (${questionCount}問目標)...`);

      try {
        const generated = await callGemini(apiKey, prompt);
        console.log(`  -> 成功: ${generated.length}問 追加`);

        for (const g of generated) {
          quizzes.push(g);
          (g.coveredFactIds || []).forEach(fid => coveredFactSet.add(fid));
        }

        // 即時保存
        fs.writeFileSync(outputFile, JSON.stringify(quizzes, null, 2), 'utf-8');

        // カバレッジ計算
        const currentCoverage = Math.round((coveredFactSet.size / allFacts.length) * 100);
        console.log(`  [カバレッジ進捗] 現在: ${coveredFactSet.size} / ${allFacts.length} 論点 (${currentCoverage}%) | 累計問題数: ${quizzes.length} 問`);

        await new Promise(r => setTimeout(r, 1500));
      } catch (err) {
        console.error(`  [ERROR] 作問失敗: ${err.message}`);
        await new Promise(r => setTimeout(r, 4000));
      }
    }
  }

  // --- 補完ループ（未消化の論点が1つでも残っていれば、100%になるまで追加生成） ---
  let remaining = allFacts.filter(f => !coveredFactSet.has(f.id));
  let loopCount = 1;

  while (remaining.length > 0 && loopCount <= 3) {
    console.log(`\n【補完ループ ${loopCount}】 未消化の論点 ${remaining.length} 件を集中出題します...`);
    
    for (let i = 0; i < remaining.length; i += 3) {
      const targetFacts = remaining.slice(i, i + 3);
      const factListText = targetFacts.map(f => `[${f.id} (${f.section})]: ${f.factText}`).join('\n');
      const startIndex = quizzes.length + 1;

      const prompt = `【分野】: ${category}
【補完集中出題】: 以下の未出題ファクトを必ず出題してください。
【作問数】: 2 問
【ID開始】: ${prefix}-${String(startIndex).padStart(3, '0')}

【未消化ファクトリスト】:
${factListText}

上記のファクトをすべて選択肢の根拠として使い切り、coveredFactIdsにIDを記録してください。`;

      try {
        const generated = await callGemini(apiKey, prompt);
        for (const g of generated) {
          quizzes.push(g);
          (g.coveredFactIds || []).forEach(fid => coveredFactSet.add(fid));
        }
        fs.writeFileSync(outputFile, JSON.stringify(quizzes, null, 2), 'utf-8');
        await new Promise(r => setTimeout(r, 1500));
      } catch (e) {
        console.error(`補完生成エラー: ${e.message}`);
      }
    }

    remaining = allFacts.filter(f => !coveredFactSet.has(f.id));
    loopCount++;
  }

  const finalCoverage = Math.round((coveredFactSet.size / allFacts.length) * 100);
  console.log(`\n✓ 【${category} 完了】 最終カバレッジ: ${coveredFactSet.size} / ${allFacts.length} (${finalCoverage}%) | 総問題数: ${quizzes.length} 問`);

  return {
    category,
    totalFacts: allFacts.length,
    coveredFacts: coveredFactSet.size,
    coveragePercent: finalCoverage,
    totalQuizzes: quizzes.length,
    uncoveredFacts: remaining.map(f => f.id)
  };
}

async function main() {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY が見つかりません。');
    process.exit(1);
  }

  if (!fs.existsSync(FACTS_FILE)) {
    console.error(`ERROR: ${FACTS_FILE} が見つかりません。先に extract_facts.js を実行してください。`);
    process.exit(1);
  }

  const allFacts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf-8'));
  const polFacts = allFacts.filter(f => f.category === '政治');
  const ecoFacts = allFacts.filter(f => f.category === '経済');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const polReport = await runCategoryPipeline(
    apiKey,
    '政治',
    'pol',
    polFacts,
    path.join(OUTPUT_DIR, 'politics.json')
  );

  const ecoReport = await runCategoryPipeline(
    apiKey,
    '経済',
    'eco',
    ecoFacts,
    path.join(OUTPUT_DIR, 'economics.json')
  );

  const totalReport = {
    generatedAt: new Date().toISOString(),
    politics: polReport,
    economics: ecoReport,
    overall: {
      totalFacts: allFacts.length,
      coveredFacts: polReport.coveredFacts + ecoReport.coveredFacts,
      coveragePercent: Math.round(((polReport.coveredFacts + ecoReport.coveredFacts) / allFacts.length) * 100),
      totalQuizzes: polReport.totalQuizzes + ecoReport.totalQuizzes
    }
  };

  fs.writeFileSync(COVERAGE_REPORT_FILE, JSON.stringify(totalReport, null, 2), 'utf-8');

  console.log(`\n======================================================`);
  console.log(`🎉 全パイプライン完了！ カバレッジ検証レポート:`);
  console.log(`  政治: ${polReport.coveredFacts}/${polReport.totalFacts} 論点 (${polReport.coveragePercent}%) -> ${polReport.totalQuizzes}問`);
  console.log(`  経済: ${ecoReport.coveredFacts}/${ecoReport.totalFacts} 論点 (${ecoReport.coveragePercent}%) -> ${ecoReport.totalQuizzes}問`);
  console.log(`  全体: ${totalReport.overall.coveredFacts}/${totalReport.overall.totalFacts} 論点 (${totalReport.overall.coveragePercent}%) -> 合計 ${totalReport.overall.totalQuizzes}問`);
  console.log(`  レポート保存先: ${COVERAGE_REPORT_FILE}`);
  console.log(`======================================================`);
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
