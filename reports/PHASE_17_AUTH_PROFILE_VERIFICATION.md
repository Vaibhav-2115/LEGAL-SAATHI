# Phase 17 — Supabase Authentication & User Profiles Verification Report

**Project:** Legal Saathi  
**Auth Provider:** Supabase Auth (GoTrue)  
**Project Ref:** `thqoqnxhqluivesfsntl`  
**Status:** **COMPLETE & VERIFIED (LIVE + UNIT TESTS 100% PASS)**

---

## 1. Architecture & Security Model

The authentication architecture integrates Supabase Auth as the primary identity provider with persistent PostgreSQL profiles:
1. Citizen / Advocate signs up or logs in via Supabase Auth.
2. PostgreSQL trigger `on_auth_user_created` (`handle_new_user`) automatically provisions a profile in `public.profiles` with default role `CITIZEN` and verified metadata.
3. FastAPI backend validates Supabase-issued Bearer JWTs using HMAC-SHA256 signature verification (`verify_supabase_jwt`).
4. Backward-compatible session fallback (`X-Session-ID`) ensures existing intake workflows continue uninterrupted.

---

## 2. Code Changes & Repairs

1. **`backend/core/auth.py`**:
   - Updated `verify_supabase_jwt()` to check `SUPABASE_SERVICE_ROLE_KEY`, `SECRET_KEY`, and development keys in a timing-safe `hmac.compare_digest` loop.
   - Preserved `require_role()` dependency for RBAC enforcement (`CITIZEN`, `LEGAL_AID_ADVOCATE`, `FACULTY_ADMIN`).
   - Added token expiration validation (`exp`), subject validation (`sub`), and header algorithm validation (`alg: HS256`).

2. **`backend/tests/test_auth_jwt.py`**:
   - Verified 6/6 tests passing (token verification, expiration rejection, tampered signature rejection, bearer token user extraction, session fallback, role enforcement).

---

## 3. Live Supabase Verification Evidence

Executed against project `thqoqnxhqluivesfsntl`:

```text
[17.1] profiles table exists with 11 columns:
       ['id', 'email', 'full_name', 'phone', 'role', 'docket_id', 'avatar_url', 'consent_dpdp', 'legacy_user_id', 'created_at', 'updated_at']
[17.2] Supabase Auth user created via Auth API: status=200
[17.3] PostgreSQL trigger 'handle_new_user' auto-created profile:
       id=78a821cc-7dd5-4789-95cc-12b5c868f432, email=test_civic_deb068@legalsaathi.in, name=Dr. Rajesh Sharma
[17.4] Updated profile via SQL:
       name='Dr. Rajesh K. Sharma', phone='+919876543211'
[17.5] Cleaned up test user & profile: status=200 (CASCADE verified)
[17.6] Live JWT signature verified successfully:
       sub=78a821cc-7dd5-4789-95cc-12b5c868f432, role=CITIZEN
```
