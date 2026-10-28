import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// バックアップを quizzes フォルダの外（data/backups/）に移動する
const backupDir = path.join(ROOT_DIR, 'data/backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const polBackupSrc = path.join(ROOT_DIR, 'src/data/quizzes/politics_backup_old111.json');
const polBackupDest = path.join(backupDir, 'politics_backup_old111.json');
if (fs.existsSync(polBackupSrc)) {
  fs.renameSync(polBackupSrc, polBackupDest);
  console.log(`📦 バックアップファイルを退避しました: ${polBackupDest}`);
}

const factsBackupSrc = path.join(ROOT_DIR, 'src/data/facts_index_backup_before_politics_rebuild.json');
const factsBackupDest = path.join(backupDir, 'facts_index_backup_before_politics_rebuild.json');
if (fs.existsSync(factsBackupSrc)) {
  fs.renameSync(factsBackupSrc, factsBackupDest);
  console.log(`📦 ファクトバックアップファイルを退避しました: ${factsBackupDest}`);
}

// src/data/quizzes/ 内の正規ファイルのみ確認
const remaining = fs.readdirSync(path.join(ROOT_DIR, 'src/data/quizzes'));
console.log('src/data/quizzes/ 内の正規ファイル:', remaining);
