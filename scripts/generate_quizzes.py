"""
4,000問超難問クイズ自動生成スクリプト（Gemini Pro API / google-genai SDK対応）
全ソースファイルを読み込み、論点を100%網羅して複数回答クイズ（JSON）を一括生成します。
途中で中断してもチェックポイントから安全に再開できます。
"""

import os
import json
import glob
import time
from pathlib import Path
from typing import List, Dict, Any

# プロジェクトパス
BASE_DIR = Path(__file__).resolve().parent.parent
SOURCES_DIR = BASE_DIR / "sources"
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = DATA_DIR / "quizzes_by_category"
CHECKPOINT_FILE = DATA_DIR / "checkpoint.json"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# クイズのJSONスキーマ定義
QUIZ_SCHEMA = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "string"},
            "category": {"type": "string"},
            "sourceFile": {"type": "string"},
            "sourceSection": {"type": "string"},
            "question": {"type": "string"},
            "options": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "key": {"type": "string", "enum": ["A", "B", "C", "D"]},
                        "text": {"type": "string"}
                    },
                    "required": ["key", "text"]
                }
            },
            "correctAnswers": {
                "type": "array",
                "items": {"type": "string", "enum": ["A", "B", "C", "D"]}
            },
            "explanations": {
                "type": "object",
                "properties": {
                    "overall": {"type": "string"},
                    "details": {
                        "type": "object",
                        "properties": {
                            "A": {"type": "string"},
                            "B": {"type": "string"},
                            "C": {"type": "string"},
                            "D": {"type": "string"}
                        },
                        "required": ["A", "B", "C", "D"]
                    }
                },
                "required": ["overall", "details"]
            }
        },
        "required": ["id", "category", "sourceFile", "sourceSection", "question", "options", "correctAnswers", "explanations"]
    }
}

PROMPT_TEMPLATE = """
あなたは超難関資格試験の作問委員長です。
以下の【提供ソーステキスト】の内容**だけ**を根拠として、受験者が細部まで正確に理解していないと絶対に正解できない「超高難易度の4択・複数回答クイズ」を作成してください。

### 【極めて重要な作問ルール】
1. **ソースの内容を100%忠実に反映し、余すことなく網羅すること**
   - 外部知識や推測は一切含めず、提供されたテキスト内に書かれている事実・数字・制度・法律・判例のみを出題根拠にしてください。
2. **複数回答形式（正解は1つまたは複数）**
   - 正解となる選択肢は「1つのみ」「2つ」「3つ」「4つ全て」のパターンを混在させてください。
   - 「消去法」が通用しないよう、選択肢A〜Dすべてについて受験者が個別に正誤判定できる深さを持たせてください。
3. **精巧なディストラクター（もっともらしい誤答）を作成すること**
   - 一見正解に見えるが、「数字の微妙な改ざん（四捨五入 vs 切り上げ等）」「主語・管轄のすり替え（首長 vs 選管等）」「例外規定の混同」「別制度との混同」を巧妙に織り交ぜてください。
4. **全選択肢の詳細解説**
   - 「なぜ正しいのか」または「どこが誤りなのか（正しくは何なのか）」を各選択肢ごとに具体的に記述してください。
5. **出力形式**
   - 指定されたJSONスキーマに厳密に準拠したJSON配列のみを出力してください。

【対象ソースファイル名】: {source_file}
【対象セクション名】: {section_name}
【提供ソーステキスト】:
{chunk_text}
"""

def load_checkpoint() -> Dict[str, Any]:
    if CHECKPOINT_FILE.exists():
        with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"completed_sections": [], "total_generated": 0}

def save_checkpoint(data: Dict[str, Any]):
    with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("[INFO] GEMINI_API_KEY が環境変数に設定されていません。")
        print("実行時は以下のようにAPIキーを設定してください:")
        print("  $env:GEMINI_API_KEY=\"あなたのGemini APIキー\"")
        print("  python scripts/generate_quizzes.py")
        return

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    checkpoint = load_checkpoint()

    source_files = list(SOURCES_DIR.glob("*.md")) + list(SOURCES_DIR.glob("*.txt"))
    print(f"[START] 発見されたソースファイル数: {len(source_files)}")

    for sf in source_files:
        print(f"--- 処理中: {sf.name} ---")
        with open(sf, "r", encoding="utf-8") as f:
            content = f.read()

        # セクション分割（## 見出し等）
        sections = content.split("## ")
        for sec in sections:
            if not sec.strip():
                continue
            lines = sec.split("\n")
            sec_title = lines[0].strip()
            sec_body = "\n".join(lines[1:]).strip()

            sec_key = f"{sf.name}::{sec_title}"
            if sec_key in checkpoint["completed_sections"]:
                print(f"  [SKIP] 完了済み: {sec_title}")
                continue

            print(f"  [GENERATE] セクション生成開始: {sec_title}")
            prompt = PROMPT_TEMPLATE.format(
                source_file=sf.name,
                section_name=sec_title,
                chunk_text=sec_body
            )

            try:
                # Gemini ProモデルによるStructured JSON生成
                response = client.models.generate_content(
                    model='gemini-2.5-pro',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=QUIZ_SCHEMA,
                        temperature=0.3
                    )
                )

                generated_quizzes = json.loads(response.text)
                print(f"    -> {len(generated_quizzes)} 問 生成完了")

                # カテゴリ別ファイルへ保存
                out_path = OUTPUT_DIR / f"{sf.stem}.json"
                existing = []
                if out_path.exists():
                    with open(out_path, "r", encoding="utf-8") as f:
                        existing = json.load(f)

                existing.extend(generated_quizzes)
                with open(out_path, "w", encoding="utf-8") as f:
                    json.dump(existing, f, ensure_ascii=False, indent=2)

                checkpoint["completed_sections"].append(sec_key)
                checkpoint["total_generated"] += len(generated_quizzes)
                save_checkpoint(checkpoint)

                time.sleep(2)  # レートリミット配慮
            except Exception as e:
                print(f"    [ERROR] 生成失敗 ({sec_title}): {e}")
                time.sleep(5)

    print(f"\n[DONE] 全生成完了！ 総生成問題数: {checkpoint['total_generated']}")

if __name__ == "__main__":
    main()
