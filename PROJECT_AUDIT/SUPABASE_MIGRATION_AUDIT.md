# SUPABASE MIGRATION AUDIT — LEGAL SAATHI

**Project:** Legal Saathi — AI-Powered Legal Assistance Platform  
**Repository:** `E:\Rox\LegalSaathi`  
**Audit Date:** 2026-09-27  
**Status:** `NOT STARTED (0% MIGRATED)`  

---

## 1. Executive Summary

Despite previous architectural references to Supabase, this audit confirms that **no Supabase migration has taken place**. The repository contains:
* **Zero** Supabase dependencies in `package.json` (`@supabase/supabase-js`, `@supabase/ssr` are missing).
* **Zero** Supabase dependencies in Python `requirements.txt` (`supabase`, `postgrest-py` are missing).
* **Zero** Supabase configuration keys in `.env` or `.env.example`.
* **Zero** PostgreSQL migration files or DDL scripts.
* **Zero** Row Level Security (RLS) policies.

The entire persistence layer currently operates on a local SQLite database (`legal_saathi.db`).

---

## 2. Existing Database Audit (`legal_saathi.db`)

### Physical Characteristics:
* **Database File:** `E:\Rox\LegalSaathi\legal_saathi.db`
* **File Size:** 167,936 bytes (164 KB)
* **Engine:** SQLite 3 (accessed via SQLAlchemy in `backend/database/`)
* **Total Tables:** 11
* **Total Records:** 98 rows

### Detailed Table-by-Table Breakdown:

| # | Table Name | Verified Row Count | Primary Purpose | Foreign Key Relationships |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `sessions` | **20** | User conversation sessions & anonymous intake state | None |
| 2 | `cases` | **22** | Formal legal matters, triage categorization, status | `sessions.id` |
| 3 | `incidents` | **6** | Specific grievance / violation events tied to cases | `cases.id` |
| 4 | `clusters` | **3** | Collective action grouping (e.g. builder delays) | None |
| 5 | `drafts` | **8** | Legal notices, RTI drafts, complaints, petitions | `cases.id` |
| 6 | `audit_events` | **28** | Security and compliance audit trail | `cases.id`, `sessions.id` |
| 7 | `subscription_plans` | **5** | Pricing tiers (Free Citizen, Pro Citizen, Advocate) | None |
| 8 | `user_subscriptions` | **3** | Active citizen/advocate subscription states | `subscription_plans.id` |
| 9 | `payment_orders` | **10** | Razorpay/Cashfree transaction order records | `cases.id` |
| 10 | `invoices` | **2** | Statutory GST tax invoices for drafted notices | `payment_orders.id` |
| 11 | `collective_pool_contributions` | **0** | Crowd-funded community legal escrow contributions | `clusters.id` |

---

## 3. Supabase Component Verification

### A. Project Setup & Configuration
* **Status:** `NOT STARTED`
* **Finding:** Grepping for `supabase` across the repository yielded zero matches in application code. `.env.example` lacks standard Supabase variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`).

### B. Schema & Migration Files
* **Status:** `NOT STARTED`
* **Finding:** No migration folder (`supabase/migrations/` or `migrations/`) exists. There are no SQL scripts defining the PostgreSQL equivalent of SQLite tables or `CREATE TABLE` statements for Supabase.

### C. Data Migration Status
* **Status:** `NOT STARTED`
* **Finding:** All 98 records remain solely within `legal_saathi.db`. No data export/import scripts or ETL pipelines have been executed.

### D. Authentication & User Profiles
* **Status:** `NOT STARTED`
* **Finding:** Frontend auth currently uses local cookie sessions managed via `src/lib/auth/user-store.ts` with local JSON persistence in `.data/users.json`. Supabase Auth is not implemented, and the `auth.users` trigger to populate a public `profiles` table does not exist.

### E. Storage Buckets
* **Status:** `NOT STARTED`
* **Finding:** Evidence documents and case PDFs are uploaded to the local filesystem or handled in-memory. The required Supabase Storage buckets (`case-evidence`, `legal-dossiers`, `datasets`) have not been provisioned.

### F. Row Level Security (RLS)
* **Status:** `NOT STARTED`
* **Finding:** Because tables exist only in SQLite, no PostgreSQL RLS policies exist. Multi-tenant data isolation is currently enforced only via application-level `WHERE user_id = ...` queries in Python.

### G. Backend Integration
* **Status:** `NOT STARTED`
* **Finding:** `backend/core/config.py` hardcodes:
  ```python
  DATABASE_PATH: str = "legal_saathi.db"
  ```
  The database engine connects via `sqlite:///{settings.DATABASE_PATH}`. It does not connect to Supabase PostgreSQL or use the Supabase Python SDK.

---

## 4. Supabase Migration Execution Plan (Step-by-Step)

To achieve 100% completion of Part B without disrupting the preserved frontend, the following steps are required:

### Step 1: Credentials & SDK Installation
1. Obtain Supabase Project URL, Anon Key, and Service Role Key.
2. Update `.env.example`, `.env.local` (frontend), and `.env` (backend).
3. Install frontend dependencies:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```
4. Install backend dependencies:
   ```bash
   pip install supabase psycopg2-binary asyncpg
   ```

### Step 2: DDL Schema Migration (PostgreSQL)
Create `supabase/migrations/20260927000000_initial_schema.sql` defining:
* `profiles` (linked to `auth.users`)
* `sessions`
* `cases`
* `incidents`
* `clusters`
* `drafts`
* `audit_events`
* `subscription_plans`
* `user_subscriptions`
* `payment_orders`
* `invoices`
* `collective_pool_contributions`

### Step 3: Data Migration Script
Execute an automated SQLite-to-PostgreSQL transfer script to migrate the 98 existing rows with foreign key integrity.

### Step 4: Storage Provisioning & RLS Policies
1. Create storage buckets: `case-evidence` (private), `legal-dossiers` (private), `datasets` (public read).
2. Enable RLS on all 11 tables with tenant isolation policies:
   ```sql
   ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Citizens can only view their own cases" 
   ON cases FOR SELECT 
   USING (auth.uid() = user_id);
   ```

### Step 5: Backend & Frontend Client Wiring
1. Switch `backend/database/session.py` to use `postgresql+asyncpg://...` or Supabase REST client.
2. Replace `src/lib/auth/user-store.ts` with Supabase Auth browser/server clients.
