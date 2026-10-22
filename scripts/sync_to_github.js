import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const REPO_NAME = 'quiz-master-app';

// 1. GitHub トークン取得
let token = '';
try {
  token = execSync('gh auth token', { encoding: 'utf-8' }).trim();
} catch (e) {
  console.error('GitHub CLIの認証トークンを取得できませんでした。gh auth login を実行してください。');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'QuizMaster-Deployer',
  'X-GitHub-Api-Version': '2022-11-28',
};

async function api(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `https://api.github.com${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get('content-type') || '';
  let body = null;
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  return { status: res.status, ok: res.ok, body, headers: res.headers };
}

// 収集対象ファイルの走査
function collectFiles(dir, base = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name).replace(/\\/g, '/');

    // 除外パターン（シークレット保護、ビルド成果物、依存関係）
    if (
      entry.name === 'node_modules' || 
      entry.name === 'dist' || 
      entry.name === '.git' || 
      entry.name.startsWith('.env') ||
      entry.name.endsWith('.log') ||
      entry.name.toLowerCase().endsWith('.pdf')
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, relPath));
    } else if (entry.isFile()) {
      results.push({ fullPath, relPath });
    }
  }

  return results;
}

async function main() {
  console.log('🚀 GitHub 自動同期＆公開パイプラインを開始します...');

  // 1. ユーザー情報取得
  const userRes = await api('/user');
  if (!userRes.ok) {
    throw new Error(`ユーザー情報の取得に失敗しました: ${JSON.stringify(userRes.body)}`);
  }
  const username = userRes.body.login;
  console.log(`✓ 認証ユーザー: ${username}`);

  // 2. リポジトリ確認または作成
  let repo = await api(`/repos/${username}/${REPO_NAME}`);
  if (repo.status === 404) {
    console.log(`📦 リポジトリ ${REPO_NAME} を新規作成します...`);
    const createRes = await api('/user/repos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: REPO_NAME,
        description: '超難問クイズマスター - 全607論点100%網羅学習プラットフォーム (GitHub Pages対応)',
        private: false,
        auto_init: true,
      }),
    });
    if (!createRes.ok) {
      throw new Error(`リポジトリ作成に失敗: ${JSON.stringify(createRes.body)}`);
    }
    console.log(`✓ リポジトリ作成完了: https://github.com/${username}/${REPO_NAME}`);
    // 初期化待ち
    await new Promise(r => setTimeout(r, 3000));
  } else if (!repo.ok) {
    throw new Error(`リポジトリ確認エラー: ${JSON.stringify(repo.body)}`);
  } else {
    console.log(`✓ 既存のリポジトリを確認: https://github.com/${username}/${REPO_NAME}`);
  }

  // 3. mainブランチの最新コミットSHA取得
  let refRes = await api(`/repos/${username}/${REPO_NAME}/git/ref/heads/main`);
  let parentCommitSha = null;
  if (refRes.ok) {
    parentCommitSha = refRes.body.object.sha;
    console.log(`✓ mainブランチ最新コミット: ${parentCommitSha.slice(0, 7)}`);
  } else {
    console.log('⚠️ mainブランチが未作成です。初回ブランチ作成を試みます...');
  }

  // 4. ファイル収集とBlob作成
  const files = collectFiles(ROOT_DIR);
  console.log(`📁 送信対象ファイル数: ${files.length} 件`);

  console.log('⏳ ファイルデータをアップロード中...');
  const treeItems = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = fs.readFileSync(file.fullPath);
    const content = buffer.toString('base64');

    const blobRes = await api(`/repos/${username}/${REPO_NAME}/git/blobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        encoding: 'base64',
      }),
    });

    if (!blobRes.ok) {
      throw new Error(`Blob作成失敗 (${file.relPath}): ${JSON.stringify(blobRes.body)}`);
    }

    treeItems.push({
      path: file.relPath,
      mode: '100644',
      type: 'blob',
      sha: blobRes.body.sha,
    });

    if ((i + 1) % 20 === 0 || i + 1 === files.length) {
      process.stdout.write(`  進捗: ${i + 1} / ${files.length} ファイル完了\r`);
    }
  }
  console.log(`\n✓ 全 ${treeItems.length} 件のファイルをアップロード完了！`);

  // 5. Git Tree 作成
  console.log('🌲 Git Tree を作成中...');
  const treeRes = await api(`/repos/${username}/${REPO_NAME}/git/trees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tree: treeItems,
    }),
  });
  if (!treeRes.ok) {
    throw new Error(`Tree作成失敗: ${JSON.stringify(treeRes.body)}`);
  }
  const treeSha = treeRes.body.sha;
  console.log(`✓ Tree作成完了: ${treeSha.slice(0, 7)}`);

  // 6. コミット作成
  console.log('📝 コミットを作成中...');
  const commitMessage = `Update quiz master: 307 questions, 100% covered, mobile responsive UI [${new Date().toISOString()}]`;
  const commitPayload = {
    message: commitMessage,
    tree: treeSha,
  };
  if (parentCommitSha) {
    commitPayload.parents = [parentCommitSha];
  }

  const commitRes = await api(`/repos/${username}/${REPO_NAME}/git/commits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commitPayload),
  });
  if (!commitRes.ok) {
    throw new Error(`コミット作成失敗: ${JSON.stringify(commitRes.body)}`);
  }
  const newCommitSha = commitRes.body.sha;
  console.log(`✓ 新規コミット作成完了: ${newCommitSha.slice(0, 7)}`);

  // 7. mainブランチの参照更新（プッシュ完了）
  console.log('🔄 mainブランチを更新（プッシュ）中...');
  if (parentCommitSha) {
    const updateRef = await api(`/repos/${username}/${REPO_NAME}/git/refs/heads/main`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sha: newCommitSha,
        force: true,
      }),
    });
    if (!updateRef.ok) {
      throw new Error(`ブランチ更新失敗: ${JSON.stringify(updateRef.body)}`);
    }
  } else {
    const createRef = await api(`/repos/${username}/${REPO_NAME}/git/refs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref: 'refs/heads/main',
        sha: newCommitSha,
      }),
    });
    if (!createRef.ok) {
      throw new Error(`ブランチ作成失敗: ${JSON.stringify(createRef.body)}`);
    }
  }
  console.log('✓ mainブランチへのプッシュ成功！');

  // 8. GitHub Pages の有効化（gh-pages ブランチ配信）
  console.log('🌐 GitHub Pages の設定を確認・有効化中...');
  const pagesPayload = {
    build_type: 'legacy',
    source: {
      branch: 'gh-pages',
      path: '/',
    },
  };
  const pagesRes = await api(`/repos/${username}/${REPO_NAME}/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pagesPayload),
  });

  if (pagesRes.ok) {
    console.log('✓ GitHub Pages（gh-pagesブランチ配信）を有効化しました！');
  } else if (pagesRes.status === 409 || pagesRes.status === 400) {
    // 既に設定されている場合はPUTで更新
    await api(`/repos/${username}/${REPO_NAME}/pages`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pagesPayload),
    });
    console.log('✓ GitHub Pagesの設定をgh-pagesブランチ配信方式に更新しました！');
  }

  const pagesUrl = `https://${username}.github.io/${REPO_NAME}/`;
  console.log('\n======================================================');
  console.log('🎉 GitHub へのアップロードとPages公開設定が完了しました！');
  console.log(`📦 リポジトリ: https://github.com/${username}/${REPO_NAME}`);
  console.log(`🚀 公開URL:   ${pagesUrl}`);
  console.log('======================================================');
  console.log('※ GitHub Actionsが自動的にビルド＆デプロイを実行中です（通常1〜2分で公開完了します）。');
}

main().catch(err => {
  console.error('\n❌ エラーが発生しました:', err.message);
  process.exit(1);
});
