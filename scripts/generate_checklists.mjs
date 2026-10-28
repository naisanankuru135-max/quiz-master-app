import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. クイズのチェックリスト生成
function generateQuizChecklist() {
  const jsonPath = path.join(ROOT_DIR, 'quality_audit_quizzes.json');
  const quizzes = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // 深刻度（🚨重大な欠陥 vs ⚠️要改善）で分類
  const critical = [];
  const normal = [];

  quizzes.forEach(item => {
    if (item.audit.includes('重大な欠陥') || item.audit.includes('🚨')) {
      critical.push(item);
    } else {
      normal.push(item);
    }
  });

  let md = `# ✅ クイズ修正指示チェックリスト (全${quizzes.length}件)\n\n`;
  md += `修正を反映させたい項目に \`[x]\` をチェックして、チャットで「チェックしたやつ直して」とお伝えいただければ、指定された項目だけを自動修正・反映します。\n\n`;
  md += `- **🚨 重大な欠陥（優先修正推奨）**: ${critical.length} 件\n`;
  md += `- **⚠️ 要改善・品質向上**: ${normal.length} 件\n\n`;
  md += `---\n\n`;

  md += `## 🚨 【優先度：高】重大な欠陥・悪問・ファクト乖離 (${critical.length}件)\n\n`;
  critical.forEach((item, i) => {
    const qShort = item.question.length > 40 ? item.question.slice(0, 40) + '...' : item.question;
    md += `- [ ] **[${item.quizId}]** 【${item.category} / ${item.section}】: ${qShort}\n`;
    md += `  <details><summary>🔍 違和感・問題点と改善案を表示</summary>\n\n`;
    md += `  \`\`\`text\n${item.audit}\n  \`\`\`\n`;
    md += `  </details>\n\n`;
  });

  md += `---\n\n`;
  md += `## ⚠️ 【優先度：中】要改善・表現・作問ブラッシュアップ (${normal.length}件)\n\n`;
  normal.forEach((item, i) => {
    const qShort = item.question.length > 40 ? item.question.slice(0, 40) + '...' : item.question;
    md += `- [ ] **[${item.quizId}]** 【${item.category} / ${item.section}】: ${qShort}\n`;
    md += `  <details><summary>🔍 違和感・問題点と改善案を表示</summary>\n\n`;
    md += `  \`\`\`text\n${item.audit}\n  \`\`\`\n`;
    md += `  </details>\n\n`;
  });

  const outPath = path.join(ROOT_DIR, 'quiz_correction_checklist.md');
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`✓ クイズチェックリスト生成完了: ${outPath} (${quizzes.length}件)`);
}

// 2. ファクトのチェックリスト生成
function generateFactChecklist() {
  const jsonPath = path.join(ROOT_DIR, 'quality_audit_facts.json');
  const facts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const critical = [];
  const normal = [];

  facts.forEach(item => {
    if (item.audit.includes('重大な欠陥') || item.audit.includes('🚨')) {
      critical.push(item);
    } else {
      normal.push(item);
    }
  });

  let md = `# ✅ ファクト修正指示チェックリスト (全${facts.length}件)\n\n`;
  md += `修正を反映させたい項目に \`[x]\` をチェックして、チャットで「チェックしたファクト直して」とお伝えいただければ、指定された項目だけを自動修正・リライト反映します。\n\n`;
  md += `- **🚨 重大な欠陥（文末切れ・スラング・破綻）**: ${critical.length} 件\n`;
  md += `- **⚠️ 要改善（単位抜け・体言止め・主語不足）**: ${normal.length} 件\n\n`;
  md += `---\n\n`;

  md += `## 🚨 【優先度：高】重大な欠陥・文章破損 (${critical.length}件)\n\n`;
  critical.forEach((item, i) => {
    const fShort = item.factText.length > 40 ? item.factText.slice(0, 40) + '...' : item.factText;
    md += `- [ ] **[${item.factId}]** 【${item.category} / ${item.section}】: ${fShort}\n`;
    md += `  <details><summary>🔍 問題点と修正案を表示</summary>\n\n`;
    md += `  \`\`\`text\n${item.audit}\n  \`\`\`\n`;
    md += `  </details>\n\n`;
  });

  md += `---\n\n`;
  md += `## ⚠️ 【優先度：中】要改善・表現補完 (${normal.length}件)\n\n`;
  normal.forEach((item, i) => {
    const fShort = item.factText.length > 40 ? item.factText.slice(0, 40) + '...' : item.factText;
    md += `- [ ] **[${item.factId}]** 【${item.category} / ${item.section}】: ${fShort}\n`;
    md += `  <details><summary>🔍 問題点と修正案を表示</summary>\n\n`;
    md += `  \`\`\`text\n${item.audit}\n  \`\`\`\n`;
    md += `  </details>\n\n`;
  });

  const outPath = path.join(ROOT_DIR, 'fact_correction_checklist.md');
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`✓ ファクトチェックリスト生成完了: ${outPath} (${facts.length}件)`);
}

generateQuizChecklist();
generateFactChecklist();
