import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_FILE = path.resolve(__dirname, '..', '.env');

function getApiKey() {
  const lines = fs.readFileSync(ENV_FILE, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('GEMINI_API_KEY=')) {
      return trimmed.replace('GEMINI_API_KEY=', '').replace(/^["']|["']$/g, '').trim();
    }
  }
  return null;
}

async function test() {
  const apiKey = getApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello, reply with 'API_OK'" }] }]
    })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Test FAILED:', res.status, err);
    process.exit(1);
  }
  const data = await res.json();
  console.log('Test SUCCESS:', data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
}

test().catch(e => {
  console.error(e);
  process.exit(1);
});
