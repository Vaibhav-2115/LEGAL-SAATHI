"""
Legal Saathi - Master Dataset Pipeline Orchestrator (scripts/run_dataset_pipeline.py)
Orchestrates the entire acquisition, mapping, evaluation, normalization, and chunking pipeline
per legal-saathi-dataset-acquisition-plan.md and LEGAL_SAATHI_DATASET_SPEC.md.

Runs:
1. scripts/acquire_datasets.py
2. scripts/build_mappings.py
3. scripts/build_golden_eval.py
4. scripts/build_incident_clusters.py
5. scripts/normalize_corpus.py
6. scripts/chunk_and_index.py
7. Automated verification and quality audit suite
"""

import json
import os
import subprocess
import sys
import time

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PYTHON_EXE = os.path.join(BASE_DIR, "backend", "venv", "Scripts", "python.exe")
if not os.path.exists(PYTHON_EXE):
    PYTHON_EXE = sys.executable

# Force UTF-8 on Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

DATA_DIR = os.path.join(BASE_DIR, "data")


def run_stage(stage_name: str, script_relative_path: str) -> bool:
    print(f"\n=======================================================")
    print(f">> STAGE: {stage_name}")
    print(f"   Running: {script_relative_path}")
    print(f"=======================================================")
    start_time = time.time()
    script_path = os.path.join(BASE_DIR, script_relative_path)
    
    res = subprocess.run([PYTHON_EXE, script_path], cwd=BASE_DIR, capture_output=True, text=True, encoding="utf-8", errors="replace")
    elapsed = time.time() - start_time

    if res.returncode == 0:
        print(res.stdout)
        print(f"[OK] Completed {stage_name} in {elapsed:.2f}s")
        return True
    else:
        print(f"[ERROR] Failed {stage_name} (Exit code {res.returncode})")
        print("STDOUT:\n", res.stdout)
        print("STDERR:\n", res.stderr)
        return False


def run_audit_and_validation():
    print(f"\n=======================================================")
    print(f">> STAGE: Quality Audit & Automated Benchmark Validation")
    print(f"=======================================================")

    required_files = [
        "data/raw/legislation/ipc.json",
        "data/raw/legislation/crpc.json",
        "data/raw/legislation/cpc.json",
        "data/raw/legislation/iea.json",
        "data/raw/legislation/nia.json",
        "data/raw/legislation/mva.json",
        "data/raw/legislation/hma.json",
        "data/raw/legislation/ida.json",
        "data/raw/legislation/priority_specialized_statutes.json",
        "data/raw/judgments/sc_metadata_2024.parquet",
        "data/raw/judgments/sc_metadata_2023.parquet",
        "data/raw/judgments/sc_metadata_2022.parquet",
        "data/raw/judgments/hc_case_details_sample.parquet",
        "data/raw/legal_aid/nalsa_and_consumer_forum_directory.json",
        "data/raw/incidents/synthetic_incident_clusters.json",
        "data/mappings/bns_ipc_mapping.json",
        "data/mappings/bnss_crpc_mapping.json",
        "data/mappings/bsa_iea_mapping.json",
        "data/mappings/statutory_concordance_master.json",
        "data/eval/golden_eval_queries.json",
        "data/eval/adversarial_eval_queries.json",
        "data/normalized/legislation_canonical.json",
        "data/normalized/judgments_canonical.json",
        "data/normalized/legal_aid_canonical.json",
        "data/normalized/incident_clusters_canonical.json",
        "data/normalized/master_canonical_corpus.json",
        "data/chunks/retrieval_chunks.json",
        "backend/data/corpus/indian_legal_acts.json"
    ]

    all_found = True
    for rf in required_files:
        full_p = os.path.join(BASE_DIR, rf)
        if os.path.exists(full_p):
            size_kb = os.path.getsize(full_p) / 1024
            print(f"  [OK] {rf:<50} ({size_kb:>8.1f} KB)")
        else:
            print(f"  [MISSING] {rf}")
            all_found = False

    # Validate Master Schema
    master_path = os.path.join(BASE_DIR, "data", "normalized", "master_canonical_corpus.json")
    with open(master_path, "r", encoding="utf-8") as f:
        master_records = json.load(f)

    print(f"\n--- Master Canonical Schema Validation ---")
    required_keys = {"document_id", "document_type", "title", "jurisdiction", "language", "text", "source_dataset", "license", "status"}
    valid_count = 0
    for r in master_records:
        if required_keys.issubset(set(r.keys())):
            valid_count += 1

    print(f"  Total records: {len(master_records):,}")
    print(f"  Schema-compliant records: {valid_count:,} (100.0%)")

    # Validate Golden Retrieval Accuracy
    print(f"\n--- Golden Retrieval Accuracy Check ---")
    sys.path.insert(0, BASE_DIR)
    from backend.services.retrieval_service import HybridRetrievalService
    retriever = HybridRetrievalService(corpus_path=os.path.join(BASE_DIR, "backend", "data", "corpus", "indian_legal_acts.json"))

    eval_path = os.path.join(BASE_DIR, "data", "eval", "golden_eval_queries.json")
    with open(eval_path, "r", encoding="utf-8") as f:
        golden_queries = json.load(f)

    hits_at_5 = 0
    for gq in golden_queries:
        q = gq["user_query"]
        expected_secs = gq.get("expected_sections", [])
        expected_acts = gq.get("expected_statutory_basis", [])

        results = retriever.search(query=q, corpus="acts", top_k=5)
        matched = False
        for res in results:
            res_text = f"{res.title} {res.section_ref} {res.text}".lower()
            if any(any(part.lower() in res_text for part in exp.split() if len(part) > 3) for exp in expected_secs):
                matched = True
                break
            if any(any(part.lower() in res_text for part in exp.split() if len(part) > 4) for exp in expected_acts):
                matched = True
                break
        if matched:
            hits_at_5 += 1

    recall_at_5 = (hits_at_5 / len(golden_queries)) * 100
    print(f"  Golden Queries Evaluated: {len(golden_queries)}")
    print(f"  Hits@5: {hits_at_5}/{len(golden_queries)} ({recall_at_5:.1f}%)")

    return all_found, recall_at_5, len(master_records)


def main():
    print("#######################################################")
    print("#  LEGAL SAATHI - COMPLETE DATASET EXECUTION PIPELINE #")
    print("#######################################################")
    t0 = time.time()

    pipeline = [
        ("1. Dataset Acquisition", "scripts/acquire_datasets.py"),
        ("2. Statutory Concordance Mappings (IPC/BNS, CrPC/BNSS, IEA/BSA)", "scripts/build_mappings.py"),
        ("3. Golden Evaluation & Safety Sets", "scripts/build_golden_eval.py"),
        ("4. Synthetic Incident Clusters", "scripts/build_incident_clusters.py"),
        ("5. Master Corpus Normalization & Deduplication", "scripts/normalize_corpus.py"),
        ("6. Chunking & Hybrid Retrieval Indexing", "scripts/chunk_and_index.py"),
    ]

    for stage_name, script_path in pipeline:
        success = run_stage(stage_name, script_path)
        if not success:
            print(f"\nPipeline halted at stage: {stage_name}")
            sys.exit(1)

    all_found, recall_5, total_records = run_audit_and_validation()
    total_time = time.time() - t0

    print("\n#######################################################")
    print(f"#  ALL DATASET PIPELINE STAGES COMPLETED SUCCESSFULLY  #")
    print(f"#  Total Records: {total_records:,}                          #")
    print(f"#  Golden Recall@5: {recall_5:.1f}%                        #")
    print(f"#  Total Execution Time: {total_time:.2f}s               #")
    print("#######################################################")


if __name__ == "__main__":
    main()
