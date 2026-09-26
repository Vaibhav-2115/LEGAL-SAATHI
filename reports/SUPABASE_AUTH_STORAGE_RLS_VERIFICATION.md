# Legal Saathi — Auth, Storage & RLS Verification Report
**Generated:** 2026-09-27  
**Status:** PARTIALLY VERIFIED — Live Supabase tests BLOCKED pending credentials

---

## Phase E — Authentication

### Frontend Auth Implementation

| Component | File | Status |
|---|---|---|
| Supabase browser client | `src/lib/supabase/client.ts` | ✅ Implemented |
| Supabase server client | `src/lib/supabase/server.ts` | ✅ Implemented |
| Supabase middleware client | `src/lib/supabase/middleware.ts` | ✅ Implemented |
| Admin client (service role) | `src/lib/supabase/admin.ts` | ✅ Backend-only, server-side only |
| Session middleware | `src/middleware.ts` | ✅ Calls `updateSession()` |
| Login route | `src/app/api/auth/login/route.ts` | ✅ Supabase-first, local fallback |
| Logout route | `src/app/api/auth/logout/route.ts` | ✅ Implemented |
| Register route | `src/app/api/auth/register/route.ts` | ✅ Implemented |
| Session route | `src/app/api/auth/session/route.ts` | ✅ Implemented |
| Supabase callback | `src/app/api/auth/callback/supabase/` | ✅ Implemented |

### Backend Auth Implementation

| Component | File | Status |
|---|---|---|
| JWT verification (HS256) | `backend/core/auth.py:verify_supabase_jwt()` | ✅ Implemented |
| Bearer token extraction | `backend/core/auth.py:get_current_user()` | ✅ Implemented |
| Role-based access control | `backend/core/auth.py:require_role()` | ✅ Implemented |
| Session-based fallback | `backend/core/auth.py:get_current_session()` | ✅ Maintained for backward compat |

### JWT Auth Tests (live, no DB required)

| Test | Result |
|---|---|
| `test_valid_supabase_jwt_verification` | ✅ PASSED |
| `test_expired_jwt_rejection` | ✅ PASSED |
| `test_tampered_signature_rejection` | ✅ PASSED |
| `test_get_current_user_with_bearer_token` | ✅ PASSED |
| `test_get_current_user_fallback_session` | ✅ PASSED |
| `test_role_authorization_enforcement` | ✅ PASSED |

### Live Auth Tests — BLOCKED

| Test | Status |
|---|---|
| User registration via Supabase | ❌ BLOCKED — no SUPABASE_URL in .env |
| Login via Supabase | ❌ BLOCKED |
| Session persistence | ❌ BLOCKED |
| JWT refresh | ❌ BLOCKED |
| Profile creation on registration | ❌ BLOCKED |

---

## Phase F — Storage

### Configuration

| Bucket | Policy | Max Size | Status |
|---|---|---|---|
| `evidence-files` | Private, user-owned | 25 MB | ✅ SQL defined in migration 000004 |
| `generated-drafts` | Private, user-owned | 10 MB | ✅ SQL defined in migration 000004 |

### Storage SQL (`supabase/migrations/20260927000004_storage_buckets.sql`)

Defines:
- `INSERT INTO storage.buckets` for both buckets
- RLS policies restricting access to `auth.uid()` matching folder prefix
- File size limits via bucket configuration
- Private buckets (not publicly accessible)

### Live Storage Tests — BLOCKED

| Test | Status |
|---|---|
| Bucket creation verified | ❌ BLOCKED |
| Upload to evidence-files | ❌ BLOCKED |
| Download as authorized user | ❌ BLOCKED |
| Download rejected for unauthorized user | ❌ BLOCKED |
| Public URL exposure test | ❌ BLOCKED |
| File size limit enforcement | ❌ BLOCKED |

---

## Phase G — Row-Level Security

### RLS Policy Coverage (`supabase/migrations/20260927000005_row_level_security.sql`)

| Table | Policy Type | Condition |
|---|---|---|
| `sessions` | SELECT, INSERT, UPDATE | `user_id = auth.uid()` |
| `cases` | SELECT, INSERT, UPDATE, DELETE | `session_id IN (SELECT session_id FROM sessions WHERE user_id = auth.uid())` |
| `incidents` | SELECT, INSERT | `case_id IN (owned cases)` |
| `clusters` | SELECT | Public read (aggregate data) |
| `drafts` | SELECT, INSERT, UPDATE, DELETE | `case_id IN (owned cases)` |
| `audit_events` | SELECT | `actor LIKE 'user:' \|\| auth.uid()` |
| `user_subscriptions` | SELECT, INSERT, UPDATE | `user_id = auth.uid()` |
| `payment_orders` | SELECT, INSERT | `user_id = auth.uid()` |
| `invoices` | SELECT | `user_id = auth.uid()` |
| `collective_pool_contributions` | SELECT, INSERT | `user_id = auth.uid()` |
| `profiles` | SELECT, UPDATE | `id = auth.uid()` |

### RLS Application Status — BLOCKED

| Step | Status |
|---|---|
| `ENABLE ROW LEVEL SECURITY` on all tables | ❌ BLOCKED — schema not applied to Supabase |
| Policy INSERT statements executed | ❌ BLOCKED |
| Cross-user isolation test | ❌ BLOCKED |
| Unauthenticated rejection test | ❌ BLOCKED |
| Admin access test | ❌ BLOCKED |

### Security Architecture Notes

- Service role key is **backend-only** — never exposed to frontend
- Frontend uses anon key only — all data access goes through RLS
- Backend JWT verification uses `SUPABASE_SERVICE_ROLE_KEY` as HMAC secret to verify tokens
- `admin.ts` throws immediately if service role key is not set or contains placeholder

---

## Unblocking Steps

1. **Reset Supabase DB password** → `Settings → Database → Reset database password`
2. **Create `.env`** with `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. **Apply migrations** via Supabase SQL editor or `psql`
4. **Run auth tests** — registration, login, profile creation
5. **Verify storage** — upload/download test for both buckets
6. **Test RLS** — cross-user isolation, anonymous rejection
