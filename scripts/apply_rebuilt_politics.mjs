import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. バックアップ作成
const currentQuizPath = path.join(ROOT_DIR, 'src/data/quizzes/politics.json');
const quizBackupPath = path.join(ROOT_DIR, 'src/data/quizzes/politics_backup_old111.json');
if (fs.existsSync(currentQuizPath) && !fs.existsSync(quizBackupPath)) {
  fs.copyFileSync(currentQuizPath, quizBackupPath);
  console.log(`📦 旧クイズバックアップ完了: ${quizBackupPath}`);
}

const currentFactsPath = path.join(ROOT_DIR, 'src/data/facts_index.json');
const factsBackupPath = path.join(ROOT_DIR, 'src/data/facts_index_backup_before_politics_rebuild.json');
if (fs.existsSync(currentFactsPath) && !fs.existsSync(factsBackupPath)) {
  fs.copyFileSync(currentFactsPath, factsBackupPath);
  console.log(`📦 旧ファクトインデックスバックアップ完了: ${factsBackupPath}`);
}

// 2. 新クイズの適用
const newQuizzesPath = path.join(ROOT_DIR, 'data/rebuilt_politics_quizzes.json');
const newQuizzes = JSON.parse(fs.readFileSync(newQuizzesPath, 'utf8'));
fs.writeFileSync(currentQuizPath, JSON.stringify(newQuizzes, null, 2), 'utf8');
console.log(`✅ 新・政治クイズ反映完了: ${newQuizzes.length} 問 -> ${currentQuizPath}`);

// 3. 新ファクトの適用（政治ファクトの完全置換）
const newFactsPath = path.join(ROOT_DIR, 'data/new_facts_politics.json');
const newFacts = JSON.parse(fs.readFileSync(newFactsPath, 'utf8'));

const existingAllFacts = JSON.parse(fs.readFileSync(currentFactsPath, 'utf8'));
const nonPoliticsFacts = existingAllFacts.filter(f => f.category !== '政治');

const updatedAllFacts = [...newFacts, ...nonPoliticsFacts];
fs.writeFileSync(currentFactsPath, JSON.stringify(updatedAllFacts, null, 2), 'utf8');
console.log(`✅ ファクトインデックス更新完了: 政治 ${newFacts.length} 件 + その他 ${nonPoliticsFacts.length} 件 = 全 ${updatedAllFacts.length} 件 -> ${currentFactsPath}`);
