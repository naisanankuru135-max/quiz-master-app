const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const FACTS_FILE = path.join(ROOT_DIR, 'data/facts_index.json');
const STAGING_DIR = path.join(ROOT_DIR, 'data/rebuilt_quizzes');
const COMP_DIR = path.join(STAGING_DIR, 'complements');

if (!fs.existsSync(COMP_DIR)) {
  fs.mkdirSync(COMP_DIR, { recursive: true });
}

const allFacts = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));

// 未正解ファクトのリスト
const audit = JSON.parse(fs.readFileSync('C:/Users/naisa/.gemini/antigravity/brain/a4d546a3-f8bc-425a-aa52-d456130c7f19/scratch/fact_true_audit.json', 'utf8'));
const unverifiedFacts = audit.filter(f => !f.isTrueInQuiz);

console.log(`============================================================`);
console.log(`【セクション内完結 正解化補完パイプライン】`);
console.log(`未正解ファクト総数: ${unverifiedFacts.length}件`);
console.log(`============================================================\n`);

const sectionGroups = new Map();
unverifiedFacts.forEach(f => {
  const key = `${f.category}:::${f.section}`;
  if (!sectionGroups.has(key)) {
    sectionGroups.set(key, []);
  }
  sectionGroups.get(key).push(f);
});

function generateSectionComplements(category, section, targetFacts, batchId) {
  const safeSec = section.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '_');
  const compFile = path.join(COMP_DIR, `comp_${category}_${safeSec}_${batchId}.json`);

  if (fs.existsSync(compFile)) {
    console.log(`✔ [${category} ＞ ${section}] バッチ${batchId} は既に生成済み。スキップします。`);
    return JSON.parse(fs.readFileSync(compFile, 'utf8'));
  }

  console.log(`▶ [${category} ＞ ${section}] バッチ${batchId} (${targetFacts.length}件) を正解化中...`);

  const qCount = Math.max(1, Math.ceil(targetFacts.length / 2.5));
  const correctSlots = [];
  for (let i = 0; i < qCount; i++) {
    correctSlots.push((i % 3) + 2); // 2個、3個、4個正解
  }

  const factsListText = targetFacts.map(f => `[${f.id}] ${f.factText}`).join('\n');
  const factIds = targetFacts.map(f => f.id);

  const prompt = `あなたは超難関公務員試験（国家総合職・一般職）および時事検定1級の専門作問官です。
以下の【提供ファクト】はすべて「${category} ＞ ${section}」の同一分野内の知識です。
【厳格要件】以下の全ファクトID（${factIds.join(', ')}）を、作成するクイズの【正解の選択肢（正解として選ぶべき記述）】として1つ残らず必ず出題してください。
同一分野内の知識のみで比較・作問し、他分野を絶対に混ぜないでください。

【提供ファクト】（※この全ファクトの知識を必ず【正解選択肢】として採用してください）
${factsListText}

【各問題の目標正解個数】
${correctSlots.map((cnt, idx) => `第${idx + 1}問: 正解選択肢を「ちょうど${cnt}個」にすること`).join('\n')}

【作問ルール】
1. 各問題は4択（A, B, C, D）。
2. 提供されたファクトの正しい記述を【正解（○）】の選択肢とし、不正解の選択肢は同じ分野内の自然なすり替え（公務員試験引っかけ4大原則）で作成してください。
3. 選択肢単体で意味が通じる完全な日本語にすること（「同法」「これに対し」等の放置禁止）。
4. 「〜とする規定は撤廃され例外なく禁止されている」等の怪文書は絶対に禁止。
5. 設問文に見出し番号（「4. 」「1\. 」等）は一切含めないこと。
6. 解説（details）には各選択肢の正誤理由を具体的に明記すること。

【出力JSONフォーマット】
以下の形式のJSON配列のみを出力してください。
[
  {
    "id": "${category === '政治' ? 'pol' : 'eco'}-comp-XXX",
    "category": "${category}",
    "sourceFile": "${category === '政治' ? 'ニュース検定　政治.md' : 'ニュース検定　経済.md'}",
    "sourceSection": "${section.replace(/^\\d+\\\\?[\\.．]\\s*/, '')}",
    "coveredFactIds": ["${factIds[0]}"],
    "question": "〜に関する記述として、適切なものをすべて選べ。",
    "options": [
      { "key": "A", "text": "正解または誤答の文" },
      { "key": "B", "text": "正解または誤答の文" },
      { "key": "C", "text": "正解または誤答の文" },
      { "key": "D", "text": "正解または誤答の文" }
    ],
    "correctAnswers": ["A", "B"],
    "explanations": {
      "overall": "問題全体の解説",
      "details": {
        "A": "【○ 正しい】解説",
        "B": "【○ 正しい】解説",
        "C": "【× 誤り】解説",
        "D": "【× 誤り】解説"
      }
    }
  }
]`;

  let rawOutput = '';
  try {
    rawOutput = execFileSync('agy', ['-p', prompt, '--dangerously-skip-permissions', '--output-format', 'text'], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      timeout: 240000
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

  const validated = [];
  quizzes.forEach(q => {
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
      coveredFactIds: q.coveredFactIds || targetFacts.map(f => f.id),
      question: q.question.replace(/^\d+[\.．\s]*/, '').replace(/\\/g, ''),
      options: newOptions,
      correctAnswers: newCorrectAnswers,
      explanations: {
        overall: q.explanations.overall,
        details: newDetails
      }
    });
  });

  fs.writeFileSync(compFile, JSON.stringify(validated, null, 2), 'utf8');
  console.log(`✔ バッチ保存完了: ${compFile} (${validated.length}問)`);
  return validated;
}

const allComplements = [];
for (const [key, targetFacts] of sectionGroups.entries()) {
  const [category, section] = key.split(':::');
  const CHUNK_SIZE = 8;
  for (let i = 0; i < targetFacts.length; i += CHUNK_SIZE) {
    const chunk = targetFacts.slice(i, i + CHUNK_SIZE);
    const batchId = Math.floor(i / CHUNK_SIZE) + 1;
    let res = null;
    let attempts = 0;
    while (!res && attempts < 3) {
      attempts++;
      res = generateSectionComplements(category, section, chunk, batchId);
    }
    if (res) {
      allComplements.push(...res);
    }
  }
}

console.log(`\n============================================================`);
console.log(`✔ 全補完問題の完了: 計 ${allComplements.length} 問`);
console.log(`============================================================`);
