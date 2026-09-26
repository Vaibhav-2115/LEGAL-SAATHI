"""
Legal Saathi — Master Legal Dataset Builder
Combines 4 diverse legal data sources into master_indian_legal_dataset.csv:
  1. FULL: Hanno-Labs/legal-retrieval-pairs-v1 (split='train')
     Format: "Query: {query} | Relevant Provision: {positive}"
  2. FULL: KanoonGPT/indian-legal-documents (split='train')
     Format: "Act Title: {document_title} ({document_jurisdiction}). Content: {text}"
  3. STREAMED (125,000 rows): KanoonGPT/indian-case-laws (split='train', streaming=True)
     Format: "Case: {case_title} | Court: {court} | Disposition: {disposition_text}"
  4. AWS S3 Parquet: Supreme Court 2023 Metadata
     URL: https://indian-supreme-court-judgments.s3.amazonaws.com/metadata/parquet/year=2023/metadata.parquet
  5. Cleans nulls, saves to master_indian_legal_dataset.csv, and prints summary counts.
"""

import csv
import io
import os
from pathlib import Path
import sys
import time
import urllib.request

# Configure UTF-8 encoding for Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Suppress Hugging Face symlinks warning on Windows
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_CSV = ROOT_DIR / "master_indian_legal_dataset.csv"

# Buffer size for batch writing
BATCH_SIZE = 5000


def clean_str(val) -> str:
    """Cleans nulls and strips whitespace."""
    if val is None:
        return ""
    s = str(val).strip()
    if s.lower() in ("none", "null", "nan"):
        return ""
    return s


def build_master_dataset(case_law_limit: int = 125000):
    start_time = time.time()
    print("=" * 70)
    print(">> Legal Saathi: Building Master Indian Legal Dataset")
    print(f">> Output File: {OUTPUT_CSV.name}")
    print("=" * 70)

    try:
        from datasets import load_dataset
        import pyarrow.parquet as pq
    except ImportError as e:
        print(f"[ERROR] Required library missing: {e}")
        print("Run: pip install datasets pyarrow")
        return

    counts = {
        "Hanno-Labs/legal-retrieval-pairs-v1": 0,
        "KanoonGPT/indian-legal-documents": 0,
        "KanoonGPT/indian-case-laws": 0,
        "Supreme Court 2023 (AWS S3)": 0,
    }

    # Open CSV file for streaming writes
    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f_out:
        writer = csv.writer(f_out, quoting=csv.QUOTE_MINIMAL)
        writer.writerow(["id", "source", "formatted_content"])

        total_row_id = 0
        buffer = []

        def flush_buffer():
            nonlocal buffer
            if buffer:
                writer.writerows(buffer)
                buffer = []

        # -------------------------------------------------------------
        # 1. FULL DOWNLOAD: Hanno-Labs/legal-retrieval-pairs-v1
        # Format: "Query: {query} | Relevant Provision: {positive}"
        # -------------------------------------------------------------
        src_1 = "Hanno-Labs/legal-retrieval-pairs-v1"
        print(f"\n[1/4] Downloading FULL dataset: '{src_1}'...")
        try:
            ds1 = load_dataset(src_1, split="train")
            for row in ds1:
                query = clean_str(row.get("query"))
                positive = clean_str(row.get("positive"))

                if not query or not positive:
                    continue

                formatted = f"Query: {query} | Relevant Provision: {positive}"
                total_row_id += 1
                counts[src_1] += 1
                buffer.append([total_row_id, src_1, formatted])

                if len(buffer) >= BATCH_SIZE:
                    flush_buffer()

            flush_buffer()
            print(f"      [DONE] Ingested {counts[src_1]:,} rows from {src_1}.")
        except Exception as e:
            print(f"      [ERROR] Failed to ingest {src_1}: {e}")

        # -------------------------------------------------------------
        # 2. FULL DOWNLOAD: KanoonGPT/indian-legal-documents
        # Format: "Act Title: {document_title} ({document_jurisdiction}). Content: {text}"
        # -------------------------------------------------------------
        src_2 = "KanoonGPT/indian-legal-documents"
        print(f"\n[2/4] Downloading FULL dataset: '{src_2}'...")
        try:
            ds2 = load_dataset(src_2, split="train")
            for row in ds2:
                doc_title = clean_str(row.get("document_title"))
                jurisdiction = clean_str(row.get("document_jurisdiction")) or "India"
                text = clean_str(row.get("text"))

                if not doc_title and not text:
                    continue

                formatted = f"Act Title: {doc_title} ({jurisdiction}). Content: {text}"
                total_row_id += 1
                counts[src_2] += 1
                buffer.append([total_row_id, src_2, formatted])

                if len(buffer) >= BATCH_SIZE:
                    flush_buffer()

            flush_buffer()
            print(f"      [DONE] Ingested {counts[src_2]:,} rows from {src_2}.")
        except Exception as e:
            print(f"      [ERROR] Failed to ingest {src_2}: {e}")

        # -------------------------------------------------------------
        # 3. STREAMED SAMPLE (125,000 rows): KanoonGPT/indian-case-laws
        # Format: "Case: {case_title} | Court: {court} | Disposition: {disposition_text}"
        # -------------------------------------------------------------
        src_3 = "KanoonGPT/indian-case-laws"
        print(f"\n[3/4] Streaming {case_law_limit:,} rows from: '{src_3}' (streaming=True)...")
        try:
            ds3 = load_dataset(src_3, split="train", streaming=True)
            for row in ds3:
                case_title = clean_str(row.get("case_title"))
                court = clean_str(row.get("court") or row.get("court_name"))
                disposition = clean_str(row.get("disposition_text"))

                # Fallback if disposition empty
                if not disposition:
                    disposition = "Record on file"

                if not case_title and not court:
                    continue

                formatted = f"Case: {case_title} | Court: {court} | Disposition: {disposition}"
                total_row_id += 1
                counts[src_3] += 1
                buffer.append([total_row_id, src_3, formatted])

                if counts[src_3] % 25000 == 0:
                    print(f"      ...streamed {counts[src_3]:,}/{case_law_limit:,} case laws...")

                if len(buffer) >= BATCH_SIZE:
                    flush_buffer()

                if counts[src_3] >= case_law_limit:
                    break

            flush_buffer()
            print(f"      [DONE] Streamed {counts[src_3]:,} rows from {src_3}.")
        except Exception as e:
            print(f"      [ERROR] Failed to ingest {src_3}: {e}")

        # -------------------------------------------------------------
        # 4. AWS METADATA: Supreme Court 2023 Parquet
        # URL: https://indian-supreme-court-judgments.s3.amazonaws.com/metadata/parquet/year=2023/metadata.parquet
        # -------------------------------------------------------------
        src_4 = "Supreme Court 2023 (AWS S3)"
        s3_url = "https://indian-supreme-court-judgments.s3.amazonaws.com/metadata/parquet/year=2023/metadata.parquet"
        print(f"\n[4/4] Fetching Supreme Court metadata from AWS S3...")
        try:
            req = urllib.request.Request(s3_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req) as resp:
                parquet_bytes = resp.read()

            table = pq.read_table(io.BytesIO(parquet_bytes))
            pydict = table.to_pydict()

            titles = pydict.get("title", [])
            courts = pydict.get("court", [])
            disposals = pydict.get("disposal_nature", [])
            dates = pydict.get("decision_date", [])

            num_records = len(titles)
            for i in range(num_records):
                t = clean_str(titles[i] if i < len(titles) else "")
                c = clean_str(courts[i] if i < len(courts) else "") or "Supreme Court of India"
                d = clean_str(disposals[i] if i < len(disposals) else "")
                dt = clean_str(dates[i] if i < len(dates) else "")

                if not t:
                    continue

                disp_str = d if d else "Disposed"
                if dt:
                    disp_str += f" ({dt})"

                formatted = f"Case: {t} | Court: {c} | Disposition: {disp_str}"
                total_row_id += 1
                counts[src_4] += 1
                buffer.append([total_row_id, src_4, formatted])

                if len(buffer) >= BATCH_SIZE:
                    flush_buffer()

            flush_buffer()
            print(f"      [DONE] Ingested {counts[src_4]:,} rows from AWS S3.")
        except Exception as e:
            print(f"      [ERROR] Failed to ingest {src_4}: {e}")

    elapsed = time.time() - start_time
    file_size_mb = OUTPUT_CSV.stat().st_size / (1024 * 1024)

    # -------------------------------------------------------------
    # 5 & 6. Print Summary Counts
    # -------------------------------------------------------------
    print("\n" + "=" * 70)
    print(">> INGESTION COMPLETE & MASTER DATASET CREATED")
    print("=" * 70)
    print(f"Output File: {OUTPUT_CSV}")
    print(f"File Size:   {file_size_mb:.2f} MB")
    print(f"Time Taken:  {elapsed:.1f} seconds ({elapsed / 60:.1f} minutes)\n")
    print("Total Row Counts Grouped by Source:")
    print("-" * 50)
    grand_total = 0
    for source_name, count in counts.items():
        print(f"  * {source_name:<40}: {count:>8,} rows")
        grand_total += count
    print("-" * 50)
    print(f"  * {'GRAND TOTAL':<40}: {grand_total:>8,} rows")
    print("=" * 70)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Build Master Indian Legal Dataset")
    parser.add_argument("--case-limit", type=int, default=125000, help="Number of case laws to stream (default: 125,000)")
    args = parser.parse_args()

    build_master_dataset(case_law_limit=args.case_limit)
