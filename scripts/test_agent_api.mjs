import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. .env からキーを取得
const envPath = path.join(ROOT_DIR, '.env');
let apiKey = '';
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('GOOGLE_CLOUD_API_KEY=')) {
      apiKey = trimmed.slice('GOOGLE_CLOUD_API_KEY='.length).trim();
      // クォート除去
      if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
        apiKey = apiKey.slice(1, -1);
      }
      break;
    }
  }
}

if (!apiKey) {
  console.error('❌ .env に GOOGLE_CLOUD_API_KEY が見つかりませんでした。');
  process.exit(1);
}

console.log('🔑 APIキーを正常に読み込みました (長さ: ' + apiKey.length + ')');

async function testConnection() {
  console.log('📡 Agent Platform API (gemini-4-argon) に接続テスト中...');

  try {
    // Vertex AI Express Mode
    const ai = new GoogleGenAI({
      vertexai: true,
      apiKey: apiKey,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: 'Agent Platform API 接続テストです。「接続成功」と短く返答してください。',
    });

    console.log('🎉 応答受信成功！');
    console.log('【モデル応答】:\n' + response.text);
  } catch (error) {
    console.error('⚠️ gemini-4-argon 呼び出しエラー:', error.message);
    console.log('\n💡 フォールバック: 標準モデル（gemini-2.5-flash / gemini-2.0-flash）で再試行します...');

    try {
      const ai = new GoogleGenAI({
        vertexai: true,
        apiKey: apiKey,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Agent Platform API 接続テストです。「接続成功」と短く返答してください。',
      });

      console.log('🎉 gemini-2.5-flash で接続成功！');
      console.log('【モデル応答】:\n' + response.text);
    } catch (err2) {
      console.error('❌ フォールバック呼び出しも失敗:', err2.message);
      // さらに詳細情報
      if (err2.stack) {
        console.error(err2.stack);
      }
    }
  }
}

testConnection();
