# Legal Saathi — Continuous Audit Log
**Project:** `E:\Rox\LegalSaathi`  
**Supabase Project:** `thqoqnxhqluivesfsntl`

---

## Iteration 1 — 2026-09-27 02:13–02:20 IST

### AUDIT — Findings Discovered

| ID | Severity | Finding | File |
|---|---|---|---|
| F001 | CRITICAL | SQLite active runtime with silent fallback | `backend/data/db.py` |
| F002 | CRITICAL | Health probe masked SQLite fallback as "degraded" | `backend/routers/health.py` |
| F003 | HIGH | Local JSON auth fallback still active | `src/app/api/auth/login/route.ts` |
| F004 | HIGH | No `.env` file — DATABASE_URL missing | `.env` (missing) |
| F005 | HIGH | Schema not applied to Supabase PostgreSQL | `supabase/migrations/` |
| F006 | HIGH | 491 rows not migrated to PostgreSQL | `legal_saathi.db` |
| F007 | MEDIUM | Supabase placeholder URLs in client code | `src/lib/supabase/*.ts` |
| F008 | MEDIUM | `_init_db()` ran CREATE TABLE on startup | `backend/data/db.py` |
| F009 | MEDIUM | All tests fail at collection without DATABASE_URL | `backend/tests/` |
| F010 | LOW | Migration scripts retain SQLite (acceptable) | `scripts/` |
| F011 | LOW | Backup file in working tree | `backend/data/db.py.sqlite_backup_*` |

### CLASSIFY — Severity Matrix

| Severity | Count | Fixable Now |
|---|---|---|
| CRITICAL | 2 | ✅ Yes — code only |
| HIGH | 4 | 1 fixable, 3 blocked |
| MEDIUM | 3 | 2 fixable, 1 auto-resolves |
| LOW | 2 | Noted |

### FIX — Actions Taken

| Fix | Files Modified | Result |
|---|---|---|
| Rewrote `db.py` — PostgreSQL-only, fail-fast guard | `backend/data/db.py` | ✅ DONE |
| Removed SQLite import, `_init_db()`, dual-engine | `backend/data/db.py` | ✅ DONE |
| Replaced all `?` params with `%s` | `backend/data/db.py` | ✅ DONE |
| Replaced `INSERT OR REPLACE` with `ON CONFLICT DO UPDATE` | `backend/data/db.py` | ✅ DONE |
| Updated health.py — removed degraded fallback path | `backend/routers/health.py` | ✅ DONE |
| Added `conftest.py` to fix test collection | `backend/tests/conftest.py` | ✅ DONE |
| Backed up original `db.py` | `backend/data/db.py.sqlite_backup_*` | ✅ DONE |

### TEST — Results

| Test Category | Result |
|---|---|
| Python syntax check — db.py | ✅ PASS |
| Python syntax check — health.py | ✅ PASS |
| TypeScript check (`tsc --noEmit`) | ✅ PASS (exit 0) |
| JWT auth tests (6 tests) | ✅ 6/6 PASSED |
| Backend test suite with conftest | 26 PASSED, 19 FAILED |
| Failure reason for 19 tests | `ECIRCUITBREAKER` — wrong password, correct host |
| `import sqlite3` in backend/ | ✅ 0 occurrences |

### VERIFY — Per Finding

| ID | Status | Evidence |
|---|---|---|
| F001 | ✅ FIXED | 0 `sqlite3` imports in `backend/data/db.py` |
| F002 | ✅ FIXED | `health.py` always returns `is_fallback: False` |
| F003 | ⚠️ DEFERRED | Fallback needed until Supabase Auth live |
| F004 | ❌ BLOCKED | Needs DB password |
| F005 | ❌ BLOCKED | Needs DB password |
| F006 | ❌ BLOCKED | Needs DB password |
| F007 | ⚠️ AUTO-RESOLVES | Once `.env.local` created |
| F008 | ✅ FIXED | `_init_db()` removed from new `db.py` |
| F009 | ✅ FIXED | `conftest.py` added; 26 tests collect and pass |
| F010 | ✅ ACCEPTED | Scripts are not runtime code |
| F011 | ✅ NOTED | Backup preserved intentionally |

### RE-AUDIT — After Fixes

Active runtime SQLite scan:
```
backend/data/db.py     — 0 SQLite references
backend/routers/       — 0 SQLite references (comment in health.py only)
backend/services/      — 0 SQLite references
backend/core/          — 0 SQLite references
```

### Iteration 1 Conclusion

**CRITICAL and MEDIUM code issues: FIXED**  
**Remaining: 3 HIGH findings blocked on DATABASE_URL (database password)**  
**Audit loop continues at Iteration 2 once credentials are provided**

---

## Iteration 2 — PENDING

**Trigger:** User provides database password → `.env` created → live PostgreSQL connection

**Planned actions:**
1. Verify live PostgreSQL connection (`SELECT 1`)
2. Apply all 5 migration SQL files
3. Run live data migration (491 rows → 497 prepared rows)
4. Verify post-migration row counts
5. Run full backend test suite against live DB (expected: 45/45 pass)
6. Verify Supabase Auth registration/login
7. Verify storage bucket creation
8. Apply and test RLS policies
9. Remove local auth fallback from `login/route.ts`
10. Final SQLite removal scan

---

## Exit Criteria Status

| Criterion | Status |
|---|---|
| SQLite removed from active runtime | ✅ DONE |
| Fail-fast on missing DATABASE_URL | ✅ DONE |
| JWT auth tests pass | ✅ DONE |
| TypeScript clean | ✅ DONE |
| Live PostgreSQL connection | ❌ BLOCKED |
| Data migrated and verified | ❌ BLOCKED |
| Supabase Auth verified | ❌ BLOCKED |
| Storage buckets verified | ❌ BLOCKED |
| RLS applied and tested | ❌ BLOCKED |
| Full test suite green (live DB) | ❌ BLOCKED |
