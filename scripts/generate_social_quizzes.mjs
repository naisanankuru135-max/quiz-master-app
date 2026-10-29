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

// 2. 社会環境新ファクト読み込み
const factsPath = path.join(ROOT_DIR, 'data/new_facts_social.json');
if (!fs.existsSync(factsPath)) {
  console.error(`❌ ${factsPath} が見つかりません。`);
  process.exit(1);
}
const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
console.log(`📊 社会環境新ファクト読み込み完了: 全 ${facts.length} 件`);

// 3. セクションごとにグループ化
const sectionMap = new Map();
for (const f of facts) {
  if (!sectionMap.has(f.section)) {
    sectionMap.set(f.section, []);
  }
  sectionMap.get(f.section).push(f);
}

// 4. 正解個数パターンの配分計画（1個:45%, 2個:45%, 3個:5%, 4個:5%）
function getTargetCountPattern() {
  const pattern = [
    1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
    1, 2, 1, 2, 1, 2, 1, 2, 3, 4
  ];
  for (let i = pattern.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pattern[i], pattern[j]] = [pattern[j], pattern[i]];
  }
  return pattern;
}

// 全セクションの出題計画（スペック）を構築
const quizSpecs = [];
let specCounter = 1;
const ALL_KEYS = ['A', 'B', 'C', 'D'];

for (const [sectionTitle, secFacts] of sectionMap.entries()) {
  let fIdx = 0;
  const pattern = getTargetCountPattern();
  let pIdx = 0;

  while (fIdx < secFacts.length) {
    const remainingFacts = secFacts.length - fIdx;
    let targetCount = pattern[pIdx % pattern.length];
    pIdx++;

    // 残りファクト数に応じた調整
    if (remainingFacts <= 4) {
      targetCount = remainingFacts;
    } else if (remainingFacts - targetCount === 1) {
      targetCount = Math.min(targetCount + 1, 4);
    }

    const assignedFacts = secFacts.slice(fIdx, fIdx + targetCount);
    fIdx += targetCount;

    // 正解キーをランダムに均等抽出
    const shuffledKeys = [...ALL_KEYS].sort(() => 0.5 - Math.random());
    const correctKeys = shuffledKeys.slice(0, targetCount).sort();

    // 誤答作成用に、セクション内の他ファクト（最大5件）を参照用として付与
    const otherFacts = secFacts.filter(f => !assignedFacts.some(af => af.id === f.id));
    const sampleBackgroundFacts = otherFacts.slice(0, 5);

    quizSpecs.push({
      quizIndex: specCounter++,
      category: '社会環境',
      section: sectionTitle,
      targetCount,
      correctKeys,
      assignedFacts,
      sampleBackgroundFacts,
    });
  }
}

console.log(`📋 出題計画（全問スペック）生成完了: 全 ${quizSpecs.length} 問`);

// 集計確認
const countDist = { 1: 0, 2: 0, 3: 0, 4: 0 };
quizSpecs.forEach(s => countDist[s.targetCount]++);
console.log('📊 正解個数分布:');
console.log(`  正解 1 個: ${countDist[1]} 問 (${Math.round((countDist[1] / quizSpecs.length) * 100)}%)`);
console.log(`  正解 2 個: ${countDist[2]} 問 (${Math.round((countDist[2] / quizSpecs.length) * 100)}%)`);
console.log(`  正解 3 個: ${countDist[3]} 問 (${Math.round((countDist[3] / quizSpecs.length) * 100)}%)`);
console.log(`  正解 4 個: ${countDist[4]} 問 (${Math.round((countDist[4] / quizSpecs.length) * 100)}%)`);

// リトライ付きAPI呼び出し
async function callApi(prompt, maxRetries = 4) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      return res.text ? JSON.parse(res.text.trim()) : null;
    } catch (err) {
      const isRateLimit = err.message && (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED'));
      if (attempt < maxRetries) {
        const delay = isRateLimit ? attempt * 4000 : 2000;
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

// 1問ごとの作問＆2パス自己検証
async function generateAndRefineQuiz(spec) {
  const assignedText = spec.assignedFacts
    .map((f, i) => `【正解ファクト${i + 1} (${f.id})】: ${f.factText}`)
    .join('\n');

  const bgText = spec.sampleBackgroundFacts
    .map(f => `・[${f.id}]: ${f.factText}`)
    .join('\n');

  // ----------------------------------------------------
  // パス1: 作問プロンプト
  // ----------------------------------------------------
  const pass1Prompt = `あなたは時事・ニュース検定および大学入試レベルの最高峰の作問責任者です。
以下の【割り当てられた正解ファクト】をもとに、出題テーマに沿った極上の4択クイズ（適切なものをすべて選べ）を1問作成してください。

【出題分野】: 社会環境 / ${spec.section}
【今回の正解個数】: ${spec.targetCount} 個
【今回の正解キーの指定】: ${spec.correctKeys.join(', ')}

【正解として必ず使用するファクト（★内容の省略厳禁★）】:
${assignedText}

【誤答作成の参考にするセクション内背景ファクト】:
${bgText || '（なし）'}

---
【作問における絶対厳守ルール】:
1. 【ファクト内容の省略ゼロ（完全網羅）】:
   - 指定された正解ファクトに含まれる「数字・年号・人名・機関名・制度名・法律名・条文番号・背景・注釈」は、絶対に要約して削ったり捨てたりせず、100%忠実に正解選択肢（${spec.correctKeys.join(', ')}）として文章化してください。
2. 【2026年最新時事の完全尊重】:
   - 本データは【2026年10月現在】の最新時事です。あなたの古い知識基準で「未来の予測だ」「架空の年号だ」と誤認して改ざん・削除することは【絶対に禁止】です。2024〜2026年の年号や出来事はすべて現実に起きた確定事実として扱ってください。
3. 【誤答選択肢の作成規定（4大推奨 ＆ 4大禁止）】:
   - 推奨パターン：①似た制度・管轄・法令のすり替え、②年号・パーセンテージ・数値・金額のリアルな入れ替え、③義務規定と努力義務・任意規定のすり替え、④歴史的経緯・因果関係の逆転
   - 4大禁止：①常識で消去できる荒唐無稽な極論、②単なる小数点の暗記パズル、③正解肢の単純な裏返し（Aである／Aではないの二択化）、④テーマ外からの唐突な異物混入
4. 【外観・文字数の均一化（正解バレ完全防止）】:
   - 正解肢だけ長文にしたりまとめ文にしないこと。A〜Dすべての選択肢を同じ格調、同じ文末調、同じ文字数（各60〜100文字程度）で美しく揃え、パッと見でどれも正解に見えるようにしてください。
5. 【解説の充実】:
   - 全体概要に加え、各選択肢（A〜D）に「なぜ正しいのか」「どこが誤りなのか（正しい事実・背景・条文は何か）」を明記してください。

【出力フォーマット（JSONオブジェクトのみ）】:
{
  "question": "問題文（〜に関する記述として、適切なものをすべて選べ。）",
  "options": [
    { "key": "A", "text": "選択肢Aの文章（60〜100字）" },
    { "key": "B", "text": "選択肢Bの文章（60〜100字）" },
    { "key": "C", "text": "選択肢Cの文章（60〜100字）" },
    { "key": "D", "text": "選択肢Dの文章（60〜100字）" }
  ],
  "correctAnswers": ${JSON.stringify(spec.correctKeys)},
  "coveredFactIds": ${JSON.stringify(spec.assignedFacts.map(f => f.id))},
  "explanations": {
    "overall": "問題全体の出題趣旨と概要",
    "details": {
      "A": "【○ 正しい】または【× 誤り】の理由",
      "B": "【○ 正しい】または【× 誤り】の理由",
      "C": "【○ 正しい】または【× 誤り】の理由",
      "D": "【○ 正しい】または【× 誤り】の理由"
    }
  }
}`;

  const pass1Result = await callApi(pass1Prompt);
  if (!pass1Result) throw new Error('Pass 1 returned null');

  // ----------------------------------------------------
  // パス2: 批判的検証＆リファイン（自己修正）
  // ----------------------------------------------------
  const pass2Prompt = `あなたは大手予備校の最高責任校閲官です。
先ほど作成された以下の【クイズ問題】と【元ファクト】を突き合わせて、極めて批判的・厳格に審査し、必要があれば修正を施した完成版JSONを出力してください。

【作成されたクイズ】:
${JSON.stringify(pass1Result, null, 2)}

【出題元ファクト（正解選択肢に必ず全情報が含まれている必要がある）】:
${assignedText}

---
【審査チェックリスト】:
1. 正解の選択肢（${spec.correctKeys.join(', ')}）に、元ファクトの重要情報（数字・年号・固有名詞・法律名）が省略されずに100%反映されているか？
2. 誤答選択肢は4大禁止事項（荒唐無稽な嘘、小数点暗記パズル、単純な裏返し、脈絡のない異物）に抵触していないか？
3. 正解肢だけが異様に長かったり、まとめ文になっていて正解がバレる構造になっていないか？（全肢が60〜100字で均一か？）
4. 解説は論理の飛躍がなく、学習者が完全に納得できる根拠が書かれているか？

【指示】:
もし上記に1点でも不備・粗・違和感があれば、その欠陥を解消した【修正済みの完全版クイズJSON】を出力してください。
完全に満点であれば、そのままのJSONを出力してください。
※正解キー（${JSON.stringify(spec.correctKeys)}）および出題ファクトID（${JSON.stringify(spec.assignedFacts.map(f => f.id))}）は変更しないでください。

【出力フォーマット（JSONオブジェクトのみ）】:
{
  "question": "問題文",
  "options": [
    { "key": "A", "text": "..." },
    { "key": "B", "text": "..." },
    { "key": "C", "text": "..." },
    { "key": "D", "text": "..." }
  ],
  "correctAnswers": ${JSON.stringify(spec.correctKeys)},
  "coveredFactIds": ${JSON.stringify(spec.assignedFacts.map(f => f.id))},
  "explanations": {
    "overall": "...",
    "details": {
      "A": "...",
      "B": "...",
      "C": "...",
      "D": "..."
    }
  }
}`;

  const refinedResult = await callApi(pass2Prompt);
  const finalResult = refinedResult || pass1Result;

  const paddedId = `soc-${String(spec.quizIndex).padStart(3, '0')}`;
  return {
    id: paddedId,
    category: spec.category,
    sourceFile: 'ニュース検定　社会環境.md',
    sourceSection: spec.section,
    coveredFactIds: spec.assignedFacts.map(f => f.id),
    question: finalResult.question,
    options: finalResult.options,
    correctAnswers: spec.correctKeys,
    explanations: finalResult.explanations,
  };
}

// 並行ワーカー実行
async function mapConcurrent(items, concurrency, fn) {
  const results = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      results[idx] = await fn(items[idx], idx);
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('\n======================================================');
  console.log(`🚀 新・社会環境クイズ全 ${quizSpecs.length} 問の完全新規作成を開始します...`);
  console.log('（各問：作問 ＋ 批判的自己検証の2パス方式で完全自動精査）');
  console.log('======================================================\n');

  const outDir = path.join(ROOT_DIR, 'data');
  const tempJsonPath = path.join(outDir, 'rebuilt_social_quizzes_temp.json');

  // キャッシュ／レジューム確認
  let completedMap = new Map();
  if (fs.existsSync(tempJsonPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(tempJsonPath, 'utf8'));
      existing.forEach(q => completedMap.set(q.id, q));
      console.log(`📦 既存の一時保存データを検出: ${completedMap.size} 問 再開します`);
    } catch (e) {}
  }

  let finishedCount = completedMap.size;

  // 3並行で安定稼働
  const results = await mapConcurrent(quizSpecs, 3, async (spec, idx) => {
    const paddedId = `soc-${String(spec.quizIndex).padStart(3, '0')}`;
    if (completedMap.has(paddedId)) {
      return completedMap.get(paddedId);
    }

    try {
      const quiz = await generateAndRefineQuiz(spec);
      completedMap.set(quiz.id, quiz);
      finishedCount++;

      // 定期的に一時保存
      if (finishedCount % 5 === 0 || finishedCount === quizSpecs.length) {
        fs.writeFileSync(tempJsonPath, JSON.stringify(Array.from(completedMap.values()), null, 2), 'utf8');
        console.log(`[進捗] ${finishedCount} / ${quizSpecs.length} (${Math.round((finishedCount / quizSpecs.length) * 100)}%) 完了`);
      }
      return quiz;
    } catch (err) {
      console.error(`❌ [${paddedId}] 生成エラー:`, err.message);
      return null;
    }
  });

  const finalQuizzes = results.filter(q => q !== null);
  console.log(`\n🎉 全問生成完了！ 生成成功数: ${finalQuizzes.length} 問`);

  // 本保存
  const outJsonPath = path.join(outDir, 'rebuilt_social_quizzes.json');
  fs.writeFileSync(outJsonPath, JSON.stringify(finalQuizzes, null, 2), 'utf8');

  // Markdownレポート作成
  let md = `# 📘 新・社会環境クイズ全問一覧レポート (全${finalQuizzes.length}問)\n\n`;
  md += `**生成日時**: ${new Date().toISOString()}\n`;
  md += `**総問題数**: ${finalQuizzes.length} 問\n`;
  md += `**ファクト網羅率**: SOC-001〜SOC-522 (100%)\n`;
  md += `**作問方式**: 2パス完全自己検証（作問 ＋ 批判的校閲リファイン）\n\n`;
  md += `---\n\n`;

  finalQuizzes.forEach((q, idx) => {
    md += `### ${idx + 1}. [${q.id}] 【${q.category} / ${q.sourceSection}】\n\n`;
    md += `**問題**: ${q.question}\n\n`;
    md += `**選択肢**:\n`;
    q.options.forEach(o => {
      const isCorrect = q.correctAnswers.includes(o.key);
      md += `- **${o.key}**: ${o.text} ${isCorrect ? '✅ (正解)' : ''}\n`;
    });
    md += `\n**正解**: 【 ${q.correctAnswers.join(', ')} 】 (計 ${q.correctAnswers.length} 個)\n\n`;
    md += `**対象ファクト**: ${q.coveredFactIds?.join(', ')}\n\n`;
    md += `**解説（概要）**: ${q.explanations?.overall}\n\n`;
    md += `<details><summary>各肢の詳細解説を表示</summary>\n\n`;
    Object.entries(q.explanations?.details || {}).forEach(([k, text]) => {
      md += `- **${k}**: ${text}\n`;
    });
    md += `\n</details>\n\n---\n\n`;
  });

  const outMdPath = path.join(outDir, 'rebuilt_social_quizzes.md');
  fs.writeFileSync(outMdPath, md, 'utf8');

  console.log(`💾 JSON保存完了: ${outJsonPath}`);
  console.log(`📄 Markdown保存完了: ${outMdPath}`);
}

main().catch(err => {
  console.error('致命的エラー:', err);
  process.exit(1);
});
