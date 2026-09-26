"""
Legal Saathi - Master Indian Legal Dataset Downloader & Compiler
Memory-safe streaming compiler for 4 major Indian legal sources:
1. KanoonGPT/indian-case-laws (150,000 rows streamed)
2. KanoonGPT/indian-legal-documents (10,000 rows streamed)
3. Hanno-Labs/legal-retrieval-pairs-v1 (10,000 rows from split='train[:10000]')
4. Supreme Court Open Data Metadata (5,000 rows fetched from AWS S3 parquet)

Standardized Columns: ['doc_id', 'source', 'text']
Output Destination: download_dataset/master_indian_legal_dataset.csv
"""

import argparse
import csv
import io
import os
from pathlib import Path
import sys
import time
import urllib.request

# Ensure UTF-8 on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Suppress Hugging Face symlink warnings on Windows
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_DIR = PROJECT_ROOT / "download_dataset"
OUTPUT_CSV = OUTPUT_DIR / "master_indian_legal_dataset.csv"

CHUNK_SIZE = 25000


def clean_text(val) -> str:
    """Strips whitespace and normalizes null values."""
    if val is None:
        return ""
    s = str(val).strip()
    if s.lower() in ("none", "null", "nan"):
        return ""
    return s


def append_chunk_to_csv(writer, f_out, chunk):
    """Writes chunk rows to disk and immediately flushes buffer to keep RAM < 500MB."""
    if not chunk:
        return
    writer.writerows(chunk)
    f_out.flush()
    chunk.clear()


def build_master_dataset(
    case_limit: int = 150000,
    docs_limit: int = 10000,
    hanno_limit: int = 10000,
    sc_limit: int = 5000,
    chunk_size: int = 25000,
):
    start_time = time.time()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 70)
    print(">> Legal Saathi: Compiling Master Indian Legal Dataset")
    print(f">> Output File : {OUTPUT_CSV.resolve()}")
    print(f">> Target Rows : Case Laws={case_limit:,} | Docs={docs_limit:,} | Hanno={hanno_limit:,} | SC={sc_limit:,}")
    print(f">> Chunk Size  : {chunk_size:,} rows (Memory-safe flushing)")
    print("=" * 70)

    try:
        from datasets import load_dataset
        import pyarrow.parquet as pq
    except ImportError as e:
        print(f"[ERROR] Required dependencies missing: {e}")
        print("Please install via: pip install datasets pyarrow requests")
        return

    counts = {
        "KanoonGPT/indian-case-laws": 0,
        "KanoonGPT/indian-legal-documents": 0,
        "Hanno-Labs/legal-retrieval-pairs-v1": 0,
        "Supreme-Court-Open-Data": 0,
    }

    chunk = []
    total_written = 0

    with open(OUTPUT_CSV, mode="w", newline="", encoding="utf-8") as f_out:
        writer = csv.writer(f_out, quoting=csv.QUOTE_MINIMAL)
        # Standardized 3-column header
        writer.writerow(["doc_id", "source", "text"])

        # =====================================================================
        # SOURCE 1: KanoonGPT/indian-case-laws (Streaming 150k rows)
        # Format: "Case: {case_title} | Court: {court_name} | Disposition: {disposition_text[:1200]}"
        # =====================================================================
        src_case = "KanoonGPT/indian-case-laws"
        print(f"\n[Source 1/4] Streaming {case_limit:,} rows from '{src_case}' (streaming=True)...")
        case_start = time.time()
        try:
            ds_cases = load_dataset(src_case, split="train", streaming=True)
            for row in ds_cases:
                case_title = clean_text(row.get("case_title") or row.get("party_caption"))
                court_name = clean_text(row.get("court_name") or row.get("court")) or "High Court / District Court"
                disposition = clean_text(row.get("disposition_text") or row.get("disposition")) or "Disposed"

                # Truncate disposition text to 1,200 characters per specification
                disp_truncated = disposition[:1200]
                text_formatted = f"Case: {case_title} | Court: {court_name} | Disposition: {disp_truncated}"

                raw_id = row.get("id") or row.get("case_metadata_id")
                doc_id = str(raw_id) if raw_id else f"case_{counts[src_case] + 1}"

                chunk.append([doc_id, src_case, text_formatted])
                counts[src_case] += 1
                total_written += 1

                # Flush and log progress every 25,000 rows
                if len(chunk) >= chunk_size:
                    append_chunk_to_csv(writer, f_out, chunk)
                    elapsed_chunk = time.time() - case_start
                    rate = counts[src_case] / elapsed_chunk if elapsed_chunk > 0 else 0
                    print(f"  [Progress] Appended {counts[src_case]:,} / {case_limit:,} rows to CSV ({rate:.1f} rows/s)...")

                if counts[src_case] >= case_limit:
                    break

            if chunk:
                append_chunk_to_csv(writer, f_out, chunk)

            print(f"  -> Finished {src_case}: {counts[src_case]:,} rows in {time.time() - case_start:.1f}s")
        except Exception as e:
            print(f"  [ERROR] Streaming {src_case}: {e}")
            if chunk:
                append_chunk_to_csv(writer, f_out, chunk)

        # =====================================================================
        # SOURCE 2: KanoonGPT/indian-legal-documents (Streaming 10k rows)
        # Format: "Act Title: {document_title} ({document_jurisdiction}). Content: {text[:1500]}"
        # =====================================================================
        src_docs = "KanoonGPT/indian-legal-documents"
        print(f"\n[Source 2/4] Streaming {docs_limit:,} rows from '{src_docs}' (streaming=True)...")
        docs_start = time.time()
        try:
            ds_docs = load_dataset(src_docs, split="train", streaming=True)
            for row in ds_docs:
                doc_title = clean_text(row.get("document_title"))
                jurisdiction = clean_text(row.get("document_jurisdiction")) or "India"
                raw_text = clean_text(row.get("text"))

                # Truncate content text to 1,500 characters per specification
                content_truncated = raw_text[:1500]
                text_formatted = f"Act Title: {doc_title} ({jurisdiction}). Content: {content_truncated}"

                raw_id = row.get("doc_id")
                doc_id = str(raw_id) if raw_id else f"doc_{counts[src_docs] + 1}"

                chunk.append([doc_id, src_docs, text_formatted])
                counts[src_docs] += 1
                total_written += 1

                if len(chunk) >= chunk_size:
                    append_chunk_to_csv(writer, f_out, chunk)
                    print(f"  [Progress] Appended {total_written:,} total rows to CSV...")

                if counts[src_docs] >= docs_limit:
                    break

            if chunk:
                append_chunk_to_csv(writer, f_out, chunk)

            print(f"  -> Finished {src_docs}: {counts[src_docs]:,} rows in {time.time() - docs_start:.1f}s")
        except Exception as e:
            print(f"  [ERROR] Streaming {src_docs}: {e}")
            if chunk:
                append_chunk_to_csv(writer, f_out, chunk)

        # =====================================================================
        # SOURCE 3: Hanno-Labs/legal-retrieval-pairs-v1 (split='train[:10000]')
        # Format: "Query: {query} | Relevant Provision: {positive[:1500]}"
        # =====================================================================
        src_hanno = "Hanno-Labs/legal-retrieval-pairs-v1"
        print(f"\n[Source 3/4] Loading {hanno_limit:,} rows from '{src_hanno}' (split='train[:{hanno_limit}]')...")
        hanno_start = time.time()
        try:
            ds_hanno = load_dataset(src_hanno, split=f"train[:{hanno_limit}]")
            for idx, row in enumerate(ds_hanno):
                query = clean_text(row.get("query"))
                positive = clean_text(row.get("positive"))

                # Truncate provision text to 1,500 characters per specification
                positive_truncated = positive[:1500]
                text_formatted = f"Query: {query} | Relevant Provision: {positive_truncated}"
                doc_id = f"hanno_{idx + 1}"

                chunk.append([doc_id, src_hanno, text_formatted])
                counts[src_hanno] += 1
                total_written += 1

                if len(chunk) >= chunk_size:
                    append_chunk_to_csv(writer, f_out, chunk)
                    print(f"  [Progress] Appended {total_written:,} total rows to CSV...")

            if chunk:
                append_chunk_to_csv(writer, f_out, chunk)

            print(f"  -> Finished {src_hanno}: {counts[src_hanno]:,} rows in {time.time() - hanno_start:.1f}s")
        except Exception as e:
            print(f"  [ERROR] Loading {src_hanno}: {e}")
            if chunk:
                append_chunk_to_csv(writer, f_out, chunk)

        # =====================================================================
        # SOURCE 4: Supreme Court Metadata (5,000 rows from AWS S3 parquet)
        # Format: "Case: {case_title} | Court: {court} | Disposition: {disposition[:1200]}"
        # Starting with year=2023, expanding across prior years if needed to reach 5,000
        # =====================================================================
        src_sc = "Supreme-Court-Open-Data"
        print(f"\n[Source 4/4] Fetching {sc_limit:,} metadata rows from Supreme Court AWS S3...")
        sc_start = time.time()
        sc_years = [2023, 2022, 2021, 2020, 2019, 2018, 2017]
        try:
            for year in sc_years:
                if counts[src_sc] >= sc_limit:
                    break

                parquet_url = f"https://indian-supreme-court-judgments.s3.amazonaws.com/metadata/parquet/year={year}/metadata.parquet"
                local_cache = PROJECT_ROOT / "data" / "raw" / "judgments" / f"sc_metadata_{year}.parquet"

                table = None
                if local_cache.exists() and local_cache.stat().st_size > 0:
                    table = pq.read_table(local_cache)
                else:
                    req = urllib.request.Request(parquet_url, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=30) as resp:
                        table = pq.read_table(io.BytesIO(resp.read()))

                if table is None:
                    continue

                pydict = table.to_pydict()
                titles = pydict.get("title", [])
                courts = pydict.get("court", [])
                disposals = pydict.get("disposal_nature", [])
                case_ids = pydict.get("case_id", [])
                cnrs = pydict.get("cnr", [])
                petitioners = pydict.get("petitioner", [])
                respondents = pydict.get("respondent", [])

                num_rows = len(titles)
                for i in range(num_rows):
                    if counts[src_sc] >= sc_limit:
                        break

                    t = clean_text(titles[i] if i < len(titles) else "")
                    if not t:
                        p = clean_text(petitioners[i] if i < len(petitioners) else "")
                        r = clean_text(respondents[i] if i < len(respondents) else "")
                        t = f"{p} vs {r}" if (p or r) else f"SC Matter {year}-{i+1}"

                    c = clean_text(courts[i] if i < len(courts) else "") or "Supreme Court of India"
                    d = clean_text(disposals[i] if i < len(disposals) else "") or "Disposed"

                    # Truncate disposition to 1,200 characters per specification
                    d_truncated = d[:1200]
                    text_formatted = f"Case: {t} | Court: {c} | Disposition: {d_truncated}"

                    cid = clean_text(case_ids[i] if i < len(case_ids) else "")
                    cnr = clean_text(cnrs[i] if i < len(cnrs) else "")
                    doc_id = cid or cnr or f"sc_{year}_{i+1}"

                    chunk.append([doc_id, src_sc, text_formatted])
                    counts[src_sc] += 1
                    total_written += 1

                    if len(chunk) >= chunk_size:
                        append_chunk_to_csv(writer, f_out, chunk)
                        print(f"  [Progress] Appended {total_written:,} total rows to CSV...")

            if chunk:
                append_chunk_to_csv(writer, f_out, chunk)

            print(f"  -> Finished {src_sc}: {counts[src_sc]:,} rows in {time.time() - sc_start:.1f}s")
        except Exception as e:
            print(f"  [ERROR] Fetching {src_sc}: {e}")
            if chunk:
                append_chunk_to_csv(writer, f_out, chunk)

    elapsed_total = time.time() - start_time
    file_size_mb = OUTPUT_CSV.stat().st_size / (1024 * 1024)
    grand_total = sum(counts.values())

    print("\n" + "=" * 70)
    print(">> COMPILATION COMPLETE: MASTER INDIAN LEGAL DATASET")
    print("=" * 70)
    print(f"  Output Path  : {OUTPUT_CSV.resolve()}")
    print(f"  File Size    : {file_size_mb:.2f} MB")
    print(f"  Total Rows   : {grand_total:,}")
    print(f"  Elapsed Time : {elapsed_total:.1f}s ({elapsed_total / 60:.2f} min)")
    print("-" * 70)
    for source_name, count in counts.items():
        print(f"  * {source_name:<40}: {count:>10,} rows")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Compile Indian Legal Dataset with Memory-Safe Streaming")
    parser.add_argument("--case-limit", type=int, default=150000, help="Number of case law rows to stream (default: 150000)")
    parser.add_argument("--docs-limit", type=int, default=10000, help="Number of legal document rows to stream (default: 10000)")
    parser.add_argument("--hanno-limit", type=int, default=10000, help="Number of hanno rows to load (default: 10000)")
    parser.add_argument("--sc-limit", type=int, default=5000, help="Number of Supreme Court metadata rows (default: 5000)")
    parser.add_argument("--chunk-size", type=int, default=25000, help="Rows per memory chunk write (default: 25000)")
    args = parser.parse_args()

    build_master_dataset(
        case_limit=args.case_limit,
        docs_limit=args.docs_limit,
        hanno_limit=args.hanno_limit,
        sc_limit=args.sc_limit,
        chunk_size=args.chunk_size,
    )
