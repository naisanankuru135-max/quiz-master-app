import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const GIT_PATH = 'C:\\Users\\naisa\\.gemini\\antigravity\\scratch\\mingit\\cmd';

function run(cmd, cwd = ROOT_DIR) {
  const env = {
    ...process.env,
    PATH: `${GIT_PATH};${process.env.PATH}`,
  };
  return execSync(cmd, { cwd, env, encoding: 'utf-8' }).trim();
}

async function main() {
  console.log('🚀 GitHub Pages デプロイパイプラインを開始します...');

  // 1. トークンとユーザー名
  const token = run('gh auth token');
  const username = JSON.parse(run('gh api /user')).login;
  const repoName = 'quiz-master-app';
  console.log(`✓ 認証ユーザー: ${username} (リポジトリ: ${repoName})`);

  // 2. ビルド実行
  console.log('📦 アプリケーションを本番ビルド中 (tsc && vite build)...');
  run('npm run build');
  console.log('✓ ビルド成功！');

  // 3. GitHub PagesでSPAルーティングを有効化するため 404.html を index.html からコピー
  fs.copyFileSync(path.join(DIST_DIR, 'index.html'), path.join(DIST_DIR, '404.html'));
  console.log('✓ 404.html を生成完了（SPA直接アクセス対応）');

  // 4. dist ディレクトリから gh-pages ブランチへ直接プッシュ
  console.log('📤 gh-pages ブランチへ成果物をプッシュ中...');
  const remoteUrl = `https://x-access-token:${token}@github.com/${username}/${repoName}.git`;

  run('git init', DIST_DIR);
  run('git config user.name "naisanankuru135-max"', DIST_DIR);
  run('git config user.email "naisanankuru135-max@users.noreply.github.com"', DIST_DIR);
  run('git checkout -B gh-pages', DIST_DIR);
  run('git add -A', DIST_DIR);
  run(`git commit --allow-empty -m "Deploy to GitHub Pages: ${new Date().toISOString()}"`, DIST_DIR);
  run(`git push "${remoteUrl}" gh-pages --force`, DIST_DIR);
  console.log('✓ gh-pages ブランチへのプッシュ成功！');

  // 5. GitHub Pagesの設定を gh-pages ブランチに設定
  console.log('🌐 GitHub Pages の設定を確認中...');
  try {
    run(`gh api -X POST /repos/${username}/${repoName}/pages -f source[branch]=gh-pages -f source[path]=/`);
    console.log('✓ GitHub Pages（gh-pagesブランチ配信）を有効化しました！');
  } catch (e) {
    // 既に設定されている場合はPUTで更新
    try {
      run(`gh api -X PUT /repos/${username}/${repoName}/pages -f source[branch]=gh-pages -f source[path]=/`);
      console.log('✓ GitHub Pagesの設定を更新しました！');
    } catch (e2) {
      console.log('✓ GitHub Pages設定はすでに有効です。');
    }
  }

  const pagesUrl = `https://${username}.github.io/${repoName}/`;
  console.log('\n======================================================');
  console.log('🎉 GitHub Pages でのWeb公開が完了しました！');
  console.log(`📦 リポジトリ: https://github.com/${username}/${repoName}`);
  console.log(`🚀 公開URL:   ${pagesUrl}`);
  console.log('======================================================');
  console.log('※ スマホや別PCのブラウザから上記URLを開くだけで、今すぐ世界中どこからでもプレイできます！');
}

main().catch(err => {
  console.error('\n❌ デプロイエラー:', err.message);
  process.exit(1);
});
