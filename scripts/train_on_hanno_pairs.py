"""
Legal Saathi — Ingest and Train on Hanno-Labs/legal-retrieval-pairs-v1
Automates streaming/downloading from Hugging Face and preparing training pipelines:
  1. Dense Embedding / Bi-Encoder Fine-Tuning (SentenceTransformers)
  2. LLM Instruction Fine-Tuning (LoRA / Gemini JSONL format)
"""

import argparse
import json
import os
from pathlib import Path
import sys

# Configure UTF-8 encoding for Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Suppress Hugging Face symlinks warning on Windows
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "data" / "training"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

DATASET_NAME = "Hanno-Labs/legal-retrieval-pairs-v1"


def download_and_format_hanno(limit: int = 2000, streaming: bool = True):
    print("=" * 65)
    print(f">> Legal Saathi: Downloading & Formatting '{DATASET_NAME}'")
    print(f">> Target limit: {limit} rows | Streaming: {streaming}")
    print("=" * 65)

    try:
        from datasets import load_dataset
    except ImportError:
        print("[ERROR] 'datasets' library is missing. Run: pip install datasets")
        return

    print("[INFO] Fetching rows from Hugging Face...")
    ds = load_dataset(DATASET_NAME, split="train", streaming=streaming)

    llm_training_pairs = []
    embedding_pairs = []

    count = 0
    for row in ds:
        query = str(row.get("query", "")).strip()
        positive = str(row.get("positive", "")).strip()
        genre = str(row.get("genre", "legal"))
        source = str(row.get("source", "statute"))

        if not query or not positive or len(query) < 10 or len(positive) < 10:
            continue

        # 1. Embedding / Retrieval Pair (Anchor, Positive)
        embedding_pairs.append({
            "anchor": query,
            "positive": positive,
            "metadata": {"genre": genre, "source": source}
        })

        # 2. Generative LLM Instruction Pair
        user_message = (
            f"Analyze the following legal text and extract the governing doctrines, "
            f"applicable statutory provisions, and core legal issues:\n\n{query}"
        )
        assistant_message = (
            f"### Legal Analysis & Governing Provisions:\n{positive}"
        )

        llm_training_pairs.append({
            "messages": [
                {
                    "role": "system",
                    "content": "You are Legal Saathi, an expert AI in statutory analysis, legal doctrine, and procedural provisions."
                },
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": assistant_message}
            ]
        })

        count += 1
        if count >= limit:
            break

    # Save LLM JSONL format
    llm_file = OUTPUT_DIR / f"hanno_legal_sft_{count}.jsonl"
    with open(llm_file, "w", encoding="utf-8") as f:
        for p in llm_training_pairs:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    # Save Embedding / Retrieval JSON format
    embed_file = OUTPUT_DIR / f"hanno_retrieval_pairs_{count}.json"
    with open(embed_file, "w", encoding="utf-8") as f:
        json.dump(embedding_pairs, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 65)
    print(f"[SUCCESS] Downloaded and formatted {count} legal pairs!")
    print(f"  - LLM Fine-Tuning JSONL (for LoRA / Gemini): {llm_file}")
    print(f"  - Retrieval Pairs JSON (for Embedding):     {embed_file}")
    print("=" * 65)
    return llm_file, embed_file


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest & Format Hanno-Labs/legal-retrieval-pairs-v1")
    parser.add_argument("--limit", type=int, default=1000, help="Number of pairs to download")
    parser.add_argument("--no-stream", action="store_true", help="Download complete dataset without streaming")
    args = parser.parse_args()

    download_and_format_hanno(limit=args.limit, streaming=not args.no_stream)
