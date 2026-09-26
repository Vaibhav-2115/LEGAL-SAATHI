"""
Legal Saathi — Open India Law (vaquill/open-india-law) Ingestion Script
Streams and ingests primary Indian legislation, judgments, and regulations
per Section 2 (Tier A) of LEGAL_SAATHI_DATASET_SPEC.md.

Note: vaquill/open-india-law is a Gated Dataset on Hugging Face (12.8M judgments).
Requires HF_TOKEN set in environment or .env file, plus accepting terms at:
https://huggingface.co/datasets/vaquill/open-india-law
"""

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

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "data" / "raw" / "open_india_law"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def get_hf_token() -> str:
    """Retrieves Hugging Face token from environment or .env file."""
    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN", "")
    if not token:
        env_file = ROOT_DIR / ".env"
        if env_file.exists():
            for line in env_file.read_text(encoding="utf-8").splitlines():
                if line.startswith("HF_TOKEN="):
                    token = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
    return token


def ingest_open_india_law(limit_per_subset: int = 100, streaming: bool = True):
    print("=" * 65)
    print(">> Legal Saathi: Ingesting Tier A Corpus (vaquill/open-india-law)")
    print("=" * 65)

    token = get_hf_token()
    if not token:
        print("\n[WARNING] HF_TOKEN is not set.")
        print("Dataset 'vaquill/open-india-law' is a Gated Dataset on Hugging Face.")
        print("Follow these 2 quick steps:")
        print("  1. Visit: https://huggingface.co/datasets/vaquill/open-india-law and click 'Access repository'")
        print("  2. Create a free Read token at: https://huggingface.co/settings/tokens")
        print("  3. Set HF_TOKEN in your .env or run: $env:HF_TOKEN='hf_your_token_here'\n")

    try:
        from datasets import load_dataset
    except ImportError:
        print("[ERROR] 'datasets' library is not installed. Run: pip install datasets")
        return

    subsets = ["legislation", "judgments", "regulations"]

    for subset in subsets:
        print(f"\n[STREAMING] Fetching subset: '{subset}' (limit={limit_per_subset})...")
        try:
            ds = load_dataset(
                "vaquill/open-india-law",
                subset,
                split="train",
                streaming=streaming,
                token=token if token else None
            )

            records = []
            for i, row in enumerate(ds):
                if i >= limit_per_subset:
                    break
                records.append(row)

            out_file = OUTPUT_DIR / f"{subset}_sample_{len(records)}.json"
            out_file.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"  [SUCCESS] Ingested {len(records)} records -> {out_file.name}")

        except Exception as e:
            err_str = str(e)
            if "gated" in err_str.lower() or "authenticated" in err_str.lower() or "401" in err_str:
                print(f"  [AUTH REQUIRED] Access denied for '{subset}'. Please authenticate with a Hugging Face token.")
                print(f"    Details: {e}")
            else:
                print(f"  [ERROR] Failed to load '{subset}': {e}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Ingest vaquill/open-india-law")
    parser.add_argument("--limit", type=int, default=50, help="Number of records to stream per subset")
    parser.add_argument("--no-stream", action="store_true", help="Download complete parquet shards instead of streaming")
    args = parser.parse_args()

    ingest_open_india_law(limit_per_subset=args.limit, streaming=not args.no_stream)
