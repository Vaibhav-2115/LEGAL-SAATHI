# AUTHENTICATION FLOW DOCUMENTATION — LEGAL SAATHI

**Project:** Legal Saathi  
**Document:** End-to-End Authentication & Authorization Workflows  
**Repository:** `E:\Rox\LegalSaathi`  
**Date:** 2026-09-27  

---

## 1. Registration Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Citizen
    participant UI as Registration Page (/register)
    participant API as /api/auth/register
    participant SB as Supabase Auth (GoTrue)
    participant DB as public.profiles (PostgreSQL)

    Citizen->>UI: Enters name, email, password, DPDP consent
    UI->>API: POST /api/auth/register {name, email, password, consentDpdp}
    alt Supabase is Configured
        API->>SB: supabase.auth.signUp(email, password, metadata)
        SB->>DB: Trigger on_auth_user_created -> INSERT INTO public.profiles
        SB-->>API: Returns User & Session (or verification required)
        API-->>UI: {success: true, user, provider: "supabase"}
    else Local Fallback
        API->>API: createUser() in user-store.ts
        API-->>UI: {success: true, user, provider: "local_store"}
    end
    UI->>Citizen: Redirects to /dashboard
```

---

## 2. Login Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Citizen
    participant UI as Login Page (/login)
    participant API as /api/auth/login
    participant SB as Supabase Auth
    participant Cookie as HttpOnly Session Cookie

    Citizen->>UI: Enters email and password
    UI->>API: POST /api/auth/login {email, password, rememberMe}
    alt Supabase Login
        API->>SB: supabase.auth.signInWithPassword()
        alt Success
            SB-->>API: Returns Access Token & User Metadata
            API->>Cookie: Sets SESSION_COOKIE_NAME with verified JWT
            API-->>UI: {success: true, user, provider: "supabase"}
        else Invalid Credentials in Supabase
            API->>API: Checks validateCredentials() in local user store
            alt Local Match Found (Lazy Migration)
                API->>Cookie: Sets SESSION_COOKIE_NAME
                API-->>UI: {success: true, user, provider: "local_store"}
            else No Match
                API-->>UI: 401 Unauthorized {error: "Invalid credentials"}
            end
        end
    else Local Fallback Mode
        API->>API: validateCredentials(email, password)
        API->>Cookie: Sets SESSION_COOKIE_NAME
        API-->>UI: {success: true, user}
    end
    UI->>Citizen: Navigates to callbackUrl or /dashboard
```

---

## 3. Session Refresh & Middleware Protection

1. **Request Interception:**
   Every incoming HTTP request to protected paths (`/dashboard`, `/cases`, `/complaints`, `/chat`, `/draft`, `/actions`) is intercepted by `src/middleware.ts`.
2. **Supabase Token Refresh:**
   Middleware executes `updateSession(request)` via `@/lib/supabase/middleware`. If a refresh token is present, it exchanges it with Supabase Auth and updates the client cookies.
3. **Session Verification:**
   * If an active Supabase user is returned, request proceeds.
   * If a local JWT session cookie is valid (`verifyJwt`), request proceeds.
   * If neither is present, request is redirected to `/login?callbackUrl=<requested-path>`.
4. **Already-Authenticated Redirection:**
   If an authenticated citizen visits `/login` or `/register`, they are redirected to `/dashboard`.

---

## 4. Google OAuth Flow

1. Citizen clicks **"Continue with Google"** on `/login`.
2. Browser navigates to `/api/auth/google?callbackUrl=/dashboard`.
3. If Supabase is configured:
   * Calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/api/auth/callback/supabase' } })`.
   * User authenticates with Google consent screen.
   * Google redirects back to `/api/auth/callback/supabase?code=...`.
   * Callback exchanges `code` for session via `exchangeCodeForSession`.
   * User profile is automatically created in `public.profiles`.
   * User is redirected to `/dashboard`.
4. If Google credentials are not yet configured in Supabase or environment, redirects to `/login?error=OAuthConfigurationRequired` with clear setup instructions.

---

## 5. Password Reset & Account Recovery

1. **Citizen Request:** Citizen submits email address for password recovery.
2. **Recovery Email:** System calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/reset-password' })`.
3. **Password Update:** User clicks link in email, arrives at password reset page with recovery token.
4. **Submission:** User enters new password, and client calls `supabase.auth.updateUser({ password: newPassword })`.

---

## 6. Backend API Token Verification & Authorization (FastAPI)

1. **Authorization Header:** Frontend sends Bearer token in API requests:
   ```http
   Authorization: Bearer eyJhbGciOiAiSFMyNTYi...
   ```
2. **Signature Verification (`verify_supabase_jwt`):**
   * Decodes JWT header and payload.
   * Computes HMAC-SHA256 signature against `SUPABASE_SERVICE_ROLE_KEY` or `SECRET_KEY`.
   * Validates `exp` timestamp to ensure token has not expired.
   * Extracts user ID (`sub`), email, and role.
3. **Role-Based Access Enforcement (`require_role`):**
   * Specific administrative or advocate routes use the dependency `Depends(require_role(['LEGAL_AID_ADVOCATE', 'DLSA_OFFICER']))`.
   * Rejects unauthorized citizen users with `403 Forbidden` (`insufficient_permissions`).
