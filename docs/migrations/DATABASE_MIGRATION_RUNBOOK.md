# DATABASE MIGRATION RUNBOOK — LEGAL SAATHI

**Document:** Operational Runbook for Supabase / PostgreSQL Migration  
**Target Audience:** DevOps Engineers, Backend Developers, Database Administrators  
**Repository:** `E:\Rox\LegalSaathi`  
**Last Updated:** 2026-09-27  

---

## 1. Prerequisites

Before running the migration against a live Supabase instance:
1. **Supabase Cloud Project:** Ensure your Supabase project is created and active at `https://supabase.com/dashboard`.
2. **Database Password:** Have your PostgreSQL database password ready.
3. **Python Environment:** Activate project virtual environment:
   ```bash
   .venv\Scripts\activate
   ```
4. **PostgreSQL Driver (for CLI runner):**
   ```bash
   pip install psycopg2-binary
   ```

---

## 2. Environment Configuration

Copy `.env.example` to `.env` (or update existing `.env`):
```ini
# Supabase PostgreSQL Connection URI
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Supabase Project API Keys
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

---

## 3. Pre-Migration Backup

Always create a fresh, verified backup of the SQLite database before running migration commands:

```bash
# Automated backup command
python -c "import sqlite3, shutil, datetime; ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S'); bkp = f'legal_saathi_backup_{ts}.db'; shutil.copy2('legal_saathi.db', bkp); print(f'Backup created: {bkp}')"
```

Verify that the backup is readable:
```bash
python -c "import sqlite3; conn = sqlite3.connect('legal_saathi.db'); print('Tables:', len(conn.execute('SELECT name FROM sqlite_master WHERE type=\'table\'').fetchall()))"
```

---

## 4. Migration Execution Options

There are two verified paths to execute the migration:

### Option A: Via Supabase Dashboard SQL Editor (Recommended — No Drivers Required)

1. Open your Supabase Dashboard: `https://supabase.com/dashboard/project/[YOUR-PROJECT-REF]/sql`
2. Open `supabase/migrations/20260927000001_initial_schema.sql`, copy its contents, paste into the SQL Editor, and click **Run**.
3. Verify that all 11 tables and 9 indexes appear in the Table Editor.
4. Open `supabase/migrations/20260927000002_data_migration.sql`, copy its contents, paste into the SQL Editor, and click **Run**.
5. All 161 rows will be inserted with transaction safety.

### Option B: Via Python CLI Migration Runner

1. Run pre-flight dry-run validation:
   ```bash
   python scripts/migrate_sqlite_to_postgres.py --dry-run
   ```
2. Execute direct PostgreSQL ingestion:
   ```bash
   python scripts/migrate_sqlite_to_postgres.py --postgres-url "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

---

## 5. Post-Migration Verification

Run verification queries against the target database:

### Query Table Counts in PostgreSQL:
```sql
SELECT 
    schemaname, 
    relname AS table_name, 
    n_live_tup AS row_count 
FROM pg_stat_user_tables 
ORDER BY relname;
```

### Expected Row Counts:
* `sessions`: **66** (+6 stub sessions backfilled for referential integrity)
* `subscription_plans`: **5**
* `clusters`: **8**
* `cases`: **77**
* `incidents`: **21**
* `drafts`: **28**
* `audit_events`: **98**
* `user_subscriptions`: **8**
* `payment_orders`: **35**
* `invoices`: **7**
* `collective_pool_contributions`: **0**
* **Total Expected:** **353 rows**

### Verify Backend Service with PostgreSQL:
1. Set `DATABASE_URL` in `.env`.
2. Run automated backend test suite:
   ```bash
   python -m pytest backend/tests
   ```
3. Confirm 45/45 tests pass.

---

## 6. Rollback Procedure

If any anomaly occurs post-migration:

### Step 1: Revert Backend to SQLite
Unset `DATABASE_URL` in `.env` (or remove the line). The backend automatically falls back to `legal_saathi.db`.

### Step 2: Restore Source SQLite Database (if needed)
```bash
cp legal_saathi_backup_20260927_011131.db legal_saathi.db
```

### Step 3: Clean Target PostgreSQL Database
```sql
TRUNCATE TABLE 
    collective_pool_contributions, 
    invoices, 
    payment_orders, 
    user_subscriptions, 
    audit_events, 
    drafts, 
    incidents, 
    cases, 
    clusters, 
    subscription_plans, 
    sessions 
CASCADE;
```

---

## 7. Common Errors & Troubleshooting

| Error | Root Cause | Solution |
| :--- | :--- | :--- |
| `connection to server at "..." failed: Connection refused` | Incorrect host or port (must be port 5432) | Check connection string in Supabase Settings → Database. |
| `password authentication failed for user "postgres"` | Incorrect database password | Reset your database password in Supabase Project Settings. |
| `violates foreign key constraint "cases_session_id_fkey"` | Attempting to insert cases without backfilling stub sessions | Ensure `supabase/migrations/20260927000002_data_migration.sql` or `scripts/migrate_sqlite_to_postgres.py` was used, which auto-backfills the 6 stub sessions. |
| `ModuleNotFoundError: No module named 'psycopg2'` | Python PostgreSQL driver not installed | Run `pip install psycopg2-binary` or use Option A (Supabase SQL Editor). |
| `duplicate key value violates unique constraint` | Running migration script multiple times without `ON CONFLICT DO NOTHING` | The provided scripts use `ON CONFLICT DO NOTHING` and are idempotent. |
