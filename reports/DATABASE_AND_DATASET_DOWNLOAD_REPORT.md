# Database and Dataset Download Report

**Project:** Legal Saathi  
**Dataset Directory:** `E:\Rox\LegalSaathi\download_dataset`  
**Execution Date:** 2026-09-26  
**Status:** Completed & Verified

---

## 1. Database Architecture & State

- **Database Engine:** SQLite 3 (Thread-safe `DatabaseManager` using Python standard library `sqlite3`)
- **Configured Path:** `legal_saathi.db` (per `backend/core/config.py`)
- **Connection Test:** Successfully established and verified.
- **Table Schemas Initialized (11 Tables):**
  1. `sessions`: Session tracking, user link, language preference (`en`, `hi`, etc.).
  2. `cases`: Primary case entity, title, description, entities JSON, evidence JSON, consent status.
  3. `incidents`: Legal Saathi Engine incident reports, cluster associations, privacy locality/amount buckets.
  4. `clusters`: Collective action groups, legal issue types, member counts, explanation text.
  5. `drafts`: Generated legal notices, RTI applications, e-FIR drafts.
  6. `audit_events`: Tamper-evident audit logging for user access and consent actions.
  7. `subscription_plans`: Billing tiers (Free Citizen, Pro, Advocate, Enterprise).
  8. `user_subscriptions`: Active subscription records with validity periods.
  9. `payment_orders`: Razorpay/Cashfree order state and signatures.
  10. `invoices`: GST-compliant invoices with SAC codes (998311).
  11. `collective_pool_contributions`: Crowdfunded docket pledge records.

---

## 2. Dataset Storage & PDF Retrieval

- **Dataset Storage Location:** `dataset/` (repository statutory dataset storage)
- **Target Download Folder:** `download_dataset/nalsa_legal_aid_statistics/`
- **Total PDF Records Found in Dataset Storage:** 10
- **Total PDFs Downloaded to `download_dataset`:** 10
- **Total PDFs Verified with Valid PDF Signature:** 10 (100% pass)
- **Duplicate Files Skipped:** 0 (all 10 files possess distinct SHA-256 hashes and distinct fiscal periods)

---

## 3. PDF Inventory & Integrity Verification Table

| File Name | Size (Bytes) | Pages | Header | Fiscal Period | Beneficiary Total | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `202504201584323382.pdf` | 288,700 | 2 | `%PDF-1.7` | April 2016 – March 2017 | 556,689 | Verified |
| `202504202049899435.pdf` | 288,692 | 2 | `%PDF-1.7` | April 2017 – March 2018 | 822,856 | Verified |
| `20250612785003768.pdf` | 456,258 | 2 | `%PDF-1.7` | April 2018 – March 2019 | 1,505,216 | Verified |
| `202506121059301255.pdf` | 172,723 | 2 | `%PDF-1.7` | April 2019 – March 2020 | 1,212,137 | Verified |
| `20250612242265083.pdf` | 173,033 | 2 | `%PDF-1.7` | April 2020 – March 2021 | 631,758 | Verified |
| `20250612891186821.pdf` | 175,323 | 2 | `%PDF-1.7` | April 2021 – March 2022 | 6,369,643 | Verified |
| `202506121402395984.pdf` | 457,516 | 2 | `%PDF-1.7` | April 2022 – March 2023 | 1,214,769 | Verified |
| `20250612151392405.pdf` | 52,989 | 2 | `%PDF-1.7` | April 2023 – March 2024 | 1,550,164 | Verified |
| `20250612914784169.pdf` | 456,717 | 2 | `%PDF-1.7` | April 2024 – March 2025 | 1,657,527 | Verified |
| `202607161242945433.pdf` | 220,575 | 2 | `%PDF-1.7` | April 2025 – March 2026 | 2,007,776 | Verified |

---

## 4. Failed Downloads & Remote Link Inspection

- **External MoHUA Model Tenancy Act, 2021 PDF:**
  - Remote URL: `https://mohua.gov.in/upload/uploadfiles/files/MTA_Final_English.pdf`
  - Result: Remote server returned `HTTP 404 (Not Found)`.
  - Impact: None on application retrieval. The statute's provisions are already extracted into structured JSON format in `data/raw/legislation/priority_specialized_statutes.json`.
