import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const backupDir = path.join(ROOT_DIR, 'data/backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

// 1. バックアップ
const currentQuizPath = path.join(ROOT_DIR, 'src/data/quizzes/economics.json');
const quizBackupPath = path.join(backupDir, 'economics_backup_old196.json');
if (fs.existsSync(currentQuizPath) && !fs.existsSync(quizBackupPath)) {
  fs.copyFileSync(currentQuizPath, quizBackupPath);
  console.log(`📦 旧経済クイズバックアップ完了: ${quizBackupPath}`);
}

const currentFactsPath = path.join(ROOT_DIR, 'src/data/facts_index.json');
const factsBackupPath = path.join(backupDir, 'facts_index_backup_before_economics_rebuild.json');
if (fs.existsSync(currentFactsPath) && !fs.existsSync(factsBackupPath)) {
  fs.copyFileSync(currentFactsPath, factsBackupPath);
  console.log(`📦 旧ファクトインデックスバックアップ完了: ${factsBackupPath}`);
}

// 2. 新経済クイズの反映
const newQuizzesPath = path.join(ROOT_DIR, 'data/rebuilt_economics_quizzes.json');
const newQuizzes = JSON.parse(fs.readFileSync(newQuizzesPath, 'utf8'));
fs.writeFileSync(currentQuizPath, JSON.stringify(newQuizzes, null, 2), 'utf8');
console.log(`✅ 新・経済クイズ反映完了: ${newQuizzes.length} 問 -> ${currentQuizPath}`);

// 3. 新経済ファクトの反映
const newFactsPath = path.join(ROOT_DIR, 'data/new_facts_economics.json');
const newFacts = JSON.parse(fs.readFileSync(newFactsPath, 'utf8'));

const existingFacts = JSON.parse(fs.readFileSync(currentFactsPath, 'utf8'));
const nonEcoFacts = existingFacts.filter(f => f.category !== '経済');

// 政治・経済・暮らしの順で並べる
const polFacts = nonEcoFacts.filter(f => f.category === '政治');
const livFacts = nonEcoFacts.filter(f => f.category === '暮らし');
const otherFacts = nonEcoFacts.filter(f => f.category !== '政治' && f.category !== '暮らし');

const updatedAllFacts = [...polFacts, ...newFacts, ...livFacts, ...otherFacts];
fs.writeFileSync(currentFactsPath, JSON.stringify(updatedAllFacts, null, 2), 'utf8');

console.log(`✅ ファクトインデックス更新完了: 政治 ${polFacts.length} 件 + 経済 ${newFacts.length} 件 + 暮らし ${livFacts.length} 件 = 全 ${updatedAllFacts.length} 件 -> ${currentFactsPath}`);

// 4. 全体の集計確認
const polQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/politics.json'), 'utf8'));
const livQuizzes = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/quizzes/livelihood.json'), 'utf8'));
const totalQuizzes = polQuizzes.length + newQuizzes.length + livQuizzes.length;
console.log(`\n🎉 アプリ全クイズ総計: 政治 ${polQuizzes.length} + 経済 ${newQuizzes.length} + 暮らし ${livQuizzes.length} = 全 ${totalQuizzes} 問`);
