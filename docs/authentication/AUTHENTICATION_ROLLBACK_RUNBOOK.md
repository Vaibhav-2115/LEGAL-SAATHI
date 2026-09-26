# AUTHENTICATION ROLLBACK RUNBOOK — LEGAL SAATHI

**Project:** Legal Saathi  
**Document:** Authentication & User Identity Rollback and Disaster Recovery Runbook  
**Repository:** `E:\Rox\LegalSaathi`  
**Date:** 2026-09-27  

---

## 1. Rollback Overview & Safety Philosophy

The Legal Saathi authentication architecture was deliberately designed with a **fail-safe dual-support pattern**:
* The legacy user store (`src/lib/auth/user-store.ts`) and session token generator (`src/lib/auth/jwt.ts`) were **never deleted**.
* Both login and registration routes automatically fallback to the local user store if Supabase Auth is unreachable, unconfigured, or disabled.
* Therefore, a complete rollback requires **zero code rewrites** and can be achieved in seconds by adjusting environment variables or restoring backed-up data.

---

## 2. Backup Locations & Artifact Registry

| Artifact Description | File Path | Status |
| :--- | :--- | :--- |
| **Legacy User Store Primary** | `E:\Rox\LegalSaathi\.data\users.json` | Active |
| **Legacy User Store Backup** | `E:\Rox\LegalSaathi\.data\users_backup_20260927_010341.json` | Verified Intact |
| **Identity Mapping Manifest** | `E:\Rox\LegalSaathi\.data\user_identity_mapping.json` | Verified Intact |
| **Profiles Schema Migration** | `E:\Rox\LegalSaathi\supabase\migrations\20260927000003_profiles_schema.sql` | Versioned |

---

## 3. Rollback Scenarios & Step-by-Step Instructions

### Scenario A: Instant Rollback to Local Authentication (Killswitch)

If Supabase Auth experiences an outage or network degradation:
1. In `E:\Rox\LegalSaathi\.env` (or `.env.local` for Next.js), comment out or unset the Supabase URL:
   ```ini
   # NEXT_PUBLIC_SUPABASE_URL=https://...
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
2. Restart the frontend server:
   ```bash
   npm run dev
   ```
3. **Outcome:** `isSupabaseConfigured()` immediately evaluates to `false`. The application instantly falls back to `src/lib/auth/user-store.ts`, validating existing seed accounts (`rajesh.kumar@example.com`, etc.) without any disruption.

---

### Scenario B: Restoring Corrupted User Data

If user accounts in `.data/users.json` become corrupted or malformed:
1. Restore the verified backup:
   ```powershell
   Copy-Item "E:\Rox\LegalSaathi\.data\users_backup_20260927_010341.json" -Destination "E:\Rox\LegalSaathi\.data\users.json" -Force
   ```
2. Verify file validity:
   ```bash
   python -c "import json; users = json.load(open('.data/users.json')); print('Restored users:', len(users))"
   ```

---

### Scenario C: Reversing Supabase PostgreSQL Profiles Schema

If the `public.profiles` table or triggers need to be rolled back in Supabase:
1. Run the following teardown SQL in the Supabase SQL Editor:
   ```sql
   -- Drop trigger and trigger function
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   DROP FUNCTION IF EXISTS public.handle_new_user();

   DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
   DROP FUNCTION IF EXISTS public.handle_profile_updated();

   -- Drop profiles table
   DROP TABLE IF EXISTS public.profiles CASCADE;
   ```

---

## 4. Verification After Rollback

After executing any rollback procedure, run the following verification checklist:
1. **Pytest Security Suite:**
   ```bash
   python -m pytest backend/tests
   ```
   *Expected:* 45/45 tests pass.
2. **Frontend Type Check:**
   ```bash
   npx tsc --noEmit
   ```
   *Expected:* 0 errors.
3. **Login Smoke Test:**
   * Navigate to `http://localhost:3000/login`.
   * Log in with `rajesh.kumar@example.com` / `secretPassword123`.
   * Confirm successful navigation to `/dashboard`.
