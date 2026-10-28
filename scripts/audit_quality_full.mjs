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
  console.error('❌ .env に GOOGLE_CLOUD_API_KEY が見つかりません。');
  process.exit(1);
}

const ai = new GoogleGenAI({ vertexai: true, apiKey });
const MODEL_NAME = 'gemini-3.8-flash';

// 2. データ読み込み
const facts = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/facts_index.json'), 'utf8'));
const factMap = Object.fromEntries(facts.map(f => [f.id, f.factText]));

const polQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/politics.json'), 'utf8'));
const ecoQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/economics.json'), 'utf8'));
const livQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/livelihood.json'), 'utf8'));
const allQuizzes = [...polQuizzes, ...ecoQuizzes, ...livQuizzes];

console.log(`📊 読み込み完了: クイズ全 ${allQuizzes.length} 問 / ファクト全 ${facts.length} 件`);

// 並行実行ヘルパー
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

// リトライ付きAPI呼び出し
async function callWithRetry(prompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      return res.text ? res.text.trim() : '';
    } catch (err) {
      const isRateLimit = err.message && (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED'));
      if (attempt < maxRetries) {
        const delay = isRateLimit ? attempt * 2000 : 1000;
        await new Promise(r => setTimeout(r, delay));
      } else {
        return `ERROR: ${err.message}`;
      }
    }
  }
}

// ==========================================
// A. クイズ435問の監査
// ==========================================
async function auditQuizzes() {
  console.log('\n======================================================');
  console.log(`🧐 【フェーズ1】クイズ全 ${allQuizzes.length} 問の1問ずつ完全個別監査を開始します...`);
  console.log('======================================================');

  const outputPathMd = path.join(ROOT_DIR, 'quality_audit_quizzes.md');
  const outputPathJson = path.join(ROOT_DIR, 'quality_audit_quizzes.json');

  let passCount = 0;
  let issueCount = 0;
  const issues = [];

  const results = await mapConcurrent(allQuizzes, 5, async (q, index) => {
    const linkedFactsText = (q.coveredFactIds || [])
      .map(id => `・[${id}]: ${factMap[id] || '（ファクト本文なし）'}`)
      .join('\n');

    const optionsText = q.options.map(o => `  ${o.key}: ${o.text}`).join('\n');
    const detailsText = Object.entries(q.explanations?.details || {})
      .map(([k, text]) => `  - 選択肢${k}: ${text}`)
      .join('\n');

    const prompt = `あなたは時事・ニュース検定および大学入試レベルの最高峰の作問審査官・校閲責任者です。
以下の【クイズ問題】と、その出題根拠とされている【紐付きファクト群】を精読してください。

【問題ID】: ${q.id} (第${index + 1}問)
【出題分野】: ${q.category} / ${q.sourceSection || '未分類'}
【問題文】: ${q.question}
【選択肢】:
${optionsText}
【正解】: ${q.correctAnswers.join(', ')}
【公式解説】:
全体概要: ${q.explanations?.overall || 'なし'}
各肢解説:
${detailsText}

【紐付いている出題ファクト原文】:
${linkedFactsText || '（紐付きファクトなし）'}

---
【審査指示】:
あなたがプロの編集者・教育者としてこの問題を読んだとき、学習者の視点、時事知識の正確性、日本語の自然さ、作問の品位などの観点から、少しでも違和感や改善点があれば忖度なく具体的に指摘してください。

（※以下は参考の着眼点です。これにとらわれず、あなたの高度な知性と編集眼で主体的に感じた違和感を自由に挙げてください）
・紐付きファクトの内容と問題が本当に一致しているか？（ファクトにない知識で誤答を作っていないか、ファクトを曲解していないか）
・選択肢に同じことの言い換え・水増しはないか？
・正解肢だけ長文・まとめ文になっていて、読めば正解がバレる構造になっていないか？
・単なる小数点の数字当てや、全問正解の手抜きなど、悪問になっていないか？
・解説は学習者が「なるほど」と納得できる根拠が書かれているか？
・日本語としてぎこちない、主述のねじれ、不自然な表現はないか？

【回答フォーマット】:
完全に良問・問題なしと判断した場合は、必ず最初の行に「PASS」とだけ記述してください。
違和感や改善すべき点がある場合は、以下の形式で出力してください：
【判定】: ⚠️要改善（または🚨重大な欠陥）
【違和感・問題点】: （何がどうおかしいのか、具体的に指摘）
【改善提案】: （どう修正すべきか、具体的な改善案）`;

    const auditOutput = await callWithRetry(prompt);
    const isPass = auditOutput.startsWith('PASS') || auditOutput === 'PASS';

    if (isPass) {
      passCount++;
    } else {
      issueCount++;
      issues.push({
        quizId: q.id,
        category: q.category,
        section: q.sourceSection,
        question: q.question,
        correctAnswers: q.correctAnswers,
        coveredFactIds: q.coveredFactIds,
        audit: auditOutput,
      });
    }

    const currentTotal = passCount + issueCount;
    if (currentTotal % 20 === 0 || currentTotal === allQuizzes.length) {
      console.log(`[クイズ監査進捗] ${currentTotal} / ${allQuizzes.length} (${Math.round((currentTotal / allQuizzes.length) * 100)}%) | PASS: ${passCount}件 | 要改善: ${issueCount}件`);
    }

    return { quizId: q.id, auditOutput, isPass };
  });

  // レポート作成
  let reportMd = `# 📝 クイズ全${allQuizzes.length}問 総合品質監査レポート\n\n`;
  reportMd += `**実行日時**: ${new Date().toISOString()}\n`;
  reportMd += `**使用モデル**: ${MODEL_NAME}\n`;
  reportMd += `**総監査数**: ${allQuizzes.length} 問\n`;
  reportMd += `**合格 (PASS)**: ${passCount} 問 (${Math.round((passCount / allQuizzes.length) * 100)}%)\n`;
  reportMd += `**要改善・違和感あり**: ${issueCount} 問 (${Math.round((issueCount / allQuizzes.length) * 100)}%)\n\n`;
  reportMd += `---\n\n## 🚨 指摘された問題一覧\n\n`;

  issues.forEach((item, idx) => {
    reportMd += `### ${idx + 1}. [${item.quizId}] 【${item.category} / ${item.section}】\n\n`;
    reportMd += `**問題文**: ${item.question}\n\n`;
    reportMd += `**対象ファクト**: ${item.coveredFactIds?.join(', ') || 'なし'}\n\n`;
    reportMd += `**監査結果**:\n${item.audit}\n\n`;
    reportMd += `---\n\n`;
  });

  fs.writeFileSync(outputPathMd, reportMd, 'utf8');
  fs.writeFileSync(outputPathJson, JSON.stringify(issues, null, 2), 'utf8');
  console.log(`\n🎉 クイズ監査完了！ レポート保存先: ${outputPathMd}`);
}

// ==========================================
// B. ファクト858件の監査
// ==========================================
async function auditFacts() {
  console.log('\n======================================================');
  console.log(`🧐 【フェーズ2】ファクト全 ${facts.length} 件の1件ずつ完全個別監査を開始します...`);
  console.log('======================================================');

  const outputPathMd = path.join(ROOT_DIR, 'quality_audit_facts.md');
  const outputPathJson = path.join(ROOT_DIR, 'quality_audit_facts.json');

  let passCount = 0;
  let issueCount = 0;
  const issues = [];

  const results = await mapConcurrent(facts, 5, async (f, index) => {
    const prompt = `あなたは時事・ニュースのファクトチェックおよび辞書編集の専門校閲責任者です。
以下の【ファクト（事実知識）】を1件精読してください。

【ファクトID】: ${f.id} (第${index + 1}件)
【カテゴリ】: ${f.category} (${f.section || '未分類'})
【ファクト本文】:
${f.factText}

---
【審査指示】:
あなたがプロの校閲者・編集者としてこのファクトを読んだとき、1つの独立した時事知識として学習者に提示できる水準になっているか、日本語として自然か、不備や違和感がないかを厳しくチェックしてください。

（※以下は参考の着眼点です。これにとらわれず、あなたが主体的に感じた違和感や改善点を自由に挙げてください）
・述語が抜けていたり、文末が途中で切れていないか？
・メモ書きの記号（？、now、old、略語など）が混入していないか？
・見出し単語だけで終わっておらず、何がどうなったのか事実が説明されているか？
・日本語の係り受けや表現がおかしくないか？

【回答フォーマット】:
完全に問題ない良質なファクトの場合は、必ず最初の行に「PASS」とだけ記述してください。
違和感や不備がある場合は、以下の形式で出力してください：
【判定】: ⚠️要改善（または🚨重大な欠陥）
【問題点】: （何がおかしいか具体的に指摘）
【修正案】: （より自然で完全なファクト文の修正案）`;

    const auditOutput = await callWithRetry(prompt);
    const isPass = auditOutput.startsWith('PASS') || auditOutput === 'PASS';

    if (isPass) {
      passCount++;
    } else {
      issueCount++;
      issues.push({
        factId: f.id,
        category: f.category,
        section: f.section,
        factText: f.factText,
        audit: auditOutput,
      });
    }

    const currentTotal = passCount + issueCount;
    if (currentTotal % 50 === 0 || currentTotal === facts.length) {
      console.log(`[ファクト監査進捗] ${currentTotal} / ${facts.length} (${Math.round((currentTotal / facts.length) * 100)}%) | PASS: ${passCount}件 | 要改善: ${issueCount}件`);
    }

    return { factId: f.id, auditOutput, isPass };
  });

  // レポート作成
  let reportMd = `# 📋 ファクト全${facts.length}件 総合品質監査レポート\n\n`;
  reportMd += `**実行日時**: ${new Date().toISOString()}\n`;
  reportMd += `**使用モデル**: ${MODEL_NAME}\n`;
  reportMd += `**総監査数**: ${facts.length} 件\n`;
  reportMd += `**合格 (PASS)**: ${passCount} 件 (${Math.round((passCount / facts.length) * 100)}%)\n`;
  reportMd += `**要改善・違和感あり**: ${issueCount} 件 (${Math.round((issueCount / facts.length) * 100)}%)\n\n`;
  reportMd += `---\n\n## 🚨 指摘されたファクト一覧\n\n`;

  issues.forEach((item, idx) => {
    reportMd += `### ${idx + 1}. [${item.factId}] 【${item.category} / ${item.section}】\n\n`;
    reportMd += `**原文**: ${item.factText}\n\n`;
    reportMd += `**監査結果**:\n${item.audit}\n\n`;
    reportMd += `---\n\n`;
  });

  fs.writeFileSync(outputPathMd, reportMd, 'utf8');
  fs.writeFileSync(outputPathJson, JSON.stringify(issues, null, 2), 'utf8');
  console.log(`\n🎉 ファクト監査完了！ レポート保存先: ${outputPathMd}`);
}

// 実行エントリー
async function main() {
  const target = process.argv[2] || 'all';

  if (target === 'quizzes' || target === 'all') {
    await auditQuizzes();
  }
  if (target === 'facts' || target === 'all') {
    await auditFacts();
  }

  console.log('\n🏁 すべての監査処理が完了しました！');
}

main().catch(err => {
  console.error('致命的エラー:', err);
  process.exit(1);
});
