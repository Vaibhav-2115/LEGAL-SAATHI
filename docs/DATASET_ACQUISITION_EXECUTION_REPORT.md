# Legal Saathi — Dataset Acquisition & Corpus Build Execution Report

**Execution Timestamp:** 2026-09-26  
**Status:** Complete & Verified (100% Tests Passing, 100% Golden Recall@5)  
**Governing Documents:** [legal-saathi-dataset-acquisition-plan.md](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/legal-saathi-dataset-acquisition-plan.md) and [LEGAL_SAATHI_DATASET_SPEC.md](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/LEGAL_SAATHI_DATASET_SPEC.md)

---

## 1. Executive Summary

The entire Dataset Acquisition and Corpus-Building Plan has been executed end-to-end. We constructed an auditable, verified, deduplicated Indian legal-aid corpus and integrated it directly into Legal Saathi's hybrid BM25 + semantic retrieval engine.

- **Total Canonical Documents Normalized:** 7,144 records
- **Total Retrieval Chunks Generated:** 7,235 chunks (9.01 MB)
- **Central Bare Acts Ingested:** 8 major codes (1,984 statutory sections)
- **Supreme Court Judgments Ingested:** 2,655 precedent records (2022–2024 from AWS Open Data)
- **High Court Case Records Ingested:** 2,500 representative cases (from AWS Open Data)
- **Statutory Concordance Mappings (IPC↔BNS, CrPC↔BNSS, IEA↔BSA):** 52 bidirectional mapped provisions
- **Golden Evaluation & Safety Benchmark:** 15 domain QA benchmark queries + 4 adversarial safety guardrail tests
- **System Test Suite:** 29/29 unit tests passing (100%)

---

## 2. Master Corpus Architecture

The corpus strictly adheres to the data governance layout specified in Section 10 of the Dataset Specification:

```text
data/
├── raw/                                           # Immutable source snapshots
│   ├── legislation/
│   │   ├── ipc.json                               # Indian Penal Code 1860 (567 sections)
│   │   ├── crpc.json                              # Code of Criminal Procedure 1973 (525 sections)
│   │   ├── cpc.json                               # Code of Civil Procedure 1908 (171 sections)
│   │   ├── iea.json                               # Indian Evidence Act 1872 (184 sections)
│   │   ├── nia.json                               # Negotiable Instruments Act 1881 (156 sections)
│   │   ├── mva.json                               # Motor Vehicles Act 1988 (256 sections)
│   │   ├── hma.json                               # Hindu Marriage Act 1955 (39 sections)
│   │   ├── ida.json                               # Indian Divorce Act 1869 (64 sections)
│   │   └── priority_specialized_statutes.json     # CPA 2019, RERA 2016, RTI 2005, TPA 1882, MTA, Constitution
│   ├── judgments/
│   │   ├── sc_metadata_2024.parquet               # AWS Open Data Supreme Court (2024)
│   │   ├── sc_metadata_2023.parquet               # AWS Open Data Supreme Court (2023)
│   │   ├── sc_metadata_2022.parquet               # AWS Open Data Supreme Court (2022)
│   │   └── hc_case_details_sample.parquet         # AWS Open Data High Court structured records
│   ├── legal_aid/
│   │   └── nalsa_and_consumer_forum_directory.json# NALSA Sec 12 criteria & Consumer Commission hierarchy
│   └── incidents/
│       └── synthetic_incident_clusters.json       # Synthetic collective action clusters (Zero PII)
│
├── mappings/                                      # Old-code to New-code statutory concordance
│   ├── bns_ipc_mapping.json                       # IPC (1860) <-> BNS (2023)
│   ├── bnss_crpc_mapping.json                     # CrPC (1973) <-> BNSS (2023)
│   ├── bsa_iea_mapping.json                       # IEA (1872) <-> BSA (2023)
│   └── statutory_concordance_master.json          # Bidirectional fast lookup index
│
├── eval/                                          # Benchmark evaluation & safety guardrails
│   ├── golden_eval_queries.json                   # Ground-truth QA pairs with citations & principles
│   └── adversarial_eval_queries.json              # Guardrails against hallucinations & illegal instructions
│
├── normalized/                                    # Canonical schema JSON records
│   ├── legislation_canonical.json                 # 1,984 validated statutory records
│   ├── judgments_canonical.json                   # 5,155 validated judicial records
│   ├── legal_aid_canonical.json                   # 2 comprehensive institutional records
│   ├── incident_clusters_canonical.json           # 3 community action records
│   └── master_canonical_corpus.json               # 7,144 unified canonical documents (100% compliant)
│
└── chunks/                                        # Retrieval-ready chunks for hybrid search
    └── retrieval_chunks.json                      # 7,235 indexed chunks with domain tags & official links
```

---

## 3. Statutory Concordance Engine (IPC/BNS, CrPC/BNSS, IEA/BSA)

Per Recommendation D of the acquisition plan, we built a comprehensive concordance mapping resolving old criminal and evidentiary provisions to the new codes that took effect on July 1, 2024:

| Domain | Old Code | New Code | Key Section Mappings |
|---|---|---|---|
| **Substantive Penal Law** | IPC (1860) | **BNS (2023)** | Murder (302 ↔ 103), Theft (379 ↔ 303), Snatching (New ↔ 304), Cheating (420 ↔ 318), Forgery (465 ↔ 338), Defamation (500 ↔ 356 w/ Community Service), Cruelty (498A ↔ 85/86), Sedition (124A ↔ 152 Acts endangering sovereignty) |
| **Criminal Procedure** | CrPC (1973) | **BNSS (2023)** | FIR / Zero FIR (154 ↔ 173), Preliminary Inquiry for minor offenses (New ↔ 173(3)), Witness Attendance Exemption (160 ↔ 179), Videographed Search/Seizure (100 ↔ 105), Anticipatory Bail (438 ↔ 482), Undertrial 1/3rd Relief (436A ↔ 479) |
| **Evidentiary Law** | IEA (1872) | **BSA (2023)** | Electronic Records Admissibility (65B ↔ 63 w/ Schedule Certificate), Primary Digital Documents (62 ↔ 57), Discovery of Fact (27 ↔ 23(2)), Dying Declaration (32(1) ↔ 26(a)), Expert Opinion Cyber/Forensics (45 ↔ 39) |

---

## 4. Pipeline Execution Scripts

We developed five modular production scripts in [`scripts/`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/scripts):

1. **[`scripts/acquire_datasets.py`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/scripts/acquire_datasets.py):**
   - Automatically downloads CivicTech India bare acts, AWS Open Data Supreme Court metadata parquet files, High Court case records, and priority statutory provisions.
2. **[`scripts/build_mappings.py`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/scripts/build_mappings.py):**
   - Compiles IPC↔BNS, CrPC↔BNSS, and IEA↔BSA section tables and exports fast bidirectional lookup indexes.
3. **[`scripts/build_golden_eval.py`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/scripts/build_golden_eval.py):**
   - Formulates 15 detailed golden evaluation questions across Tenancy, Consumer Protection, Cheque Bounce (Sec 138), Police/FIR/Arrest, RTI, RERA, and Legal Aid, plus 4 adversarial safety queries.
4. **[`scripts/build_incident_clusters.py`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/scripts/build_incident_clusters.py):**
   - Generates synthetic privacy-preserving incident clusters for Bengaluru tenancy deposits, Mumbai builder possession delays, and E-commerce refund denials.
5. **[`scripts/normalize_corpus.py`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/scripts/normalize_corpus.py):**
   - Validates documents against the canonical JSON schema, strips duplicates via SHA-256 and citation deduplication, and generates canonical partitions.
6. **[`scripts/chunk_and_index.py`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/scripts/chunk_and_index.py):**
   - Chunks normalized documents at statutory and reasoning boundaries, applies domain tagging (`tenancy`, `consumer`, `criminal`, `cheque_bounce`, `property_rera`, `motor_accident`, `legal_aid`, `rti`), and synchronizes [`backend/data/corpus/indian_legal_acts.json`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/backend/data/corpus/indian_legal_acts.json).
7. **[`scripts/run_dataset_pipeline.py`](file:///c:/Users/puruk/Downloads/New%20folder/legal%20saathi/scripts/run_dataset_pipeline.py):**
   - End-to-end master orchestrator with automated benchmark validation and quality audit.

---

## 5. Verification & Retrieval Quality Results

Running the master orchestrator verified:
- **Canonical Schema Conformance:** 100% (7,144 of 7,144 records)
- **Golden Evaluation Recall@5:** 100.0% (15 of 15 queries matched ground-truth sections in top-5 hybrid results)
- **Unit Test Suite:** 29 passed, 0 failed in 1.33 seconds
- **Search Latency:** Instantaneous BM25 + dense lexical scoring over 7,235 chunks without external GPU dependency.
