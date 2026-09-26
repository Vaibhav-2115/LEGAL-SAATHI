# PHASE 16 — DATABASE MIGRATION REPORT

**Project:** Legal Saathi  
**Repository:** `E:\Rox\LegalSaathi`  
**Phase:** 16 — Database Schema & Data Migration  
**Date:** 2026-09-27  

---

## 1. Executive Summary

Phase 16 executes the schema mapping, versioned migration creation, data validation, and backend compatibility configuration for transitioning from local SQLite to PostgreSQL (Supabase).

* **Source Database:** `legal_saathi.db` (SQLite 3, verified)
* **Backups Created & Verified:**
  * `legal_saathi_backup_20260927_011131.db` (Verified: 11 tables, 347 rows, 100% readable)
  * `legal_saathi_backup_20260927_005831.db` (Initial checkpoint)
* **Total Tables Audited:** 11
* **Source Records Audited:** 347 active rows
* **PostgreSQL Target Rows Prepared:** 353 rows (includes 6 backfilled stub session records for orphaned case references)
* **Migration Files Created:** 2 versioned SQL scripts + 1 CLI Python migration runner
* **Backend Status:** Dual-engine configured; 45/45 pytest tests passing (100%)
* **Frontend Status:** 100% preserved; `npx tsc --noEmit` passing with 0 errors
* **Live Supabase Ingestion Status:** `PARTIALLY COMPLETED / BLOCKED (Awaiting live DATABASE_URL)`

---

## 2. Source SQLite Database Audit

Every table in `legal_saathi.db` was inspected for columns, data types, nullability, primary keys, foreign keys, and active row counts.

### Verified Table-by-Table Row Counts:

| # | Table Name | SQLite Row Count | Foreign Key References | Status |
| :--- | :--- | :---: | :--- | :---: |
| 1 | `sessions` | **60** | None (Root Table) | Audited |
| 2 | `subscription_plans` | **5** | None (Master Data) | Audited |
| 3 | `clusters` | **8** | None (Collective Actions) | Audited |
| 4 | `cases` | **77** | `sessions.session_id` | Audited |
| 5 | `incidents` | **21** | `cases.case_id`, `clusters.cluster_id` | Audited |
| 6 | `drafts` | **28** | `cases.case_id` | Audited |
| 7 | `audit_events` | **98** | `cases.case_id` (Logical) | Audited |
| 8 | `user_subscriptions` | **8** | `subscription_plans.plan_id` | Audited |
| 9 | `payment_orders` | **35** | None (`cases.case_id` via `item_ref_id`) | Audited |
| 10 | `invoices` | **7** | `payment_orders.order_id` | Audited |
| 11 | `collective_pool_contributions` | **0** | `payment_orders.order_id`, `clusters.cluster_id` | Audited |
| **TOTAL** | **11 Tables** | **347 Rows** | | **100% Verified** |

---

## 3. Data Integrity & Referential Consistency Analysis

### Identified Foreign Key Anomaly:
* Running `PRAGMA foreign_key_check` on SQLite revealed that 6 case records referenced `session_id`s that were created during integration tests without a matching row in `sessions`.
* In SQLite, foreign key enforcement is disabled by default (`PRAGMA foreign_keys = OFF`), allowing orphaned keys.
* In PostgreSQL, strict foreign key constraints would cause immediate transaction aborts:
  `ERROR: insert or update on table "cases" violates foreign key constraint "cases_session_id_fkey"`

### Remediation Implemented in Migration Pipeline:
1. `scripts/migrate_sqlite_to_postgres.py` audits all `cases.session_id` values prior to ingestion.
2. For any referenced `session_id` missing from `sessions`, a stub session is generated:
   ```json
   {
     "session_id": orphan_sid,
     "user_id": "legacy_migrated_user",
     "language_pref": "en",
     "created_at": "2026-09-27T00:58:31+00:00"
   }
   ```
3. This increases `sessions` from 60 to 66 rows, guaranteeing that 100% of cases migrate cleanly with complete referential integrity.

---

## 4. Migration Files Created

### 1. `supabase/migrations/20260927000001_initial_schema.sql`
* Complete DDL establishing all 11 tables with native PostgreSQL types:
  * `TEXT` primary keys (preserving UUID strings and custom IDs).
  * `TIMESTAMPTZ` for all datetime columns (with `DEFAULT NOW()`).
  * `JSONB` for `entities_json`, `evidence_json`, `metadata_json`, `details_json`, `features_json`.
  * Foreign key constraints with `ON DELETE CASCADE` or `ON DELETE SET NULL`.
  * 9 performance indexes for frequent query paths (`idx_cases_session_id`, `idx_cases_created_at`, `idx_incidents_cluster_id`, `idx_drafts_case_id`, etc.).

### 2. `supabase/migrations/20260927000002_data_migration.sql`
* Self-contained SQL migration dump containing exact `INSERT INTO ... VALUES (...) ON CONFLICT DO NOTHING;` statements wrapped in a transaction block (`BEGIN; ... COMMIT;`).
* Ready for direct execution in the Supabase Dashboard SQL Editor without requiring local Python drivers.
* Fully updated with all 353 target rows.

### 3. `scripts/migrate_sqlite_to_postgres.py`
* Production migration CLI runner supporting:
  * `--dry-run`: Performs complete pre-flight validation.
  * `--postgres-url <URL>`: Direct batch insertion into PostgreSQL using psycopg2.
  * `--export-sql <FILE>`: Generates formatted SQL dump.
  * `--verify-only`: Compares source vs destination counts.

---

## 5. Source vs Prepared Destination Counts

| Table Name | Source SQLite Count | Target PostgreSQL Count | Integrity Delta Reason |
| :--- | :---: | :---: | :--- |
| `sessions` | **60** | **66** | +6 stub sessions backfilled to resolve orphan FKs |
| `subscription_plans` | **5** | **5** | Exact match |
| `clusters` | **8** | **8** | Exact match |
| `cases` | **77** | **77** | Exact match |
| `incidents` | **21** | **21** | Exact match |
| `drafts` | **28** | **28** | Exact match |
| `audit_events` | **98** | **98** | Exact match |
| `user_subscriptions` | **8** | **8** | Exact match |
| `payment_orders` | **35** | **35** | Exact match |
| `invoices` | **7** | **7** | Exact match |
| `collective_pool_contributions` | **0** | **0** | Exact match |
| **TOTAL** | **347** | **353** | **100% Data Preservation** |

* **Failed Records:** 0
* **Skipped Records:** 0

---

## 6. Backend Dual-Engine Configuration & Verification

`backend/data/db.py` was updated to support environment-driven database selection:
* When `DATABASE_URL` is configured with a PostgreSQL connection string, it connects to PostgreSQL using `psycopg2` / `RealDictCursor`.
* If `DATABASE_URL` is empty, unset, or PostgreSQL is unreachable, it logs a warning and falls back to `legal_saathi.db` (SQLite).
* `/health` probe explicitly exposes engine, configured engine, and fallback status.

### Verification Results:
* **Backend Pytest Suite:** `python -m pytest backend/tests`
  * **Result:** **45 passed in 1.90s (100% Success)**.
* **Frontend TypeScript Check:** `npx tsc --noEmit`
  * **Result:** **0 errors (100% Success)**.
* **Frontend Production Build:** `npm run build`
  * **Result:** **PASS (Exit code 0)**. 25 static and dynamic pages compiled cleanly.
* **Frontend Preservation:** No frontend files were modified.

---

## 7. Rollback & Recovery Instructions

If rollback is ever required:
1. **Source Backup Available:** `legal_saathi_backup_20260927_011131.db`.
2. **Reverting Backend to SQLite:** Unset `DATABASE_URL` in `.env` or set `DATABASE_URL=""`. The backend will immediately revert to SQLite with zero downtime.
3. **Restoring Original Database:**
   ```bash
   cp legal_saathi_backup_20260927_011131.db legal_saathi.db
   ```
4. **Purging PostgreSQL Data:**
   ```sql
   TRUNCATE TABLE collective_pool_contributions, invoices, payment_orders, user_subscriptions, audit_events, drafts, incidents, cases, clusters, subscription_plans, sessions CASCADE;
   ```

