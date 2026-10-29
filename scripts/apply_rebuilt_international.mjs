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
const factsBackupPath = path.join(backupDir, 'facts_index_backup_before_international_add.json');
if (fs.existsSync(currentFactsPath) && !fs.existsSync(factsBackupPath)) {
  fs.copyFileSync(currentFactsPath, factsBackupPath);
  console.log(`📦 旧ファクトインデックスバックアップ完了: ${factsBackupPath}`);
}

// 2. 新クイズファイルの配置（src/data/quizzes/international.json）
const newQuizzesPath = path.join(ROOT_DIR, 'data/rebuilt_international_quizzes.json');
const destQuizPath = path.join(ROOT_DIR, 'src/data/quizzes/international.json');
const newQuizzes = JSON.parse(fs.readFileSync(newQuizzesPath, 'utf8'));
fs.writeFileSync(destQuizPath, JSON.stringify(newQuizzes, null, 2), 'utf8');
console.log(`✅ 新・国際クイズ配置完了: ${newQuizzes.length} 問 -> ${destQuizPath}`);

// 3. 新国際ファクトの反映（既存の政治・経済・暮らし・社会環境は完全維持し、国際を追加）
const newFactsPath = path.join(ROOT_DIR, 'data/new_facts_international.json');
const newFacts = JSON.parse(fs.readFileSync(newFactsPath, 'utf8'));

const existingFacts = JSON.parse(fs.readFileSync(currentFactsPath, 'utf8'));
// 既存の非国際ファクト
const nonIntFacts = existingFacts.filter(f => f.category !== '国際');

const polFacts = nonIntFacts.filter(f => f.category === '政治');
const ecoFacts = nonIntFacts.filter(f => f.category === '経済');
const livFacts = nonIntFacts.filter(f => f.category === '暮らし');
const socFacts = nonIntFacts.filter(f => f.category === '社会環境');
const otherFacts = nonIntFacts.filter(f => !['政治', '経済', '暮らし', '社会環境'].includes(f.category));

const updatedAllFacts = [...polFacts, ...ecoFacts, ...livFacts, ...socFacts, ...newFacts, ...otherFacts];
fs.writeFileSync(currentFactsPath, JSON.stringify(updatedAllFacts, null, 2), 'utf8');

console.log(`✅ ファクトインデックス更新完了: 政治 ${polFacts.length} + 経済 ${ecoFacts.length} + 暮らし ${livFacts.length} + 社会環境 ${socFacts.length} + 国際 ${newFacts.length} = 全 ${updatedAllFacts.length} 件 -> ${currentFactsPath}`);

// 4. アプリ全クイズの集計確認
const polQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/politics.json'), 'utf8'));
const ecoQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/economics.json'), 'utf8'));
const livQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/livelihood.json'), 'utf8'));
const socQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/social.json'), 'utf8'));
const totalQuizzes = polQuizzes.length + ecoQuizzes.length + livQuizzes.length + socQuizzes.length + newQuizzes.length;

console.log(`\n🎉 アプリ全クイズ総計: 政治 ${polQuizzes.length} + 経済 ${ecoQuizzes.length} + 暮らし ${livQuizzes.length} + 社会環境 ${socQuizzes.length} + 国際 ${newQuizzes.length} = 全 ${totalQuizzes} 問`);
