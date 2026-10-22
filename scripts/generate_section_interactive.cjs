const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// ルートディレクトリとパス設定
const ROOT_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT_DIR, 'data/facts_index.json');
const STAGING_DIR = path.join(ROOT_DIR, 'data/rebuilt_quizzes');

if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
}

// 1. 引数の解析
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const targetCategory = getArg('--category', '政治');
const targetSection = getArg('--section', '選挙制度・結果');
const questionCount = parseInt(getArg('--count', '4'), 10);

console.log(`\n============================================================`);
console.log(`【クイズ品質刷新パイプライン Phase 4.5】`);
console.log(`対象: ${targetCategory} ＞ ${targetSection} (生成目標: ${questionCount}問)`);
console.log(`============================================================\n`);

// 2. ファクトの取得
const allFacts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));
const sectionFacts = allFacts.filter(f => f.category === targetCategory && f.section === targetSection);

if (sectionFacts.length === 0) {
  console.error(`エラー: 対象セクション "${targetCategory} > ${targetSection}" のファクトが見つかりません。`);
  process.exit(1);
}

console.log(`✔ セクション内ファクト数: ${sectionFacts.length}件 (${sectionFacts[0].id} 〜 ${sectionFacts[sectionFacts.length - 1].id})`);

// 3. 正解個数枠の均等配分（各25%を厳守）
// 4問なら [1, 2, 3, 4]、8問なら [1, 1, 2, 2, 3, 3, 4, 4]
const targetCorrectCounts = [];
for (let i = 0; i < questionCount; i++) {
  targetCorrectCounts.push((i % 4) + 1);
}
// ランダムに並び替え
targetCorrectCounts.sort(() => Math.random() - 0.5);

console.log(`✔ 正解個数の配分スロット: [${targetCorrectCounts.join(', ')}] 個正解\n`);

// 4. プロンプトの構築（計画書第9章に完全準拠）
const factsListText = sectionFacts.map(f => `[${f.id}] ${f.factText}`).join('\n');

const prompt = `あなたは超難関公務員試験（国家総合職・一般職）および時事検定1級の専門作問官です。
以下の【提供ファクト】を徹底分析し、指定された【作問ルール】と【厳格な禁止事項】を100%遵守して、最高品質の4肢選択式クイズ（複数選択対応）を【${questionCount}問】作成し、有効なJSON配列として出力してください。

【提供ファクト】
${factsListText}

【各問題の目標正解個数】
${targetCorrectCounts.map((cnt, idx) => `第${idx + 1}問: 正解選択肢を「ちょうど${cnt}個」にすること（不正解は${4 - cnt}個）`).join('\n')}

【作問ルール（計画書第9章準拠）】
1. **形式**: 各問題は選択肢A, B, C, Dの4択。
2. **正答の網羅性**: 提供されたファクトの知識を必ず正解選択肢として活用すること。
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
    "id": "${targetCategory === '政治' ? 'pol' : 'eco'}-XXX",
    "category": "${targetCategory}",
    "sourceFile": "${sectionFacts[0].sourceFile}",
    "sourceSection": "${targetSection.replace(/^\\d+\\\\?[\\.．]\\s*/, '')}",
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

console.log(`▶ Antigravity CLI (agy) を呼び出して作問中...（少々お待ちください）`);

let rawOutput = '';
try {
  rawOutput = execFileSync('agy', ['-p', prompt, '--output-format', 'text'], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    timeout: 180000 // 3分
  });
} catch (err) {
  console.error('agy 実行エラー:', err.message);
  process.exit(1);
}

// 5. JSONの抽出とパース
let generatedQuizzes = null;
try {
  // ```json ... ``` のブロックがあれば抽出
  const jsonMatch = rawOutput.match(/```json\s*([\s\S]*?)\s*```/) || rawOutput.match(/\[\s*\{[\s\S]*\}\s*\]/);
  const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : rawOutput.trim();
  generatedQuizzes = JSON.parse(jsonStr);
} catch (e) {
  console.error('JSON パースエラー。出力結果:\n', rawOutput);
  process.exit(1);
}

if (!Array.isArray(generatedQuizzes) || generatedQuizzes.length === 0) {
  console.error('エラー: 有効なクイズ配列が取得できませんでした。');
  process.exit(1);
}

console.log(`✔ 生成完了（${generatedQuizzes.length}問取得）\n`);

// 6. 選択肢のシャッフル処理 & 自動品質検査
console.log(`============================================================`);
console.log(`【自動品質検査（バリデーション）】`);
console.log(`============================================================`);

let allPassed = true;
const validatedQuizzes = [];

generatedQuizzes.forEach((q, idx) => {
  const issues = [];

  // 設問文のノイズチェック
  if (/^\d+[\.．\s]/.test(q.question) || /\\/.test(q.question)) {
    issues.push(`設問文に見出し番号やエスケープ記号が残っています: "${q.question}"`);
  }

  // 正解個数のチェック
  const corCount = q.correctAnswers.length;
  if (corCount < 1 || corCount > 4) {
    issues.push(`正解個数が異常です (${corCount}個)`);
  }

  // 選択肢の検査
  q.options.forEach(opt => {
    const t = opt.text;
    if (t.includes('とする規定は撤廃され、例外なく禁止されている') ||
        t.includes('現行制度上は認められていない') ||
        t.includes('近年の制度改正により廃止された') ||
        t.includes('公式記録はなく、実際にはその半分未満')) {
      issues.push(`選択肢${opt.key}に機械的テンプレートが含まれています: "${t}"`);
    }
    if (t.slice(0, -1).includes('。')) {
      issues.push(`選択肢${opt.key}の文中に「。」が存在します（構文崩壊）: "${t}"`);
    }
    if (/こと。$|ため。$|背景。$|理由。$|もの。$|あり。$|議員。$|のみ。$/.test(t)) {
      issues.push(`選択肢${opt.key}が体言止め・未完成文です: "${t}"`);
    }
    if (/^(同法|同省|同国|同党|同条|これらは|これに対し|この結果)/.test(t)) {
      issues.push(`選択肢${opt.key}が前提のない指示語で始まっています: "${t}"`);
    }
  });

  // 解説の検査
  ['A', 'B', 'C', 'D'].forEach(k => {
    const d = q.explanations?.details?.[k] || '';
    if (!d) {
      issues.push(`選択肢${k}の解説が不足しています`);
    } else if (d.includes('公式テキストに反する誤った記述です')) {
      issues.push(`選択肢${k}の解説が手抜きテンプレです: "${d}"`);
    }
  });

  // 選択肢A〜Dのシャッフル
  // 元の正解フラグと解説を保持したままシャッフル
  const originalOptionsWithMeta = q.options.map(opt => ({
    oldKey: opt.key,
    text: opt.text,
    isCorrect: q.correctAnswers.includes(opt.key),
    detail: q.explanations.details[opt.key]
  }));

  // シャッフル
  originalOptionsWithMeta.sort(() => Math.random() - 0.5);

  const keys = ['A', 'B', 'C', 'D'];
  const newOptions = [];
  const newCorrectAnswers = [];
  const newDetails = {};

  originalOptionsWithMeta.forEach((item, i) => {
    const newKey = keys[i];
    newOptions.push({ key: newKey, text: item.text });
    if (item.isCorrect) {
      newCorrectAnswers.push(newKey);
    }
    // 解説テキストの冒頭記号の同期
    let d = item.detail;
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

  const finalQuiz = {
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
  };

  if (issues.length > 0) {
    allPassed = false;
    console.log(`❌ 第${idx + 1}問: 検出された問題点 (${issues.length}件)`);
    issues.forEach(iss => console.log(`   - ${iss}`));
  } else {
    console.log(`✔ 第${idx + 1}問: バリデーション完全合格（正解: ${newCorrectAnswers.join(', ')} [${newCorrectAnswers.length}個正解]）`);
  }

  validatedQuizzes.push(finalQuiz);
});

// 7. ターミナルでの詳細プレビュー表示
console.log(`\n============================================================`);
console.log(`【生成問題プレビュー（全${validatedQuizzes.length}問）】`);
console.log(`============================================================\n`);

validatedQuizzes.forEach((q, idx) => {
  console.log(`------------------------------------------------------------`);
  console.log(`【問 ${idx + 1}】 (${q.category} ＞ ${q.sourceSection}) [正解: ${q.correctAnswers.join(', ')} / 計${q.correctAnswers.length}個]`);
  console.log(`設問: ${q.question}`);
  console.log(`参照Fact: ${q.coveredFactIds.join(', ')}`);
  console.log(`選択肢:`);
  q.options.forEach(opt => {
    const mark = q.correctAnswers.includes(opt.key) ? '🟢 正解' : '🔴 誤り';
    console.log(`  [${opt.key}] (${mark}) ${opt.text}`);
  });
  console.log(`解説:`);
  console.log(`  総合: ${q.explanations.overall}`);
  ['A', 'B', 'C', 'D'].forEach(k => {
    console.log(`  ${k}: ${q.explanations.details[k]}`);
  });
  console.log(``);
});

// 8. ファイルへの保存
const safeSectionName = targetSection.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '_');
const saveFileName = `${targetCategory}_${safeSectionName}_preview.json`;
const saveFilePath = path.join(STAGING_DIR, saveFileName);

fs.writeFileSync(saveFilePath, JSON.stringify(validatedQuizzes, null, 2), 'utf8');

console.log(`============================================================`);
console.log(`✔ 検証済みデータをステージングに保存しました:`);
console.log(`  ${saveFilePath}`);
console.log(`全問バリデーション判定: ${allPassed ? '🎉 【完全合格 (PASS)】' : '⚠️ 【要改善箇所あり】'}`);
console.log(`============================================================\n`);
