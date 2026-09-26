-- ==============================================================================
-- Legal Saathi - Initial PostgreSQL Database Schema Migration
-- Migration ID: 20260927000001_initial_schema
-- Engine: PostgreSQL 15+ / Supabase PostgreSQL
-- Tables: 11
-- ==============================================================================

-- 1. Sessions Table (User conversation sessions and intake state)
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT,
    language_pref TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subscription Plans Master Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    plan_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT NOT NULL,
    amount_inr INTEGER NOT NULL,
    billing_period TEXT NOT NULL,
    features_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Clusters Table (Collective Action Pattern Aggregation)
CREATE TABLE IF NOT EXISTS clusters (
    cluster_id TEXT PRIMARY KEY,
    issue_type TEXT,
    locality_bucket TEXT,
    explanation_text TEXT,
    member_count INTEGER DEFAULT 0,
    incident_ids_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active'
);

-- 4. Cases Table (Formal Legal Matters and Triage Data)
CREATE TABLE IF NOT EXISTS cases (
    case_id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(session_id) ON DELETE SET NULL,
    issue_type TEXT,
    title TEXT,
    description TEXT,
    entities_json JSONB DEFAULT '{}'::jsonb,
    evidence_json JSONB DEFAULT '[]'::jsonb,
    consent_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Incidents Table (Individual Grievance Events Linked to Cases)
CREATE TABLE IF NOT EXISTS incidents (
    incident_id TEXT PRIMARY KEY,
    case_id TEXT UNIQUE REFERENCES cases(case_id) ON DELETE CASCADE,
    cluster_id TEXT REFERENCES clusters(cluster_id) ON DELETE SET NULL,
    issue_type TEXT,
    locality_bucket TEXT,
    amount_bucket TEXT,
    opposing_party_hash TEXT,
    consent_stage1 INTEGER DEFAULT 0,
    consent_stage2 INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Drafts Table (Court-Ready Notices, RTI Drafts, Complaints)
CREATE TABLE IF NOT EXISTS drafts (
    draft_id TEXT PRIMARY KEY,
    case_id TEXT REFERENCES cases(case_id) ON DELETE CASCADE,
    action_type TEXT,
    title TEXT,
    content TEXT,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Events Table (Tamper-Evident Append-Only Log)
CREATE TABLE IF NOT EXISTS audit_events (
    event_id TEXT PRIMARY KEY,
    actor TEXT,
    action TEXT,
    target_id TEXT,
    details_json JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 8. User Subscriptions Table (Active Citizen & Advocate Subscriptions)
CREATE TABLE IF NOT EXISTS user_subscriptions (
    subscription_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL REFERENCES subscription_plans(plan_id),
    status TEXT NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    gateway_subscription_id TEXT,
    cancel_at_period_end INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payment Orders & Transactions Table (Razorpay / Cashfree)
CREATE TABLE IF NOT EXISTS payment_orders (
    order_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    gateway_order_id TEXT UNIQUE,
    item_type TEXT NOT NULL,
    item_ref_id TEXT,
    amount_inr INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL,
    signature TEXT,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- 10. Invoices Table (GST SAC Code 998311 Compliant)
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id TEXT PRIMARY KEY,
    order_id TEXT UNIQUE REFERENCES payment_orders(order_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    customer_name TEXT,
    customer_state TEXT DEFAULT 'Delhi',
    sac_code TEXT DEFAULT '998311',
    base_amount_inr INTEGER NOT NULL,
    cgst_inr INTEGER DEFAULT 0,
    sgst_inr INTEGER DEFAULT 0,
    igst_inr INTEGER DEFAULT 0,
    total_amount_inr INTEGER NOT NULL,
    invoice_pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Collective Action Pool Contributions (Community Legal Escrow)
CREATE TABLE IF NOT EXISTS collective_pool_contributions (
    contribution_id TEXT PRIMARY KEY,
    cluster_id TEXT NOT NULL REFERENCES clusters(cluster_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    order_id TEXT UNIQUE REFERENCES payment_orders(order_id) ON DELETE CASCADE,
    amount_inr INTEGER NOT NULL,
    status TEXT DEFAULT 'pledged',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Performance & Query Optimization Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_cases_session_id ON cases(session_id);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);
CREATE INDEX IF NOT EXISTS idx_incidents_cluster_id ON incidents(cluster_id);
CREATE INDEX IF NOT EXISTS idx_drafts_case_id ON drafts(case_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_target_id ON audit_events(target_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp);
