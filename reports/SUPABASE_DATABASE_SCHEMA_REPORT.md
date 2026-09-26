# Supabase Database Schema Report — Legal Saathi

**Project Reference:** `thqoqnxhqluivesfsntl`  
**Host:** `aws-0-ap-southeast-2.pooler.supabase.com:5432`  
**Engine:** PostgreSQL 17.6 (`public` schema)  
**Timestamp:** 2026-09-27T03:25:00Z  

---

## 1. Schema Inventory & Entity-to-Model Mapping

| Table Name | Primary Key | Foreign Keys | Key Indexes | RLS Status | SQLAlchemy / Pydantic Entity |
|---|---|---|---|:---:|---|
| `subscription_plans` | `plan_id` (TEXT) | None | `idx_sub_plans_tier` | **ENABLED** | `SubscriptionPlan` |
| `clusters` | `cluster_id` (TEXT) | None | `idx_clusters_issue_type`, `idx_clusters_status` | **ENABLED** | `Cluster` |
| `sessions` | `session_id` (TEXT) | None | `idx_sessions_user` | **ENABLED** | `Session` |
| `cases` | `case_id` (TEXT) | `session_id -> sessions(session_id)` | `idx_cases_session`, `idx_cases_issue_type` | **ENABLED** | `Case` |
| `incidents` | `incident_id` (TEXT) | `case_id -> cases`, `cluster_id -> clusters` | `idx_incidents_case`, `idx_incidents_cluster` | **ENABLED** | `Incident` |
| `drafts` | `draft_id` (TEXT) | `case_id -> cases(case_id)` | `idx_drafts_case` | **ENABLED** | `Draft` |
| `audit_events` | `event_id` (TEXT) | None | `idx_audit_events_target`, `idx_audit_events_timestamp` | **ENABLED** | `AuditEvent` |
| `user_subscriptions` | `subscription_id` (TEXT) | `plan_id -> subscription_plans(plan_id)` | `idx_user_subscriptions_user` | **ENABLED** | `UserSubscription` |
| `payment_orders` | `order_id` (TEXT) | None | `idx_payment_orders_user`, `idx_payment_orders_gateway` | **ENABLED** | `PaymentOrder` |
| `invoices` | `invoice_id` (TEXT) | `order_id -> payment_orders(order_id)` | `idx_invoices_user`, `idx_invoices_order` | **ENABLED** | `Invoice` |
| `collective_pool_contributions` | `contribution_id` (TEXT) | `cluster_id -> clusters`, `order_id -> payment_orders` | `idx_pool_contrib_cluster`, `idx_pool_contrib_user` | **ENABLED** | `CollectiveContribution` |
| `profiles` | `id` (UUID) | `id -> auth.users(id) ON DELETE CASCADE` | `idx_profiles_role`, `idx_profiles_email` | **ENABLED** | `UserProfile` |

---

## 2. Table Column Definitions

### 1. `profiles`
- `id`: UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
- `email`: TEXT
- `full_name`: TEXT NOT NULL
- `phone`: TEXT
- `role`: TEXT DEFAULT 'CITIZEN' (CHECK role IN ('CITIZEN', 'LEGAL_AID_ADVOCATE', 'FACULTY_ADMIN'))
- `docket_id`: TEXT
- `avatar_url`: TEXT
- `consent_dpdp`: BOOLEAN DEFAULT true
- `legacy_user_id`: TEXT
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

### 2. `cases`
- `case_id`: TEXT PRIMARY KEY
- `session_id`: TEXT REFERENCES sessions(session_id)
- `issue_type`: TEXT NOT NULL
- `title`: TEXT NOT NULL
- `description`: TEXT
- `entities_json`: JSONB DEFAULT '{}'
- `evidence_json`: JSONB DEFAULT '[]'
- `consent_status`: TEXT DEFAULT 'pending'
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

### 3. `sessions`
- `session_id`: TEXT PRIMARY KEY
- `user_id`: TEXT NOT NULL
- `language_pref`: TEXT DEFAULT 'en'
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 4. `invoices`
- `invoice_id`: TEXT PRIMARY KEY
- `order_id`: TEXT REFERENCES payment_orders(order_id)
- `user_id`: TEXT NOT NULL
- `customer_name`: TEXT
- `customer_state`: TEXT DEFAULT 'Delhi'
- `sac_code`: TEXT DEFAULT '998311'
- `base_amount_inr`: BIGINT NOT NULL
- `cgst_inr`: BIGINT DEFAULT 0
- `sgst_inr`: BIGINT DEFAULT 0
- `igst_inr`: BIGINT DEFAULT 0
- `total_amount_inr`: BIGINT NOT NULL
- `invoice_pdf_url`: TEXT
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
