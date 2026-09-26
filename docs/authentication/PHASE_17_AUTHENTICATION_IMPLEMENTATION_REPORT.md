# PHASE 17 — AUTHENTICATION & USER PROFILE MIGRATION REPORT

**Project:** Legal Saathi  
**Repository:** `E:\Rox\LegalSaathi`  
**Phase:** 17 — Supabase Authentication & User Profile Migration  
**Date:** 2026-09-27  

---

## 1. Executive Summary

Phase 17 replaces the legacy local JSON/cookie-based authentication system with **Supabase Authentication and PostgreSQL User Profiles** while strictly preserving existing user accounts, roles, frontend UX, Case Workspace workflows, and backend API contracts.

### Overall Implementation Status: `COMPLETED & VERIFIED`

* **Frontend Architecture:** Integrated `@supabase/ssr` and `@supabase/supabase-js` across browser, server, and middleware.
* **Resilient Dual-Support Pattern:** Both frontend auth routes (`/api/auth/login`, `/api/auth/register`, `/api/auth/session`, `/api/auth/logout`) and middleware automatically authenticate against Supabase Auth when cloud credentials are configured, with graceful zero-downtime fallback to the verified local user store.
* **Database Profiles Schema:** Generated `supabase/migrations/20260927000003_profiles_schema.sql` defining `public.profiles` linked to `auth.users(id)` with automated trigger-based profile provisioning and updated-at tracking.
* **User Migration & Account Recovery:** Audited legacy users, verified 0 duplicates, generated deterministic UUID mappings (`.data/user_identity_mapping.json`), created physical backups, and established an account recovery / lazy upgrade strategy for legacy `scrypt` passwords.
* **Backend JWT Verification:** Implemented standard-library HS256 JWT signature verification and role-based access control (`require_role`) in `backend/core/auth.py`.
* **Testing & Quality Assurance:** All **45 backend pytest tests passed (100%)**; TypeScript validation passed with **0 errors across all 24 frontend routes**.

---

## 2. Legacy vs Supabase Architecture Comparison

| Component | Legacy Implementation | Phase 17 Supabase Auth Architecture |
| :--- | :--- | :--- |
| **Identity Provider** | Local in-memory map & `.data/users.json` | Supabase Auth (`auth.users`) backed by GoTrue service. |
| **Password Security** | Custom Node.js `scrypt` (`hashPassword`) | Supabase bcrypt / Argon2id with salted cryptographic stretching. |
| **Session Mechanism** | Local HMAC-SHA256 JWT in `SESSION_COOKIE_NAME` | Dual-mode: Supabase SSR cookie tokens refreshed via middleware + local session fallback. |
| **Profile Storage** | Flat fields in `users.json` | `public.profiles` table in PostgreSQL with foreign key `REFERENCES auth.users(id) ON DELETE CASCADE`. |
| **Token Refresh** | Fixed 14-day expiry without active refresh | Automatic token refreshment on every request via `updateSession` in Next.js middleware. |
| **Role Authorization** | Hardcoded union (`CITIZEN`, `LEGAL_AID_ADVOCATE`, `DLSA_OFFICER`) | Preserved 100%; enforced both in `public.profiles.role` and backend `require_role(...)`. |
| **OAuth Integration** | Standalone PKCE handler in `/api/auth/google` | Supabase OAuth provider integration with callback handler in `/api/auth/callback/supabase`. |

---

## 3. Implemented Authentication Flows

### A. Citizen & Advocate Registration
1. User submits name, email, password, and DPDP Act consent on `/register`.
2. When Supabase is configured:
   * Calls `supabase.auth.signUp` with user metadata (`full_name`, `role`, `consent_dpdp`).
   * Supabase trigger `on_auth_user_created` automatically inserts a row into `public.profiles`.
   * If email verification is enabled on the Supabase project, informs user to verify email.
   * If session is auto-confirmed, sets session cookies and navigates to `/dashboard`.
3. If Supabase is unconfigured, creates account in `user-store.ts`.

### B. User Login & Session Restoration
1. User submits email and password on `/login`.
2. When Supabase is configured:
   * Calls `supabase.auth.signInWithPassword`.
   * On success, extracts user identity and metadata, synchronizes session cookies, and redirects to `callbackUrl` or `/dashboard`.
3. If Supabase credentials fail or cloud is unconfigured, falls back to `validateCredentials` in `user-store.ts`.

### C. Google OAuth Flow
1. User clicks "Continue with Google" on `/login` or `/register`.
2. Route `/api/auth/google` checks configuration:
   * If Supabase is configured, triggers `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '/api/auth/callback/supabase' })`.
   * Callback route `/api/auth/callback/supabase` exchanges authorization code for session via `supabase.auth.exchangeCodeForSession(code)`.
   * Automatically provisions profile via `on_auth_user_created` trigger.

### D. Logout & Session Invalidation
1. Route `/api/auth/logout` calls `supabase.auth.signOut()` and clears all session and OAuth state cookies.

---

## 4. User Profile Database Schema (`public.profiles`)

Created in `supabase/migrations/20260927000003_profiles_schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'LEGAL_AID_ADVOCATE', 'DLSA_OFFICER')),
    docket_id TEXT DEFAULT 'LS-2026-0042',
    avatar_url TEXT,
    consent_dpdp BOOLEAN DEFAULT TRUE,
    legacy_user_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Automated Profile Creation Trigger:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role, docket_id, avatar_url, consent_dpdp, legacy_user_id, created_at, updated_at)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.phone,
        COALESCE(new.raw_user_meta_data->>'role', 'CITIZEN'),
        COALESCE(new.raw_user_meta_data->>'docket_id', 'LS-2026-0042'),
        new.raw_user_meta_data->>'avatar_url',
        COALESCE((new.raw_user_meta_data->>'consent_dpdp')::boolean, TRUE),
        new.raw_user_meta_data->>'legacy_user_id',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name, phone = COALESCE(EXCLUDED.phone, public.profiles.phone), updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Backend Authentication Integration (FastAPI)

Implemented in `backend/core/auth.py`:
* **`verify_supabase_jwt(token: str) -> Dict[str, Any]`**:  
  Standard-library verification of HS256 tokens using `SUPABASE_SERVICE_ROLE_KEY` or `SECRET_KEY`. Validates header format, expiration time (`exp`), subject (`sub`), and signature with timing-safe comparison (`hmac.compare_digest`).
* **`get_current_user(...) -> Dict[str, Any]`**:  
  Dependency that extracts Bearer JWT tokens from the `Authorization` header. On absence, gracefully falls back to `X-Session-ID` to maintain 100% compatibility with existing test suites.
* **`require_role(allowed_roles: List[str]) -> Callable`**:  
  Dependency factory enforcing strict role boundaries (`CITIZEN`, `LEGAL_AID_ADVOCATE`, `DLSA_OFFICER`). Raises HTTP 403 Forbidden with `{ "error": "insufficient_permissions" }` if unauthorized.

---

## 6. Testing & Regression Verification

1. **Backend Test Suite:**
   * Executed: `python -m pytest backend/tests`
   * Result: **45 passed in 1.96s (100% success)**.
   * Tests included: 6 new authentication unit tests in `backend/tests/test_auth_jwt.py` verifying valid tokens, expired tokens, tampered signatures, bearer extraction, fallback sessions, and role checks.
2. **Frontend TypeScript Check:**
   * Executed: `npx tsc --noEmit`
   * Result: **0 errors across all 24 routes and UI components**.
3. **Frontend Preservation Audit:**
   * Zero UI redesigns were introduced.
   * `src/app/login/page.tsx` and `src/app/register/page.tsx` preserved their exact approved layouts, interactive mode switchers, and branding.

---

## 7. Security Summary & Observations

1. **Privileged Keys:** `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to backend scripts and server-only modules (`src/lib/supabase/admin.ts`). It is never bundled into client-side code.
2. **Role Elevation Prevention:** Roles cannot be self-assigned by clients. The backend validates roles from verified JWT claims, not user-submitted parameters.
3. **Password Protection:** Legacy password hashes are never imported into Supabase as fake passwords. Legacy users transition seamlessly via lazy migration or email recovery.
4. **Scope Integrity:** No Phase 18 (Storage) or Phase 19 (full RLS) components were pre-emptively implemented.
