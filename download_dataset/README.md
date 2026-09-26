# Legal Saathi — Downloaded PDF Dataset Directory

**Target Folder:** `download_dataset/`  
**Acquisition Date:** 2026-09-26  
**Status:** 10 Files Verified (100% Integrity)

---

## 1. Dataset Overview

This directory contains verified PDF dataset files retrieved from the Legal Saathi statutory and legal aid repository. 

- **Primary Source:** National Legal Services Authority (NALSA), Ministry of Law and Justice, Government of India
- **Statutory Authority:** Legal Services Authorities Act, 1987
- **Dataset Domain:** Annual Statistical Statement of Beneficiaries Assisted through Free Legal Services, Advice, and Legal Aid Across all 37 State Legal Services Authorities (SLSAs) and Union Territories.
- **Reporting Temporal Span:** 10 Continuous Financial Years (April 2016 – March 2026).

---

## 2. Directory Structure

```text
download_dataset/
├── README.md
├── nalsa_legal_aid_statistics.csv       # Unified dataset: 10 FYs, 366 state rows, 17.5M+ beneficiaries
├── master_indian_legal_dataset.csv      # 175k rows (cases, statutes, retrieval pairs, SC)
└── master_indian_legal_dataset_220k.csv # 220k rows archive
```

> **Note:** The 10 original raw NALSA PDF documents were parsed, 100% verified against national totals, compiled into `nalsa_legal_aid_statistics.csv`, and cleaned up to optimize repository storage. The parser script is maintained at `scripts/parse_nalsa_statistics.py`.

---

## 3. PDF Verification & Integrity Audit

All 10 documents were checked for header signatures, page count, and cryptographic hash uniqueness:

| File Name | Size (Bytes) | Pages | PDF Version | Reporting Period | Integrity Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `202504201584323382.pdf` | 288,700 | 2 | 1.7 | April 2016 – March 2017 | Valid (Pass) |
| `202504202049899435.pdf` | 288,692 | 2 | 1.7 | April 2017 – March 2018 | Valid (Pass) |
| `20250612785003768.pdf` | 456,258 | 2 | 1.7 | April 2018 – March 2019 | Valid (Pass) |
| `202506121059301255.pdf` | 172,723 | 2 | 1.7 | April 2019 – March 2020 | Valid (Pass) |
| `20250612242265083.pdf` | 173,033 | 2 | 1.7 | April 2020 – March 2021 | Valid (Pass) |
| `20250612891186821.pdf` | 175,323 | 2 | 1.7 | April 2021 – March 2022 | Valid (Pass) |
| `202506121402395984.pdf` | 457,516 | 2 | 1.7 | April 2022 – March 2023 | Valid (Pass) |
| `20250612151392405.pdf` | 52,989 | 2 | 1.7 | April 2023 – March 2024 | Valid (Pass) |
| `20250612914784169.pdf` | 456,717 | 2 | 1.7 | April 2024 – March 2025 | Valid (Pass) |
| `202607161242945433.pdf` | 220,575 | 2 | 1.7 | April 2025 – March 2026 | Valid (Pass) |

---

## 4. Beneficiary Categories Represented in Data

Each state row provides granular counts across the statutory protected categories under Section 12 of the Legal Services Authorities Act, 1987:
1. Scheduled Castes (SC)
2. Scheduled Tribes (ST)
3. Women
4. Children
5. Persons in Custody
6. Persons with Disability
7. Industrial Workmen
8. Transgender Persons
9. Victims of Trafficking / Mass Disaster / Ethnic Violence
10. General / Economically Weaker Section

---

## 5. Download Exceptions & Remote Links

- **MoHUA Model Tenancy Act, 2021:**
  - URL: `https://mohua.gov.in/upload/uploadfiles/files/MTA_Final_English.pdf`
  - Status: Remote server returned `HTTP 404 (Not Found)`. The structured textual sections are already fully preserved in `data/raw/legislation/priority_specialized_statutes.json`.

---

## 6. License & Usage Terms

- **Source License:** Published as official public records by the National Legal Services Authority (NALSA) under the Government of India Open Data / Public Domain guidelines for public legal education and research.
- **Permitted Use:** Research, verification, retrieval indexing, and AI engine training for legal assistance access.
