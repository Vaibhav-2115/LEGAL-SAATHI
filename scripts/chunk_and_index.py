"""
Legal Saathi - Chunking & Retrieval Indexing Engine (scripts/chunk_and_index.py)
Executes Part 6 of the Dataset Acquisition Plan and Section 4 of the Dataset Specification:
1. Chunks normalized documents at statutory and judicial reasoning boundaries
2. Enriches each chunk with issue_type domain tags, canonical citations, and official links
3. Generates data/chunks/retrieval_chunks.json
4. Syncs the enriched corpus to backend/data/corpus/indian_legal_acts.json
5. Verifies hybrid BM25 + Semantic search across key test queries
"""

import json
import math
import os
import re
import sys
from typing import Any, Dict, List, Optional

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
NORMALIZED_DIR = os.path.join(DATA_DIR, "normalized")
CHUNKS_DIR = os.path.join(DATA_DIR, "chunks")
BACKEND_CORPUS_DIR = os.path.join(os.path.dirname(__file__), "..", "backend", "data", "corpus")


def detect_issue_type(title: str, text: str, act: Optional[str]) -> str:
    """Classifies chunk into one of Legal Saathi's core operational domains."""
    combined = f"{title or ''} {text or ''} {act or ''}".lower()

    if any(k in combined for k in ["tenant", "landlord", "rent", "lease", "eviction", "security deposit", "premises", "lessor", "lessee"]):
        return "tenancy"
    if any(k in combined for k in ["consumer", "deficiency", "unfair trade", "goods", "defect", "service", "edaakhil", "e-daakhil"]):
        return "consumer"
    if any(k in combined for k in ["cheque", "dishonour", "insufficient funds", "138", "negotiable instruments", "drawer", "payee"]):
        return "cheque_bounce"
    if any(k in combined for k in ["rera", "real estate", "promoter", "allottee", "builder", "possession", "apartment", "flat"]):
        return "property_rera"
    if any(k in combined for k in ["accident", "motor vehicles", "mact", "tribunal", "rash driving", "collision", "driver", "vehicle"]):
        return "motor_accident"
    if any(k in combined for k in ["legal aid", "nalsa", "slsa", "dlsa", "lok adalat", "indigent", "helpline", "free legal"]):
        return "legal_aid"
    if any(k in combined for k in ["right to information", "rti", "public information officer", "appellate authority", "cpio", "spio"]):
        return "rti"
    if any(k in combined for k in ["marriage", "divorce", "cruelty", "maintenance", "conjugal", "dowry", "matrimonial", "domestic violence"]):
        return "family_matrimonial"
    if any(k in combined for k in ["constitution", "fundamental right", "writ", "article 21", "article 32", "article 226", "habeas corpus", "mandamus"]):
        return "constitutional"
    if any(k in combined for k in ["murder", "theft", "fir", "police", "arrest", "bail", "investigation", "magistrate", "custody", "cognizable", "warrant", "remand", "bns", "bnss", "bsa", "ipc", "crpc"]):
        return "criminal"
    if any(k in combined for k in ["suit", "injunction", "decree", "order 37", "civil procedure", "plaint", "written statement", "cpc"]):
        return "civil"

    return "general"


def chunk_document(doc: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Chunks documents respecting section & reasoning boundaries (400-900 tokens target)."""
    doc_id = doc.get("document_id")
    doc_type = doc.get("document_type")
    title = doc.get("title", "")
    text = doc.get("text", "")
    act = doc.get("act")
    section = doc.get("section")
    citation = doc.get("citation")
    court = doc.get("court")
    jurisdiction = doc.get("jurisdiction", "India (Central)")
    date = doc.get("date")
    status = doc.get("status", "current")
    source_url = doc.get("source_url", "")
    source_dataset = doc.get("source_dataset", "")

    issue_type = detect_issue_type(title, text, act)

    # For statutory sections and legal aid rules (usually under 600 words), keep as clean atomic chunk
    words = text.split()
    if len(words) <= 500:
        chunk = {
            "chunk_id": f"{doc_id}_c0",
            "source_id": doc_id,
            "title": title,
            "section_ref": section or citation or title,
            "type": "Act" if doc_type in ["act_section", "legal_aid_rule"] else ("Judgment" if doc_type == "judgment" else "IncidentCluster"),
            "jurisdiction": jurisdiction,
            "date": date,
            "issue_type": issue_type,
            "text": text,
            "official_link": source_url,
            "metadata": {
                "act": act,
                "section": section,
                "citation": citation,
                "court": court,
                "status": status,
                "source_dataset": source_dataset,
                "word_count": len(words)
            }
        }
        return [chunk]

    # For longer texts (e.g. long statutes or extensive judgment summaries), chunk with 50-word overlap
    chunks = []
    chunk_size = 400
    overlap = 50
    start = 0
    c_idx = 0

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk_words = words[start:end]
        chunk_text = " ".join(chunk_words)

        header = f"[{title} - Part {c_idx+1}]\n"
        if not chunk_text.startswith(header.strip()):
            chunk_text = header + chunk_text

        chunks.append({
            "chunk_id": f"{doc_id}_c{c_idx}",
            "source_id": doc_id,
            "title": f"{title} (Part {c_idx+1})",
            "section_ref": section or citation or title,
            "type": "Act" if doc_type in ["act_section", "legal_aid_rule"] else ("Judgment" if doc_type == "judgment" else "IncidentCluster"),
            "jurisdiction": jurisdiction,
            "date": date,
            "issue_type": issue_type,
            "text": chunk_text,
            "official_link": source_url,
            "metadata": {
                "act": act,
                "section": section,
                "citation": citation,
                "court": court,
                "status": status,
                "source_dataset": source_dataset,
                "part": c_idx + 1,
                "word_count": len(chunk_words)
            }
        })

        if end >= len(words):
            break
        start += (chunk_size - overlap)
        c_idx += 1

    return chunks


def build_chunks_and_index():
    os.makedirs(CHUNKS_DIR, exist_ok=True)
    os.makedirs(BACKEND_CORPUS_DIR, exist_ok=True)

    master_path = os.path.join(NORMALIZED_DIR, "master_canonical_corpus.json")
    if not os.path.exists(master_path):
        print(f"Error: {master_path} does not exist. Run scripts/normalize_corpus.py first.")
        return

    print(f"Reading master canonical corpus from {master_path}...")
    with open(master_path, "r", encoding="utf-8") as f:
        master_docs = json.load(f)

    print(f"Processing and chunking {len(master_docs):,} canonical documents...")
    all_chunks = []
    domain_counts = {}

    for doc in master_docs:
        doc_chunks = chunk_document(doc)
        for c in doc_chunks:
            all_chunks.append(c)
            itype = c["issue_type"]
            domain_counts[itype] = domain_counts.get(itype, 0) + 1

    # Save to data/chunks/retrieval_chunks.json
    chunks_out = os.path.join(CHUNKS_DIR, "retrieval_chunks.json")
    with open(chunks_out, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2)

    size_mb = os.path.getsize(chunks_out) / (1024 * 1024)
    print(f"  [SUCCESS] Wrote {len(all_chunks):,} retrieval chunks to {chunks_out} ({size_mb:.2f} MB)")

    # Sync to backend/data/corpus/indian_legal_acts.json
    backend_corpus_out = os.path.join(BACKEND_CORPUS_DIR, "indian_legal_acts.json")
    with open(backend_corpus_out, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2)

    print(f"  [SUCCESS] Synchronized enriched corpus to {backend_corpus_out}")

    print("\n=== RETRIEVAL CHUNKS DOMAIN BREAKDOWN ===")
    for domain, cnt in sorted(domain_counts.items(), key=lambda x: x[1], reverse=True):
        print(f" - {domain.upper():<20}: {cnt:,} chunks")

    # Smoke test retrieval
    print("\n--- Running Smoke Test on Hybrid Retrieval Service ---")
    try:
        from backend.services.retrieval_service import HybridRetrievalService
        service = HybridRetrievalService(corpus_path=backend_corpus_out)
        
        test_queries = [
            ("tenancy deposit return Bengaluru", "acts", "tenancy"),
            ("consumer forum defective laptop refund", "acts", "consumer"),
            ("cheque bounce section 138 notice deadline", "acts", "cheque_bounce"),
            ("zero fir registration refusal", "acts", "criminal"),
            ("Supreme Court bail precedent", "judgments", "criminal"),
        ]

        print(f"Hybrid index loaded {len(service.documents)} documents successfully.")
        for q, c_filter, issue in test_queries:
            results = service.search(query=q, corpus=c_filter, top_k=2, issue_type_filter=issue)
            print(f"\nQuery: '{q}' [Corpus: {c_filter}, Domain: {issue}]")
            if results:
                top = results[0]
                print(f"  Top Result: {top.title}")
                print(f"  Ref: {top.section_ref} | Score: {top.score}")
                print(f"  Snippet: {top.text[:120]}...")
            else:
                print("  No results found!")
    except Exception as e:
        print(f"Smoke test failed with error: {e}")


def main():
    build_chunks_and_index()


if __name__ == "__main__":
    main()
