# Phase 19 — Row Level Security (RLS) & Authorization Report

**Project:** Legal Saathi  
**Database:** Supabase PostgreSQL (`thqoqnxhqluivesfsntl`)  
**Status:** **COMPLETE & VERIFIED (RLS ENABLED ON 12/12 TABLES, 14 POLICIES ACTIVE)**

---

## 1. RLS Table Audit & Status

Row-Level Security is strictly enabled on **all 12 tables** in the `public` schema. Live audit verification:

```sql
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public';
```

| # | Table Name | RLS Status | Policies Count | Primary Access Model |
|---|---|---|---|---|
| 1 | `subscription_plans` | **ENABLED** | 1 | Public read (active plans only) |
| 2 | `clusters` | **ENABLED** | 1 | Authenticated browse for collective actions |
| 3 | `sessions` | **ENABLED** | 2 | Session owner read/write + public intake insert |
| 4 | `cases` | **ENABLED** | 1 | Session/User owner isolated (`ALL`) |
| 5 | `incidents` | **ENABLED** | 1 | Case owner isolated (`ALL`) |
| 6 | `drafts` | **ENABLED** | 1 | Case owner isolated (`ALL`) |
| 7 | `audit_events` | **ENABLED** | 1 | User/Case owner read-only (`SELECT`) |
| 8 | `user_subscriptions` | **ENABLED** | 1 | User isolated (`SELECT`) |
| 9 | `payment_orders` | **ENABLED** | 1 | User isolated (`SELECT`) |
| 10 | `invoices` | **ENABLED** | 1 | User isolated (`SELECT`) |
| 11 | `collective_pool_contributions` | **ENABLED** | 1 | User isolated (`ALL`) |
| 12 | `profiles` | **ENABLED** | 2 | User read own profile (`SELECT`), update own profile (`UPDATE`) |

---

## 2. Policy Inventory & Matrix

| Table | Policy Name | Command | Enforcement Condition |
|---|---|---|---|
| `subscription_plans` | `Anyone can view active subscription plans` | SELECT | `is_active = 1` |
| `clusters` | `Authenticated users can browse collective action clusters` | SELECT | `status = 'active'` |
| `sessions` | `Users can access their own sessions` | ALL | `user_id = auth.uid()::text` |
| `sessions` | `Allow public intake session creation` | INSERT | `true` |
| `cases` | `Users can view and manage their own cases` | ALL | Linked via `sessions.user_id = auth.uid()::text` |
| `incidents` | `Users can view and manage their incidents` | ALL | Linked via `cases -> sessions.user_id = auth.uid()::text` |
| `drafts` | `Users can view and manage their legal drafts` | ALL | Linked via `cases -> sessions.user_id = auth.uid()::text` |
| `audit_events` | `Users can view audit events for their cases` | SELECT | User ID matches actor or target |
| `user_subscriptions` | `Users can view their subscriptions` | SELECT | `user_id = auth.uid()::text` |
| `payment_orders` | `Users can view their payment orders` | SELECT | `user_id = auth.uid()::text` |
| `invoices` | `Users can view their GST invoices` | SELECT | `user_id = auth.uid()::text` |
| `collective_pool_contributions` | `Users can view their pool contributions` | ALL | `user_id = auth.uid()::text` |
| `profiles` | `Users can read their own profile` | SELECT | `id = auth.uid()` |
| `profiles` | `Users can update their own profile` | UPDATE | `id = auth.uid()` |

---

## 3. Live Tenant Isolation Test Evidence

Tested against Supabase PostgREST endpoint:

1. **Anonymous API Read on `cases`:**
   - Request: `GET /rest/v1/cases?select=count` (with anon key)
   - Response: `HTTP 200 [{"count": 0}]` (Zero private rows exposed to unauthenticated callers)
2. **Anonymous API Read on `audit_events`:**
   - Request: `GET /rest/v1/audit_events?select=count` (with anon key)
   - Response: `HTTP 200 [{"count": 0}]` (Zero audit records exposed)
3. **Cross-Session IDOR Defense:**
   - Test `test_security.py::test_case_ownership_idor_prevention` PASSED: Attacker session attempting GET, PATCH, or DELETE on victim case receives `HTTP 403 Forbidden`.
