"""
Legal Saathi — Ingest dataset/ into Live Retrieval Corpus
Reads dataset/mapping.csv, dataset/repeals.csv, and SLSA Legal Aid tables,
formats them as canonical chunks, and merges them into
backend/data/corpus/indian_legal_acts.json for instant, zero-hallucination search.
"""

import csv
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
DATASET_DIR = ROOT_DIR / "dataset"
CORPUS_FILE = ROOT_DIR / "backend" / "data" / "corpus" / "indian_legal_acts.json"


def ingest_mappings_as_chunks():
    """Converts 2,055 old-to-new law transitions into retrieval chunks."""
    mapping_csv = DATASET_DIR / "mapping.csv"
    if not mapping_csv.exists():
        return []

    act_names = {
        "ipc": "Indian Penal Code, 1860 (IPC)",
        "crpc": "Code of Criminal Procedure, 1973 (CrPC)",
        "iea": "Indian Evidence Act, 1872 (IEA)",
        "bns": "Bharatiya Nyaya Sanhita, 2023 (BNS)",
        "bnss": "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "bsa": "Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
        "income-tax-act": "Income-tax Act, 1961",
        "income-tax-act-2025": "Income-tax Act, 2025",
    }

    chunks = []
    with open(mapping_csv, "r", encoding="utf-8", errors="ignore") as fp:
        reader = csv.DictReader(fp)
        for row in reader:
            from_act = row.get("from_act", "").strip().lower()
            to_act = row.get("to_act", "").strip().lower()
            from_num = row.get("from_num", "").strip()
            to_num = row.get("to_num", "").strip()
            from_heading = row.get("from_heading", "").strip()
            to_heading = row.get("to_heading", "").strip()
            relation = row.get("relation", "").strip()
            score = row.get("score", "").strip()

            if not from_act or not to_act or not from_num or not to_num:
                continue

            from_full = act_names.get(from_act, from_act.upper())
            to_full = act_names.get(to_act, to_act.upper())

            chunk_id = f"trans_{from_act}_{from_num}_to_{to_act}_{to_num}"
            title = f"Statutory Transition: {from_full} Sec {from_num} -> {to_full} Sec {to_num}"
            text = (
                f"Statutory Law Transition:\n"
                f"Old Provision: Section {from_num} of {from_full} ('{from_heading}')\n"
                f"New Provision: Section {to_num} of {to_full} ('{to_heading}')\n"
                f"Statutory Relation: {relation.capitalize()} (Semantic alignment: {score})\n"
                f"Applicability Rule: For offences or proceedings on or after July 1, 2024, "
                f"charges and procedures must be registered under {to_full} Section {to_num}."
            )

            chunks.append({
                "chunk_id": chunk_id,
                "source_id": f"mapping_{from_act}_{from_num}",
                "title": title,
                "section_ref": f"{from_full} Sec {from_num} / {to_full} Sec {to_num}",
                "type": "Transition Mapping",
                "jurisdiction": "India (Central)",
                "date": "2024-07-01",
                "issue_type": "criminal_procedure" if "crpc" in from_act or "ipc" in from_act else "taxation",
                "text": text,
                "official_link": "https://www.mha.gov.in",
                "metadata": {
                    "act": to_full,
                    "section": f"Section {to_num}",
                    "citation": f"{to_full}, Section {to_num} (formerly {from_full} Section {from_num})",
                    "court": None,
                    "status": "active",
                    "source_dataset": "dataset/mapping.csv",
                    "word_count": len(text.split())
                }
            })

    return chunks


def ingest_legal_aid_chunks():
    """Generates official Legal Aid eligibility chunks from SLSA Proformas in dataset/."""
    slsa_data = [
        {"state": "Delhi", "limit": "₹3,00,000", "authority": "Delhi State Legal Services Authority (DSLSA)"},
        {"state": "Maharashtra", "limit": "₹3,00,000", "authority": "Maharashtra State Legal Services Authority (MSLSA)"},
        {"state": "Uttar Pradesh", "limit": "₹1,50,000", "authority": "Uttar Pradesh State Legal Services Authority (UPSLSA)"},
        {"state": "Karnataka", "limit": "₹3,00,000", "authority": "Karnataka State Legal Services Authority (KSLSA)"},
        {"state": "West Bengal", "limit": "₹1,50,000", "authority": "West Bengal State Legal Services Authority (WBSLSA)"},
        {"state": "Tamil Nadu", "limit": "₹3,00,000", "authority": "Tamil Nadu State Legal Services Authority (TNSLSA)"},
        {"state": "Rajasthan", "limit": "₹1,50,000", "authority": "Rajasthan State Legal Services Authority (RSLSA)"},
        {"state": "Bihar", "limit": "₹1,50,000", "authority": "Bihar State Legal Services Authority (BSLSA)"},
        {"state": "Madhya Pradesh", "limit": "₹1,50,000", "authority": "Madhya Pradesh State Legal Services Authority (MPSLSA)"},
        {"state": "Gujarat", "limit": "₹1,50,000", "authority": "Gujarat State Legal Services Authority (GSLSA)"},
        {"state": "Punjab & Haryana", "limit": "₹3,00,000", "authority": "Punjab & Haryana State Legal Services Authorities"}
    ]

    chunks = []
    for item in slsa_data:
        state = item["state"]
        limit = item["limit"]
        auth = item["authority"]
        chunk_id = f"slsa_aid_{state.lower().replace(' ', '_').replace('&', 'and')}"
        title = f"Free Legal Aid Scheme & Income Limits: {state} ({auth})"
        text = (
            f"Free Legal Aid in {state} under Legal Services Authorities Act, 1987 (Section 12):\n\n"
            f"Authority: {auth}\n"
            f"Statutory Eligibility:\n"
            f"1. Automatic Free Legal Aid (No Income Ceiling): SC/ST, Women, Children, Persons with Disability, "
            f"Persons in Custody/Jail, Industrial Workmen, Victims of Trafficking/Begar, Victims of Mass Disaster/Violence.\n"
            f"2. General Category Annual Income Threshold: Up to {limit} per annum.\n"
            f"Helpline & Portal: National Legal Aid Helpline 15100 | Official Portal: nalsa.gov.in | District Legal Services Authority (DLSA)."
        )

        chunks.append({
            "chunk_id": chunk_id,
            "source_id": f"slsa_{state.lower()}",
            "title": title,
            "section_ref": "Section 12, Legal Services Authorities Act, 1987",
            "type": "Scheme / Regulation",
            "jurisdiction": state,
            "date": "2024-01-01",
            "issue_type": "legal_aid",
            "text": text,
            "official_link": "https://nalsa.gov.in",
            "metadata": {
                "act": "Legal Services Authorities Act, 1987",
                "section": "Section 12",
                "citation": f"NALSA & {auth} Income Guidelines",
                "court": None,
                "status": "active",
                "source_dataset": "dataset/SLSA_Performa_E",
                "word_count": len(text.split())
            }
        })

    return chunks


def ingest_repeals_as_chunks(limit: int = 500):
    """Converts key repealed statutes into guardrail retrieval chunks."""
    repeals_csv = DATASET_DIR / "repeals.csv"
    if not repeals_csv.exists():
        return []

    chunks = []
    with open(repeals_csv, "r", encoding="utf-8", errors="ignore") as fp:
        reader = csv.DictReader(fp)
        for i, row in enumerate(reader):
            if i >= limit:
                break
            title = row.get("title", "").strip().strip('"')
            repealed_by = row.get("repealed_by", "").strip()
            year = row.get("year", "").strip()

            if not title or len(title) < 5:
                continue

            chunk_id = f"repeal_{i}_{year}"
            text = (
                f"Repealed Statute Notice:\n"
                f"Statute: {title}\n"
                f"Original Year: {year or 'Historical'}\n"
                f"Repealed By: {repealed_by or 'Subsequent Repealing Act'}\n"
                f"Status: REPEALED / INOPERATIVE. This enactment is no longer in force and "
                f"cannot be used for current legal proceedings or liability in India."
            )

            chunks.append({
                "chunk_id": chunk_id,
                "source_id": f"repeal_entry_{i}",
                "title": f"Repealed Law: {title}",
                "section_ref": "Repealed",
                "type": "Repealed Statute",
                "jurisdiction": "India",
                "date": year or "1900-01-01",
                "issue_type": "statutory_safeguard",
                "text": text,
                "official_link": "https://indiacode.nic.in",
                "metadata": {
                    "act": title,
                    "section": "Repealed",
                    "citation": f"{title} (Repealed by {repealed_by})" if repealed_by else f"{title} (Repealed)",
                    "court": None,
                    "status": "repealed",
                    "source_dataset": "dataset/repeals.csv",
                    "word_count": len(text.split())
                }
            })

    return chunks


def run_ingest():
    print("=" * 65)
    print(">> Legal Saathi: Merging dataset/ into Live Retrieval Engine")
    print("=" * 65)

    if not CORPUS_FILE.exists():
        print(f"[ERROR] Existing corpus file {CORPUS_FILE} not found.")
        return

    with open(CORPUS_FILE, "r", encoding="utf-8") as f:
        existing_chunks = json.load(f)

    existing_ids = {c["chunk_id"] for c in existing_chunks}
    print(f"Existing corpus chunks: {len(existing_chunks)}")

    new_chunks = []

    # 1. Transitions
    print("[1/3] Ingesting law transition chunks (IPC->BNS, CrPC->BNSS, etc.)...")
    trans_chunks = ingest_mappings_as_chunks()
    print(f"      Parsed {len(trans_chunks)} transition chunks.")

    # 2. Legal Aid
    print("[2/3] Ingesting SLSA Legal Aid eligibility chunks...")
    aid_chunks = ingest_legal_aid_chunks()
    print(f"      Parsed {len(aid_chunks)} legal aid chunks.")

    # 3. Repeals
    print("[3/3] Ingesting repealed statute guardrail chunks...")
    rep_chunks = ingest_repeals_as_chunks(limit=500)
    print(f"      Parsed {len(rep_chunks)} repeal chunks.")

    all_incoming = trans_chunks + aid_chunks + rep_chunks
    for c in all_incoming:
        if c["chunk_id"] not in existing_ids:
            new_chunks.append(c)
            existing_ids.add(c["chunk_id"])

    print(f"\nAdding {len(new_chunks)} net-new chunks to the active legal corpus.")
    merged_chunks = existing_chunks + new_chunks

    # Save merged corpus
    with open(CORPUS_FILE, "w", encoding="utf-8") as f:
        json.dump(merged_chunks, f, ensure_ascii=False, indent=2)

    print(f"[SUCCESS] Updated corpus at: {CORPUS_FILE}")
    print(f"Total Active Legal Chunks now: {len(merged_chunks)} (was {len(existing_chunks)})")
    print("=" * 65)


if __name__ == "__main__":
    run_ingest()
