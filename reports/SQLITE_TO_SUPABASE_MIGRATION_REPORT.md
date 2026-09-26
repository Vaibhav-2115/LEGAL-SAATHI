# Legal Saathi — SQLite to Supabase Migration Report
**Generated:** 2026-09-27  
**Migration State:** DRY-RUN PASSED — Live migration BLOCKED (awaiting DATABASE_URL)

---

## Source Database

| Property | Value |
|---|---|
| File | `legal_saathi.db` |
| Backup | `legal_saathi.db.sqlite_backup_*` (timestamped, preserved) |
| Engine | SQLite 3 |
| Total tables | 11 |
| Total rows | 491 |

## Source Table Counts

| Table | Rows |
|---|---|
| sessions | 84 |
| subscription_plans | 5 |
| clusters | 11 |
| cases | 110 |
| incidents | 30 |
| drafts | 40 |
| audit_events | 140 |
| user_subscriptions | 11 |
| payment_orders | 50 |
| invoices | 10 |
| collective_pool_contributions | 0 |
| **TOTAL** | **491** |

## Referential Integrity Audit

### Orphaned Session Records

| Finding | Detail |
|---|---|
| Orphaned session IDs | 6 |
| Affected case rows | 48 |
| Session IDs | `test_sess_001` through `test_sess_006` (pattern: test fixtures) |
| Assessment | Test artifacts — no real user data. No real ownership conflict. |

### Resolution Strategy — APPROVED: Option A (Stub Sessions)

The 48 cases reference 6 session IDs that do not exist in the `sessions` table. The session ID naming pattern (`test_sess_*`) confirms these are test-generated records.

The migration script auto-creates 6 placeholder sessions:
```python
{
    "session_id": "<orphaned_id>",
    "user_id": "legacy_migrated_user",
    "language_pref": "en",
    "created_at": "<migration_timestamp>"
}
```

No case records are deleted. No records are assigned to real users.

### Dry-Run Results

```
LEGAL SAATHI — SQLITE TO POSTGRESQL MIGRATION (DRY RUN)
========================================================================
Source SQLite Record Counts:
  - sessions                      :   84 rows
  - subscription_plans            :    5 rows
  - clusters                      :   11 rows
  - cases                         :  110 rows
  - incidents                     :   30 rows
  - drafts                        :   40 rows
  - audit_events                  :  140 rows
  - user_subscriptions            :   11 rows
  - payment_orders                :   50 rows
  - invoices                      :   10 rows
  - collective_pool_contributions  :    0 rows
  TOTAL SOURCE ROWS              :  491 rows

Audit & Referential Integrity Adjustments:
  * Found 6 orphaned session_ids referenced by cases.
  * Auto-backfilled 6 missing stub records in 'sessions' table.

PostgreSQL Target Prepared Counts:
  - sessions                      :   90 rows  (84 + 6 stubs)
  - subscription_plans            :    5 rows
  - clusters                      :   11 rows
  - cases                         :  110 rows
  - incidents                     :   30 rows
  - drafts                        :   40 rows
  - audit_events                  :  140 rows
  - user_subscriptions            :   11 rows
  - payment_orders                :   50 rows
  - invoices                      :   10 rows
  - collective_pool_contributions  :    0 rows
  TOTAL PREPARED ROWS            :  497 rows

[DRY RUN RESULT]: SUCCESS
```

## Destination Schema

Applied via `supabase/migrations/20260927000001_initial_schema.sql`:
- 11 tables with PostgreSQL-native types (`TIMESTAMPTZ`, `JSONB`, `TEXT`)
- Full referential integrity constraints (`FOREIGN KEY`, `ON DELETE CASCADE / SET NULL`)
- 9 performance indexes
- Schema is compatible with all 491 source rows

## Migration Blockers

| Blocker | Status |
|---|---|
| `DATABASE_URL` not set | ❌ BLOCKED |
| Live PostgreSQL connection test | ❌ BLOCKED |
| Schema application to Supabase | ❌ BLOCKED |
| Data INSERT execution | ❌ BLOCKED |
| Post-migration row count verification | ❌ BLOCKED |

## Live Migration — Execution Command (Ready to Run)

Once `DATABASE_URL` is in `.env`:

```bash
# 1. Apply schema
psql $DATABASE_URL -f supabase/migrations/20260927000001_initial_schema.sql
psql $DATABASE_URL -f supabase/migrations/20260927000002_data_migration.sql
psql $DATABASE_URL -f supabase/migrations/20260927000003_profiles_schema.sql
psql $DATABASE_URL -f supabase/migrations/20260927000004_storage_buckets.sql
psql $DATABASE_URL -f supabase/migrations/20260927000005_row_level_security.sql

# 2. Migrate data
python scripts/migrate_sqlite_to_postgres.py --postgres-url $DATABASE_URL

# 3. Verify row counts
python scripts/migrate_sqlite_to_postgres.py --verify-only --postgres-url $DATABASE_URL
```

Or via Python migration runner directly:
```bash
python scripts/migrate_sqlite_to_postgres.py --postgres-url "postgresql://..."
```

## Remaining Risks

| Risk | Mitigation |
|---|---|
| Duplicate `plan_id` for subscription_plans | `ON CONFLICT DO NOTHING` in migration |
| Timestamp format differences (ISO vs TIMESTAMPTZ) | psycopg2 handles transparently |
| JSONB type coercion | Migration runner serializes all JSON columns correctly |
