"""
Legal Saathi — Prepare Multi-Format Gemini Tuning Files
Converts legal_saathi_sft_train.jsonl into:
1. legal_saathi_gemini_chat.jsonl (with Gemini native 'user' and 'model' roles)
2. legal_saathi_gemini_pairs.csv (with 'input_text' and 'output_text' columns)
Guarantees 100% compatibility with Google AI Studio and Vertex AI tuning.
"""

import csv
import json
from pathlib import Path
import sys

# Configure UTF-8 encoding for Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
INPUT_JSONL = ROOT_DIR / "data" / "training" / "legal_saathi_sft_train.jsonl"
OUTPUT_CHAT_JSONL = ROOT_DIR / "data" / "training" / "legal_saathi_gemini_chat.jsonl"
OUTPUT_CSV = ROOT_DIR / "data" / "training" / "legal_saathi_gemini_pairs.csv"


def prepare_formats():
    print("=" * 65)
    print(">> Preparing Multi-Format Gemini Tuning Files")
    print("=" * 65)

    if not INPUT_JSONL.exists():
        print(f"[ERROR] Source file {INPUT_JSONL} not found.")
        return

    chat_records = []
    pair_records = []

    with open(INPUT_JSONL, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            data = json.loads(line)
            msgs = data.get("messages", [])

            system_prompt = ""
            user_text = ""
            assistant_text = ""

            for m in msgs:
                role = m.get("role")
                content = m.get("content", "")
                if role == "system":
                    system_prompt = content
                elif role == "user":
                    user_text = content
                elif role in ("assistant", "model"):
                    assistant_text = content

            if not user_text or not assistant_text:
                continue

            # 1. Native Gemini Chat format (role: user, role: model)
            gemini_msgs = []
            if system_prompt:
                gemini_msgs.append({"role": "system", "parts": [{"text": system_prompt}]})
            gemini_msgs.append({"role": "user", "parts": [{"text": user_text}]})
            gemini_msgs.append({"role": "model", "parts": [{"text": assistant_text}]})

            chat_records.append({"contents": gemini_msgs})

            # 2. Input/Output pair format
            prompt_input = user_text
            if system_prompt:
                prompt_input = f"{system_prompt}\n\nUser Question: {user_text}"
            pair_records.append([prompt_input, assistant_text])

    # Write Gemini Chat JSONL
    with open(OUTPUT_CHAT_JSONL, "w", encoding="utf-8") as f:
        for r in chat_records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    # Write CSV
    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["input_text", "output_text"])
        writer.writerows(pair_records)

    print(f"[SUCCESS] Prepared {len(chat_records)} samples in 2 formats:")
    print(f"  1. Gemini Chat JSONL: {OUTPUT_CHAT_JSONL.name} ({OUTPUT_CHAT_JSONL.stat().st_size / (1024*1024):.2f} MB)")
    print(f"  2. Direct CSV Pairs:  {OUTPUT_CSV.name} ({OUTPUT_CSV.stat().st_size / (1024*1024):.2f} MB)")
    print("=" * 65)


if __name__ == "__main__":
    prepare_formats()
