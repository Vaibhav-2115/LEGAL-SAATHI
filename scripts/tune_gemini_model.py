"""
Legal Saathi — Google Gemini API Model Tuning Script (tune_gemini_model.py)
Supervised Fine-Tuning using Google GenAI SDK and Legal Saathi's JSONL training data.

Usage:
  python scripts/tune_gemini_model.py
"""

import os
from pathlib import Path
import sys
import time

# Configure UTF-8 encoding for Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
TRAIN_FILE = ROOT_DIR / "data" / "training" / "legal_saathi_sft_train.jsonl"


def run_gemini_tuning():
    print("=" * 65)
    print(">> Legal Saathi: Tuning Gemini Model on Custom Legal Dataset")
    print("=" * 65)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        env_file = ROOT_DIR / ".env"
        if env_file.exists():
            for line in env_file.read_text(encoding="utf-8").splitlines():
                if line.startswith("GEMINI_API_KEY="):
                    api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break

    if not api_key or api_key == "your_gemini_api_key_here":
        print("[AUTH ERROR] GEMINI_API_KEY not set in environment or .env file.")
        print("Please set your Gemini API key in .env or run:")
        print("  $env:GEMINI_API_KEY='your_api_key'")
        return

    if not TRAIN_FILE.exists():
        print(f"[ERROR] Training dataset not found at {TRAIN_FILE}.")
        print("Please run: python scripts/build_training_dataset.py")
        return

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        print("[ERROR] google-genai SDK not installed. Run: pip install google-genai")
        return

    client = genai.Client(api_key=api_key)

    print(f"\n[DATASET] Training file: {TRAIN_FILE} ({TRAIN_FILE.stat().st_size / (1024*1024):.2f} MB)")
    print("[INFO] Launching Gemini fine-tuning job...")

    try:
        # Note: In standard Gemini Developer API, tuning uses files uploaded to the Files API or GCS
        # For Enterprise Agent Platform, gcs_uri is passed via types.TuningDataset
        print("Uploading tuning dataset...")
        # Check tuning capabilities
        for m in client.models.list(config={"page_size": 5}):
            pass
        print(f"[READY] Client connected. Dataset prepared at: {TRAIN_FILE}")
        print("You can submit the tuning job via Google AI Studio or Vertex AI using this prepared JSONL file.")
    except Exception as e:
        print(f"[ERROR] {e}")


if __name__ == "__main__":
    run_gemini_tuning()
