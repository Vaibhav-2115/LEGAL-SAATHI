# DATABASE SCHEMA MAPPING — LEGAL SAATHI

**Project:** Legal Saathi  
**Document:** SQLite to PostgreSQL / Supabase Schema Mapping Specification  
**Repository:** `E:\Rox\LegalSaathi`  
**Date:** 2026-09-27  

---

## 1. Overview of Data Type Conversions

SQLite uses dynamic type affinity where all datetimes and JSON structures are stored as plain `TEXT`. PostgreSQL provides rich native data types with strict validation. The mapping rules applied are:

| SQLite Storage Class | Target PostgreSQL Data Type | Transformation Rationale |
| :--- | :--- | :--- |
| `TEXT` (UUID / IDs) | `TEXT` | Preserves existing arbitrary length IDs (`case_651e7f6092`, `draft_123`) without forced UUID format conversion. |
| `TEXT` (ISO 8601 Timestamps) | `TIMESTAMPTZ` | Enables timezone-aware queries, interval calculations, and standard SQL date functions. Default: `NOW()`. |
| `TEXT` (JSON Strings) | `JSONB` | Enables binary JSON storage, indexing, and PostgreSQL jsonpath query operators (`->`, `->>`). |
| `INTEGER` (Booleans 0/1) | `INTEGER` | Preserves existing application integer representations (`0` / `1`) for `consent_stage1`, `is_active`, `cancel_at_period_end`. |
| `INTEGER` (Currency / Amounts) | `INTEGER` | Stores exact currency in paise / INR units without floating-point precision loss. |

---

## 2. Table-by-Table Schema Mapping

### 1. `sessions`
* **Purpose:** User conversation sessions and initial intake context.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `session_id` | `TEXT` | `session_id` | `TEXT` | No | `PRIMARY KEY` |
| `user_id` | `TEXT` | `user_id` | `TEXT` | Yes | None |
| `language_pref` | `TEXT` | `language_pref` | `TEXT` | Yes | `DEFAULT 'en'` |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | Yes | `DEFAULT NOW()` |

---

### 2. `subscription_plans`
* **Purpose:** Pricing tiers and subscription entitlements.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `plan_id` | `TEXT` | `plan_id` | `TEXT` | No | `PRIMARY KEY` |
| `name` | `TEXT` | `name` | `TEXT` | No | None |
| `tier` | `TEXT` | `tier` | `TEXT` | No | None |
| `amount_inr` | `INTEGER` | `amount_inr` | `INTEGER` | No | None |
| `billing_period` | `TEXT` | `billing_period` | `TEXT` | No | None |
| `features_json` | `TEXT` | `features_json` | `JSONB` | No | `DEFAULT '[]'::jsonb` |
| `is_active` | `INTEGER` | `is_active` | `INTEGER` | Yes | `DEFAULT 1` |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | No | `DEFAULT NOW()` |

---

### 3. `clusters`
* **Purpose:** Collective action issue clustering and pattern recognition.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `cluster_id` | `TEXT` | `cluster_id` | `TEXT` | No | `PRIMARY KEY` |
| `issue_type` | `TEXT` | `issue_type` | `TEXT` | Yes | None |
| `locality_bucket`| `TEXT` | `locality_bucket`| `TEXT` | Yes | None |
| `explanation_text`| `TEXT` | `explanation_text`| `TEXT` | Yes | None |
| `member_count` | `INTEGER` | `member_count` | `INTEGER` | Yes | `DEFAULT 0` |
| `incident_ids_json`| `TEXT` | `incident_ids_json`| `JSONB` | Yes | `DEFAULT '[]'::jsonb` |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | Yes | `DEFAULT NOW()` |
| `status` | `TEXT` | `status` | `TEXT` | Yes | `DEFAULT 'active'` |

---

### 4. `cases`
* **Purpose:** Core legal matters, citizen details, and AI triage findings.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `case_id` | `TEXT` | `case_id` | `TEXT` | No | `PRIMARY KEY` |
| `session_id` | `TEXT` | `session_id` | `TEXT` | Yes | `REFERENCES sessions(session_id) ON DELETE SET NULL` |
| `issue_type` | `TEXT` | `issue_type` | `TEXT` | Yes | None |
| `title` | `TEXT` | `title` | `TEXT` | Yes | None |
| `description` | `TEXT` | `description` | `TEXT` | Yes | None |
| `entities_json` | `TEXT` | `entities_json` | `JSONB` | Yes | `DEFAULT '{}'::jsonb` |
| `evidence_json` | `TEXT` | `evidence_json` | `JSONB` | Yes | `DEFAULT '[]'::jsonb` |
| `consent_status`| `TEXT` | `consent_status`| `TEXT` | Yes | `DEFAULT 'pending'` |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | Yes | `DEFAULT NOW()` |
| `updated_at` | `TEXT` | `updated_at` | `TIMESTAMPTZ` | Yes | `DEFAULT NOW()` |

---

### 5. `incidents`
* **Purpose:** Individual grievances linked to cases and aggregated into clusters.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `incident_id` | `TEXT` | `incident_id` | `TEXT` | No | `PRIMARY KEY` |
| `case_id` | `TEXT` | `case_id` | `TEXT` | Yes | `UNIQUE REFERENCES cases(case_id) ON DELETE CASCADE` |
| `cluster_id` | `TEXT` | `cluster_id` | `TEXT` | Yes | `REFERENCES clusters(cluster_id) ON DELETE SET NULL` |
| `issue_type` | `TEXT` | `issue_type` | `TEXT` | Yes | None |
| `locality_bucket`| `TEXT` | `locality_bucket`| `TEXT` | Yes | None |
| `amount_bucket` | `TEXT` | `amount_bucket` | `TEXT` | Yes | None |
| `opposing_party_hash`| `TEXT` | `opposing_party_hash`| `TEXT` | Yes | None |
| `consent_stage1`| `INTEGER` | `consent_stage1`| `INTEGER` | Yes | `DEFAULT 0` |
| `consent_stage2`| `INTEGER` | `consent_stage2`| `INTEGER` | Yes | `DEFAULT 0` |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | Yes | `DEFAULT NOW()` |

---

### 6. `drafts`
* **Purpose:** Automated legal notices, complaints, and RTI filings.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `draft_id` | `TEXT` | `draft_id` | `TEXT` | No | `PRIMARY KEY` |
| `case_id` | `TEXT` | `case_id` | `TEXT` | Yes | `REFERENCES cases(case_id) ON DELETE CASCADE` |
| `action_type` | `TEXT` | `action_type` | `TEXT` | Yes | None |
| `title` | `TEXT` | `title` | `TEXT` | Yes | None |
| `content` | `TEXT` | `content` | `TEXT` | Yes | None |
| `metadata_json` | `TEXT` | `metadata_json` | `JSONB` | Yes | `DEFAULT '{}'::jsonb` |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | Yes | `DEFAULT NOW()` |

---

### 7. `audit_events`
* **Purpose:** Security audit log and compliance traceability.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `event_id` | `TEXT` | `event_id` | `TEXT` | No | `PRIMARY KEY` |
| `actor` | `TEXT` | `actor` | `TEXT` | Yes | None |
| `action` | `TEXT` | `action` | `TEXT` | Yes | None |
| `target_id` | `TEXT` | `target_id` | `TEXT` | Yes | None |
| `details_json` | `TEXT` | `details_json` | `JSONB` | Yes | `DEFAULT '{}'::jsonb` |
| `timestamp` | `TEXT` | `timestamp` | `TIMESTAMPTZ` | Yes | `DEFAULT NOW()` |

---

### 8. `user_subscriptions`
* **Purpose:** Active subscription state per user.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `subscription_id` | `TEXT` | `subscription_id` | `TEXT` | No | `PRIMARY KEY` |
| `user_id` | `TEXT` | `user_id` | `TEXT` | No | None |
| `plan_id` | `TEXT` | `plan_id` | `TEXT` | No | `REFERENCES subscription_plans(plan_id)` |
| `status` | `TEXT` | `status` | `TEXT` | No | None |
| `current_period_start`| `TEXT` | `current_period_start`| `TIMESTAMPTZ` | No | None |
| `current_period_end` | `TEXT` | `current_period_end` | `TIMESTAMPTZ` | No | None |
| `gateway_subscription_id`| `TEXT` | `gateway_subscription_id`| `TEXT` | Yes | None |
| `cancel_at_period_end` | `INTEGER` | `cancel_at_period_end` | `INTEGER` | Yes | `DEFAULT 0` |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | No | `DEFAULT NOW()` |
| `updated_at` | `TEXT` | `updated_at` | `TIMESTAMPTZ` | No | `DEFAULT NOW()` |

---

### 9. `payment_orders`
* **Purpose:** Razorpay / Cashfree payment orders and checkout sessions.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `order_id` | `TEXT` | `order_id` | `TEXT` | No | `PRIMARY KEY` |
| `user_id` | `TEXT` | `user_id` | `TEXT` | No | None |
| `gateway_order_id`| `TEXT` | `gateway_order_id`| `TEXT` | Yes | `UNIQUE` |
| `item_type` | `TEXT` | `item_type` | `TEXT` | No | None |
| `item_ref_id` | `TEXT` | `item_ref_id` | `TEXT` | Yes | None |
| `amount_inr` | `INTEGER` | `amount_inr` | `INTEGER` | No | None |
| `currency` | `TEXT` | `currency` | `TEXT` | Yes | `DEFAULT 'INR'` |
| `status` | `TEXT` | `status` | `TEXT` | No | None |
| `signature` | `TEXT` | `signature` | `TEXT` | Yes | None |
| `metadata_json` | `TEXT` | `metadata_json` | `JSONB` | Yes | `DEFAULT '{}'::jsonb` |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | No | `DEFAULT NOW()` |
| `paid_at` | `TEXT` | `paid_at` | `TIMESTAMPTZ` | Yes | None |

---

### 10. `invoices`
* **Purpose:** Statutory GST tax invoices with SAC code 998311.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `invoice_id` | `TEXT` | `invoice_id` | `TEXT` | No | `PRIMARY KEY` |
| `order_id` | `TEXT` | `order_id` | `TEXT` | Yes | `UNIQUE REFERENCES payment_orders(order_id) ON DELETE CASCADE` |
| `user_id` | `TEXT` | `user_id` | `TEXT` | No | None |
| `customer_name`| `TEXT` | `customer_name`| `TEXT` | Yes | None |
| `customer_state`| `TEXT` | `customer_state`| `TEXT` | Yes | `DEFAULT 'Delhi'` |
| `sac_code` | `TEXT` | `sac_code` | `TEXT` | Yes | `DEFAULT '998311'` |
| `base_amount_inr`| `INTEGER` | `base_amount_inr`| `INTEGER` | No | None |
| `cgst_inr` | `INTEGER` | `cgst_inr` | `INTEGER` | Yes | `DEFAULT 0` |
| `sgst_inr` | `INTEGER` | `sgst_inr` | `INTEGER` | Yes | `DEFAULT 0` |
| `igst_inr` | `INTEGER` | `igst_inr` | `INTEGER` | Yes | `DEFAULT 0` |
| `total_amount_inr`| `INTEGER` | `total_amount_inr`| `INTEGER` | No | None |
| `invoice_pdf_url`| `TEXT` | `invoice_pdf_url`| `TEXT` | Yes | None |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | No | `DEFAULT NOW()` |

---

### 11. `collective_pool_contributions`
* **Purpose:** Community escrow pledges for shared advocate representation.

| SQLite Column | SQLite Type | PostgreSQL Column | PostgreSQL Type | Nullable | Constraints / Defaults |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `contribution_id`| `TEXT` | `contribution_id`| `TEXT` | No | `PRIMARY KEY` |
| `cluster_id` | `TEXT` | `cluster_id` | `TEXT` | No | `REFERENCES clusters(cluster_id) ON DELETE CASCADE` |
| `user_id` | `TEXT` | `user_id` | `TEXT` | No | None |
| `order_id` | `TEXT` | `order_id` | `TEXT` | Yes | `UNIQUE REFERENCES payment_orders(order_id) ON DELETE CASCADE` |
| `amount_inr` | `INTEGER` | `amount_inr` | `INTEGER` | No | None |
| `status` | `TEXT` | `status` | `TEXT` | Yes | `DEFAULT 'pledged'` |
| `created_at` | `TEXT` | `created_at` | `TIMESTAMPTZ` | No | `DEFAULT NOW()` |
