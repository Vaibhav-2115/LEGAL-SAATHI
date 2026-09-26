# USER MIGRATION REPORT — LEGAL SAATHI

**Project:** Legal Saathi  
**Document:** Legacy User Store to Supabase Auth & Profiles Migration Report  
**Repository:** `E:\Rox\LegalSaathi`  
**Date:** 2026-09-27  

---

## 1. Executive Summary

This report documents the migration analysis, account identity mapping, and recovery strategy for all existing user accounts in Legal Saathi transitioning from the legacy JSON/in-memory store to Supabase Authentication.

* **Source User Store:** `src/lib/auth/user-store.ts` and `.data/users.json`
* **Backup Created:** `.data/users_backup_20260927_010341.json`
* **Total Legacy Users Discovered:** 3
* **Unique Email Addresses:** 3
* **Duplicate Accounts:** 0
* **Malformed / Invalid Records:** 0
* **Unresolved Accounts:** 0
* **Password Hashing Compatibility:** Incompatible (Node.js `scrypt` vs Supabase GoTrue `bcrypt`)
* **Password Migration Strategy:** Account recovery link / lazy credential upgrade

---

## 2. Source User Inventory & Account Audit

| Legacy ID | Email Address | Full Name | Application Role | Docket ID | Account Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `usr_rajesh_kumar` | `rajesh.kumar@example.com` | Rajesh Kumar | `CITIZEN` | `LS-2026-0042` | Audited & Valid |
| `usr_kavitha_r` | `kavitha.r@example.com` | Kavitha R. | `CITIZEN` | `LS-2026-0042` | Audited & Valid |
| `usr_adv_sharma` | `advocate.sharma@delhibar.in` | Adv. Vikram Sharma | `LEGAL_AID_ADVOCATE` | N/A | Audited & Valid |

---

## 3. Account Identity Mapping Table

To guarantee stability across migration runs and prevent identity collisions, each legacy user is assigned a deterministic Supabase UUID generated via UUIDv5 (using the RFC 4122 DNS namespace and normalized email address):

| Legacy User ID | Deterministic Supabase UUID | Normalized Email | Migrated Role | Target Profile ID |
| :--- | :--- | :--- | :--- | :--- |
| `usr_rajesh_kumar` | `21010812-894b-547f-bfbd-0b9b8a476712` | `rajesh.kumar@example.com` | `CITIZEN` | `21010812-894b-547f-bfbd-0b9b8a476712` |
| `usr_kavitha_r` | `27177ce8-8026-595b-b202-6769c20716c0` | `kavitha.r@example.com` | `CITIZEN` | `27177ce8-8026-595b-b202-6769c20716c0` |
| `usr_adv_sharma` | `25165438-bfd8-505d-8007-eceda2852723` | `advocate.sharma@delhibar.in` | `LEGAL_AID_ADVOCATE` | `25165438-bfd8-505d-8007-eceda2852723` |

The complete identity mapping manifest is archived in `.data/user_identity_mapping.json`.

---

## 4. Password Migration & Security Strategy

### The Technical Incompatibility:
* Legacy accounts were secured using a custom Node.js `scrypt` hashing implementation (`scrypt:salt:key`).
* Supabase Auth (GoTrue) natively expects `bcrypt` or handles its own cryptographic hashing during password creation.
* Injecting foreign scrypt hashes directly into `auth.users` encrypted password fields would cause authentication failures.

### The Production Migration Solution:
1. **Provisioning via Supabase Admin API:**
   Existing accounts are created via `supabase.auth.admin.createUser` with `email_confirm: true` and profile metadata pre-populated in `public.profiles`.
2. **Dual-Path Authentication (Zero User Friction):**
   * **Path 1 (Lazy Upgrade):** When an existing user logs in with their known password on `/login`, if Supabase Auth returns invalid credentials, the system verifies their password against the preserved legacy `user-store.ts`. Upon successful legacy verification, the backend automatically updates the user's password in Supabase via `admin.updateUserById`, immediately upgrading them to native Supabase bcrypt!
   * **Path 2 (Password Reset / Recovery):** For dormant accounts or forgotten passwords, the standard Supabase password recovery flow (`supabase.auth.resetPasswordForEmail`) allows citizens to set a new password securely.

---

## 5. Migration Execution Statistics

| Metric | Count | Verification Status |
| :--- | :---: | :---: |
| Source Users Discovered | **3** | Verified |
| Accounts with Valid Role Mapping | **3** | Verified (`CITIZEN` and `LEGAL_AID_ADVOCATE`) |
| Accounts Staged for Supabase Auth | **3** | Verified |
| Profiles Staged for `public.profiles` | **3** | Verified |
| Duplicate Email Accounts | **0** | Verified |
| Malformed / Unresolved Records | **0** | Verified |
| Accounts Handled via Lazy Upgrade / Recovery | **3** | Verified |

---

## 6. Data Preservation & Backup Locations

1. **Original User Store Backup:**  
   `E:\Rox\LegalSaathi\.data\users_backup_20260927_010341.json`
2. **Active Legacy User Registry:**  
   `E:\Rox\LegalSaathi\.data\users.json`
3. **Identity Mapping Manifest:**  
   `E:\Rox\LegalSaathi\.data\user_identity_mapping.json`
4. **Migration Runner Script:**  
   `E:\Rox\LegalSaathi\scripts\migrate_users_to_supabase.py`
