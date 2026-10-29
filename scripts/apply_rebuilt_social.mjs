import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const backupDir = path.join(ROOT_DIR, 'data/backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

// 1. ファクトインデックスのバックアップ
const currentFactsPath = path.join(ROOT_DIR, 'src/data/facts_index.json');
const factsBackupPath = path.join(backupDir, 'facts_index_backup_before_social_add.json');
if (fs.existsSync(currentFactsPath) && !fs.existsSync(factsBackupPath)) {
  fs.copyFileSync(currentFactsPath, factsBackupPath);
  console.log(`📦 旧ファクトインデックスバックアップ完了: ${factsBackupPath}`);
}

// 2. 新クイズファイルの配置（src/data/quizzes/social.json）
const newQuizzesPath = path.join(ROOT_DIR, 'data/rebuilt_social_quizzes.json');
const destQuizPath = path.join(ROOT_DIR, 'src/data/quizzes/social.json');
const newQuizzes = JSON.parse(fs.readFileSync(newQuizzesPath, 'utf8'));
fs.writeFileSync(destQuizPath, JSON.stringify(newQuizzes, null, 2), 'utf8');
console.log(`✅ 新・社会環境クイズ配置完了: ${newQuizzes.length} 問 -> ${destQuizPath}`);

// 3. 新社会環境ファクトの反映（既存の政治・経済・暮らしは完全維持し、社会環境を追加）
const newFactsPath = path.join(ROOT_DIR, 'data/new_facts_social.json');
const newFacts = JSON.parse(fs.readFileSync(newFactsPath, 'utf8'));

const existingFacts = JSON.parse(fs.readFileSync(currentFactsPath, 'utf8'));
// 既存の非社会環境ファクト
const nonSocialFacts = existingFacts.filter(f => f.category !== '社会環境');

const polFacts = nonSocialFacts.filter(f => f.category === '政治');
const ecoFacts = nonSocialFacts.filter(f => f.category === '経済');
const livFacts = nonSocialFacts.filter(f => f.category === '暮らし');
const otherFacts = nonSocialFacts.filter(f => !['政治', '経済', '暮らし'].includes(f.category));

const updatedAllFacts = [...polFacts, ...ecoFacts, ...livFacts, ...newFacts, ...otherFacts];
fs.writeFileSync(currentFactsPath, JSON.stringify(updatedAllFacts, null, 2), 'utf8');

console.log(`✅ ファクトインデックス更新完了: 政治 ${polFacts.length} + 経済 ${ecoFacts.length} + 暮らし ${livFacts.length} + 社会環境 ${newFacts.length} = 全 ${updatedAllFacts.length} 件 -> ${currentFactsPath}`);

// 4. アプリ全クイズの集計確認
const polQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/politics.json'), 'utf8'));
const ecoQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/economics.json'), 'utf8'));
const livQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/livelihood.json'), 'utf8'));
const totalQuizzes = polQuizzes.length + ecoQuizzes.length + livQuizzes.length + newQuizzes.length;

console.log(`\n🎉 アプリ全クイズ総計: 政治 ${polQuizzes.length} + 経済 ${ecoQuizzes.length} + 暮らし ${livQuizzes.length} + 社会環境 ${newQuizzes.length} = 全 ${totalQuizzes} 問`);
