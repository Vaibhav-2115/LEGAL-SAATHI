# Legal Saathi - Security Architecture & Hardening Guide

## 1. Security Architecture Overview
Legal Saathi is an evidence-grounded legal assistant for Indian citizens. Because the application handles citizen grievances, legal disputes, statutory citations, and draft legal documents (Notices, RTI, e-FIR), strong security and privacy-by-design guarantees are enforced across every architectural layer.

```
                    +------------------------------------+
                    |  Citizen Client / Web Interface   |
                    +-----------------+------------------+
                                      |
                       HTTPS + Strict Security Headers
                       X-Session-ID / Bearer Token
                                      |
                                      v
                    +-----------------+------------------+
                    | FastAPI Centralized Middleware     |
                    | - Security Headers (CSP, HSTS)    |
                    | - Tight CORS Origin Whitelist      |
                    | - Sliding Window Rate Limiter      |
                    +-----------------+------------------+
                                      |
                                      v
                    +-----------------+------------------+
                    | Authorization & Safety Layer       |
                    | - enforce_case_ownership() [IDOR]  |
                    | - check_prompt_injection()         |
                    | - SSRF URL Validator               |
                    | - File Upload Sanitizer & Ceiling  |
                    +-----------------+------------------+
                                      |
                                      v
                    +-----------------+------------------+
                    | Application & Business Logic       |
                    | - Pydantic Server-Side Validation  |
                    | - Informed 2-Stage Consent Gates   |
                    +-----------------+------------------+
                                      |
                                      v
                    +-----------------+------------------+
                    | SQLite Persistence / Logical RLS   |
                    | - Parameterized Prepared Queries   |
                    | - Session Isolation & Audit Log    |
                    +------------------------------------+
```

---

## 2. Authentication Approach
- **Session Identification (`X-Session-ID` Header):**
  - Lightweight, privacy-preserving session identifiers.
  - Ephemeral fallback generated via UUID4 if header is omitted.
  - Regex sanitization pattern `^[a-zA-Z0-9_\-\.]{1,64}$` rejects control characters, path traversal (`../`), SQL fragments, and excess length.
- **Session Bounding:**
  - Cases, drafts, and incidents are strictly tied to the originating session.
  - Client-supplied `session_id` in request bodies is never trusted to overwrite or spoof another citizen's session.

---

## 3. Authorization & IDOR Defense
- **Enforced Case Ownership (`enforce_case_ownership`):**
  - Any attempt to read (`GET /cases/{case_id}`), update (`PATCH /cases/{case_id}`), or delete (`DELETE /cases/{case_id}`) a case by a different session returns `403 Forbidden`.
  - All action modules (`/actions/notice`, `/actions/rti`, `/actions/efir`, `/actions/checklist`) verify that the referenced `case_id` belongs to the active session before processing.
- **Informed Consent Gates:**
  - Submitting an incident to the collective pattern detection engine (`POST /incidents`) strictly enforces Stage 1 explicit consent (`consent_flag: True`). Submissions without consent are rejected with `400 Bad Request`.
  - Only the owner of the case can submit it into the pattern clustering corpus.

---

## 4. Database Security & Supabase Row-Level Security (RLS)
- **Parameterized SQL & Connection Pooling:** All database interactions utilize parameterized SQL queries executed over encrypted SSL connections to Supabase PostgreSQL poolers (`aws-0-ap-southeast-2.pooler.supabase.com:5432`). Zero string concatenation is permitted.
- **Production Row-Level Security (RLS) Policies:**
  - `profiles`: Strictly scoped to `auth.uid() = id`.
  - `cases`: Enforces ownership via `auth.uid() = user_id` for authenticated users, and matches anonymous `x-session-id` headers for unauthenticated dockets.
  - `evidence` & `legal_drafts`: Access is strictly bounded by foreign key ownership to the parent case docket.
  - `legal_sources`: Open read-only access ensuring universal statutory transparency without mutation permissions.
- **Append-Only Audit Trail:** Critical operations are logged to the audit ledger with actor identity, timestamp, IP hash, and event metadata.

---

## 5. Server-Side Validation & Input Hardening
- **Pydantic Validation:** Every endpoint validates types, required fields, and boundary constraints.
  - String length constraints (names, addresses, queries, subjects).
  - Numeric range bounds (disputed amounts capped at ₹1,000,000,000; statutory notice days bounded between 1 and 180 days).
  - Array length bounds (facts: max 30; demands: max 15; queries: max 30).
- **Prompt Injection Defense (`check_prompt_injection`):**
  - Detects and rejects system prompt overrides, delimiter attacks, and roleplay jailbreaks (`"ignore all previous instructions"`, `"system role:"`, etc.).
- **Filename Sanitization:** Filenames are stripped of path traversal characters (`..`, `/`, `\`) using `sanitize_filename()`.

---

## 6. SSRF & File Upload Security
- **SSRF Prevention (`is_safe_public_url`):**
  - Validates scheme to only allow `http` and `https`.
  - Performs DNS resolution on hostnames.
  - Blocks loopback (`127.0.0.1`, `localhost`, `::1`), private IP ranges (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local metadata addresses (`169.254.169.254`), and multicast/reserved networks.
  - Streams downloaded audio with a strict 25MB ceiling.
- **File Upload Protection:**
  - Whitelist of allowed audio extensions: `.wav`, `.mp3`, `.webm`, `.m4a`, `.ogg`, `.flac`.
  - Chunked streaming with maximum file size capped at 25MB (`MAX_AUDIO_BYTES`), returning `413 Payload Too Large` if exceeded.
  - Rejection of empty file uploads.

---

## 7. Rate Limiting & Denial-of-Service Defense
- **Sliding Window In-Memory Rate Limiter:**
  - Tracks requests per session/IP over a 60-second sliding window (default 60 req/min).
  - Attached to compute/AI-intensive endpoints: `/chat`, `/voice/stt`, `/voice/stt/upload`, `/voice/tts`, `/retrieval/search`, and `/clustering/run`.
  - Thread-safe via `threading.Lock()` and protected against memory leaks via periodic background cleanup of stale session keys.

---

## 8. HTTP Security Headers & CORS
- **Security Headers Middleware:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (Clickjacking prevention)
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(self), camera=()`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (enforced in production)
- **CORS Hardening:**
  - Default wildcard `"*"` removed.
  - Explicit trusted origins only (`localhost:3000`, `127.0.0.1:3000`, `localhost:8000`).
  - Restricts allowed HTTP methods to `GET`, `POST`, `PATCH`, `DELETE`, `OPTIONS`.

---

## 9. Deployment Best Practices
1. **Production Environment Flag:** Set `ENVIRONMENT=production` in `.env`.
2. **Reverse Proxy & TLS:** Deploy behind Nginx, Caddy, or Cloudflare with TLS 1.3 enabled.
3. **Database File Protection:** Ensure `legal_saathi.db` permissions are restricted to the application user (`chmod 600 legal_saathi.db`).
4. **Environment Variables:** Never commit `.env` to version control. Use `.env.example` as a template.
5. **Run Non-Root:** Ensure the container/process runs under an unprivileged user (e.g. `appuser`).

---

## 10. Incident Response & Credential Rotation
If any external API key (`GEMINI_API_KEY`, `OPENAI_API_KEY`) or `SECRET_KEY` is suspected of compromise:
1. **Revoke Immediately:**
   - Google AI Studio: Revoke compromised key and generate a fresh API key.
   - OpenAI Platform: Revoke compromised Whisper key and generate a new key.
2. **Update Environment:** Update the key in `.env` or cloud secret manager (AWS Secrets Manager, GCP Secret Manager).
3. **Restart Service:** Restart the FastAPI backend service (`uvicorn` / `systemd` / container).
4. **Audit Logs:** Inspect `audit_events` in `legal_saathi.db` for anomalous operations during the suspected compromise window.

---

## 11. Known Limitations & Items Requiring Manual Verification
- [NEEDS MANUAL VERIFICATION] **Database Backups:** Ensure periodic encrypted backups of `legal_saathi.db` are scheduled.
- [NEEDS MANUAL VERIFICATION] **Production HTTPS Deployment:** Ensure your hosting environment (Nginx/Cloudflare) terminates TLS and forwards `X-Forwarded-Proto: https`.
- [NEEDS MANUAL VERIFICATION] **External Secret Store:** In distributed cloud deployments (Kubernetes/Cloud Run), transition from `.env` files to cloud secret managers.
