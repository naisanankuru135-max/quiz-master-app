const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT_DIR, 'data/facts_index.json');
const STAGING_DIR = path.join(ROOT_DIR, 'data/rebuilt_quizzes');

if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
}

const allFacts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));

// セクション一覧を抽出
const sectionsMap = new Map();
allFacts.forEach(f => {
  const key = `${f.category}:::${f.section}`;
  if (!sectionsMap.has(key)) {
    sectionsMap.set(key, []);
  }
  sectionsMap.get(key).push(f);
});

console.log(`============================================================`);
console.log(`【全セクション クイズ完全リビルド パイプライン】`);
console.log(`総ファクト数: ${allFacts.length}件 / セクション数: ${sectionsMap.size}セクション`);
console.log(`============================================================\n`);

// 1つのバッチ（最大15ファクト程度）から指定問題数を作成するコア関数
function generateBatch(category, section, factsChunk, targetCount, batchIndex, totalBatches) {
  console.log(`\n▶ [${category} ＞ ${section}] バッチ ${batchIndex}/${totalBatches} (${factsChunk.length}ファクト, 目標${targetCount}問) を生成中...`);

  // 正解個数の配分スロット（1〜4個正解を均等に）
  const targetCorrectCounts = [];
  for (let i = 0; i < targetCount; i++) {
    targetCorrectCounts.push((i % 4) + 1);
  }
  targetCorrectCounts.sort(() => Math.random() - 0.5);

  const factsListText = factsChunk.map(f => `[${f.id}] ${f.factText}`).join('\n');
  const factIdsList = factsChunk.map(f => f.id);

  const prompt = `あなたは超難関公務員試験（国家総合職・一般職）および時事検定1級の専門作問官です。
以下の【提供ファクト】の知識を1つ残らず網羅し、指定された【作問ルール】と【厳格な禁止事項】を100%遵守して、最高品質の4肢選択式クイズ（複数選択対応）を【${targetCount}問】作成し、有効なJSON配列として出力してください。

【提供ファクト】（※この全ファクトIDを正解選択肢として必ず1回以上使用してください）
${factsListText}

【各問題の目標正解個数】
${targetCorrectCounts.map((cnt, idx) => `第${idx + 1}問: 正解選択肢を「ちょうど${cnt}個」にすること（不正解は${4 - cnt}個）`).join('\n')}

【作問ルール（計画書第9章準拠）】
1. **形式**: 各問題は選択肢A, B, C, Dの4択。
2. **正答の網羅性（最重要）**: 提供された全ファクト（${factIdsList.join(', ')}）が、必ずいずれかの問題の正解選択肢（coveredFactIds）として1つ残らずカバーされること。
3. **ディストラクター（誤答）の4大原則**:
   誤答選択肢は、単なる事実誤認ではなく、難関試験で受験生を迷わせる以下のいずれかの手口で精巧に作成すること：
   - ① 数値・比率の精巧な逆転（例: 99.7%と約7割をあべこべにする）
   - ② 法律要件・手続きのすり替え（例: 本人の同意が必要 ⇔ 事前同意なく職権で強制調査）
   - ③ 年号・タイムラグの引っかけ（例: 法改正成立年と初実施年のズレ）
   - ④ 類似制度・定義のすり替え（例: 平等選挙と普通選挙の定義入れ替え、日銀と財務省の役割入れ替え）
4. **解説（explanations）**:
   - overall: 出題テーマの背景と論点の要約。
   - details: A〜Dの全選択肢について、「【○ 正しい】〜の通り。」または「【× 誤り】どこが何と違っているのか、正しい事実は何か」を論理的かつ具体的に明記すること。

【厳格な禁止事項（絶対遵守）】
❌ 「〜とする規定は撤廃され、例外なく禁止されている」等の機械的な構文・接頭語・接尾語は絶対に禁止。
❌ 「同法」「これに対し」「一方で」「同国」など、選択肢単体で主語や先行詞がわからない文は禁止。必ず具体的な法律名や主語を明記すること。
❌ 「〜いたことあり。」「〜議員。」「〜のみ。」のようなメモ調・体言止めは禁止。必ず「〜である。」「〜となっている。」等の完全な文にすること。
❌ 設問文に見出し番号（「4. 」「1\. 」等）やMarkdownエスケープ記号を含めないこと。「〜に関する記述として、適切なものをすべて選べ。」と自然な文章にすること。
❌ 解説で「公式テキストに反する誤った記述です」等の手抜きテンプレは禁止。

【出力JSONフォーマット】
以下の形式のJSON配列のみを出力してください（Markdownのバッククォート \`\`\`json も可）。
[
  {
    "id": "${category === '政治' ? 'pol' : 'eco'}-XXX",
    "category": "${category}",
    "sourceFile": "${factsChunk[0].sourceFile}",
    "sourceSection": "${section.replace(/^\\d+\\\\?[\\.．]\\s*/, '')}",
    "coveredFactIds": ["POL-001", "POL-002"],
    "question": "〜に関する記述として、適切なものをすべて選べ。",
    "options": [
      { "key": "A", "text": "選択肢文A" },
      { "key": "B", "text": "選択肢文B" },
      { "key": "C", "text": "選択肢文C" },
      { "key": "D", "text": "選択肢文D" }
    ],
    "correctAnswers": ["A", "C"],
    "explanations": {
      "overall": "問題全体の解説",
      "details": {
        "A": "【○ 正しい】解説",
        "B": "【× 誤り】解説",
        "C": "【○ 正しい】解説",
        "D": "【× 誤り】解説"
      }
    }
  }
]`;

  let rawOutput = '';
  try {
    rawOutput = execFileSync('agy', ['-p', prompt, '--output-format', 'text'], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      timeout: 240000 // 4分
    });
  } catch (err) {
    console.error('agy 実行エラー:', err.message);
    return null;
  }

  let quizzes = null;
  try {
    const jsonMatch = rawOutput.match(/```json\s*([\s\S]*?)\s*```/) || rawOutput.match(/\[\s*\{[\s\S]*\}\s*\]/);
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : rawOutput.trim();
    quizzes = JSON.parse(jsonStr);
  } catch (e) {
    console.error('JSON パースエラー。');
    return null;
  }

  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    console.error('有効なクイズ配列が取得できませんでした。');
    return null;
  }

  // シャッフル & バリデーション
  const validated = [];
  quizzes.forEach((q, idx) => {
    const originalMeta = q.options.map(opt => ({
      oldKey: opt.key,
      text: opt.text,
      isCorrect: q.correctAnswers.includes(opt.key),
      detail: q.explanations.details[opt.key]
    }));

    originalMeta.sort(() => Math.random() - 0.5);

    const keys = ['A', 'B', 'C', 'D'];
    const newOptions = [];
    const newCorrectAnswers = [];
    const newDetails = {};

    originalMeta.forEach((item, i) => {
      const newKey = keys[i];
      newOptions.push({ key: newKey, text: item.text });
      if (item.isCorrect) newCorrectAnswers.push(newKey);
      let d = item.detail || '';
      if (item.isCorrect && !d.startsWith('【○')) {
        d = d.replace(/^【[×✕誤り]+】/, '').trim();
        d = `【○ 正しい】${d}`;
      } else if (!item.isCorrect && !d.startsWith('【×')) {
        d = d.replace(/^【[○◯正しい]+】/, '').trim();
        d = `【× 誤り】${d}`;
      }
      newDetails[newKey] = d;
    });

    newCorrectAnswers.sort();

    validated.push({
      id: q.id,
      category: q.category,
      sourceFile: q.sourceFile,
      sourceSection: q.sourceSection,
      coveredFactIds: q.coveredFactIds || [],
      question: q.question.replace(/^\d+[\.．\s]*/, '').replace(/\\/g, ''),
      options: newOptions,
      correctAnswers: newCorrectAnswers,
      explanations: {
        overall: q.explanations.overall,
        details: newDetails
      }
    });
  });

  return validated;
}

// 1つのセクションを完全リビルドする関数
function rebuildSection(category, section, facts) {
  const safeSec = section.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '_');
  const outFile = path.join(STAGING_DIR, `${category}_${safeSec}.json`);

  // 既に生成済みならスキップ可能
  if (fs.existsSync(outFile)) {
    const existing = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    // カバー確認
    const covered = new Set();
    existing.forEach(q => q.coveredFactIds?.forEach(id => covered.add(id)));
    const missing = facts.filter(f => !covered.has(f.id));
    if (missing.length === 0) {
      console.log(`✔ [${category} ＞ ${section}] は既に生成済み・100%カバー達成（${existing.length}問）。スキップします。`);
      return existing;
    }
  }

  console.log(`\n============================================================`);
  console.log(`【処理開始】 ${category} ＞ ${section} (ファクト数: ${facts.length}件)`);
  console.log(`============================================================`);

  // ファクト数に応じて1〜N個のチャンクに分割（1チャンク最大12〜15件）
  const CHUNK_SIZE = 12;
  const chunks = [];
  for (let i = 0; i < facts.length; i += CHUNK_SIZE) {
    chunks.push(facts.slice(i, i + CHUNK_SIZE));
  }

  const allSectionQuizzes = [];
  chunks.forEach((chunk, chunkIdx) => {
    // チャンクあたりの問題数（4の倍数で最低4問）
    const count = chunk.length <= 6 ? 4 : 4; // 12件なら4問で十分（正解平均2.5*4=10個＋誤答からカバー）
    let result = null;
    let attempts = 0;
    while (!result && attempts < 3) {
      attempts++;
      result = generateBatch(category, section, chunk, count, chunkIdx + 1, chunks.length);
    }
    if (result) {
      allSectionQuizzes.push(...result);
    }
  });

  // カバレッジの検証
  const covered = new Set();
  allSectionQuizzes.forEach(q => q.coveredFactIds?.forEach(id => covered.add(id)));
  const missing = facts.filter(f => !covered.has(f.id));

  console.log(`\n[カバレッジ結果: ${category} ＞ ${section}]`);
  console.log(`- ファクト総数: ${facts.length}件`);
  console.log(`- カバーされたファクト数: ${covered.size}件 (${(covered.size / facts.length * 100).toFixed(1)}%)`);

  if (missing.length > 0) {
    console.log(`⚠️ 未カバーファクト (${missing.length}件): ${missing.map(f => f.id).join(', ')}`);
    // 未カバー分を補完する追加問題を生成
    console.log(`▶ 未カバーファクトの補完問題を生成中...`);
    const compResult = generateBatch(category, section, missing, 4, '補完', '補完');
    if (compResult) {
      allSectionQuizzes.push(...compResult);
      compResult.forEach(q => q.coveredFactIds?.forEach(id => covered.add(id)));
    }
  }

  const finalMissing = facts.filter(f => !covered.has(f.id));
  console.log(`- 最終カバー率: ${( (facts.length - finalMissing.length) / facts.length * 100 ).toFixed(1)}%`);

  // 保存
  fs.writeFileSync(outFile, JSON.stringify(allSectionQuizzes, null, 2), 'utf8');
  console.log(`✔ セクション保存完了: ${outFile} (計${allSectionQuizzes.length}問)\n`);

  return allSectionQuizzes;
}

// コマンドライン引数で特定のセクションだけ実行することも可能
const targetCategoryArg = process.argv.find((_, i, arr) => arr[i - 1] === '--category');
const targetSectionArg = process.argv.find((_, i, arr) => arr[i - 1] === '--section');

if (targetCategoryArg && targetSectionArg) {
  const key = `${targetCategoryArg}:::${targetSectionArg}`;
  const facts = sectionsMap.get(key);
  if (!facts) {
    console.error(`指定されたセクションが見つかりません: ${key}`);
    process.exit(1);
  }
  rebuildSection(targetCategoryArg, targetSectionArg, facts);
} else {
  // 順次全セクションを実行
  for (const [key, facts] of sectionsMap.entries()) {
    const [cat, sec] = key.split(':::');
    rebuildSection(cat, sec, facts);
  }
}
