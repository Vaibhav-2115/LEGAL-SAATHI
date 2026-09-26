-- ==============================================================================
-- 20260927000005_row_level_security.sql
-- Legal Saathi — Row-Level Security Policies (Phase 19)
-- Enforces cross-user tenant isolation and least-privilege database access boundaries.
-- ==============================================================================

-- 1. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collective_pool_contributions ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policies
CREATE POLICY "Users can read their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- 3. Subscription Plans Policies (Public read-only master data)
CREATE POLICY "Anyone can view active subscription plans"
    ON public.subscription_plans FOR SELECT
    TO authenticated, anon
    USING (is_active = 1);

-- 4. Sessions Policies (Tenant isolation by user_id)
CREATE POLICY "Users can access their own sessions"
    ON public.sessions FOR ALL
    TO authenticated
    USING (user_id = auth.uid()::text)
    WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Allow public intake session creation"
    ON public.sessions FOR INSERT
    TO anon
    WITH CHECK (user_id IS NULL OR user_id = 'anon_citizen');

-- 5. Cases Policies (Access strictly through owning session)
CREATE POLICY "Users can view and manage their own cases"
    ON public.cases FOR ALL
    TO authenticated
    USING (
        session_id IN (
            SELECT session_id FROM public.sessions WHERE user_id = auth.uid()::text
        )
    )
    WITH CHECK (
        session_id IN (
            SELECT session_id FROM public.sessions WHERE user_id = auth.uid()::text
        )
    );

-- 6. Incidents Policies (Access through owning case)
CREATE POLICY "Users can view and manage their incidents"
    ON public.incidents FOR ALL
    TO authenticated
    USING (
        case_id IN (
            SELECT c.case_id FROM public.cases c
            JOIN public.sessions s ON c.session_id = s.session_id
            WHERE s.user_id = auth.uid()::text
        )
    )
    WITH CHECK (
        case_id IN (
            SELECT c.case_id FROM public.cases c
            JOIN public.sessions s ON c.session_id = s.session_id
            WHERE s.user_id = auth.uid()::text
        )
    );

-- 7. Drafts Policies (Access through owning case)
CREATE POLICY "Users can view and manage their legal drafts"
    ON public.drafts FOR ALL
    TO authenticated
    USING (
        case_id IN (
            SELECT c.case_id FROM public.cases c
            JOIN public.sessions s ON c.session_id = s.session_id
            WHERE s.user_id = auth.uid()::text
        )
    )
    WITH CHECK (
        case_id IN (
            SELECT c.case_id FROM public.cases c
            JOIN public.sessions s ON c.session_id = s.session_id
            WHERE s.user_id = auth.uid()::text
        )
    );

-- 8. Billing & Payments: user_subscriptions, payment_orders, invoices
CREATE POLICY "Users can view their subscriptions"
    ON public.user_subscriptions FOR SELECT
    TO authenticated
    USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view their payment orders"
    ON public.payment_orders FOR SELECT
    TO authenticated
    USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view their GST invoices"
    ON public.invoices FOR SELECT
    TO authenticated
    USING (user_id = auth.uid()::text);

-- 9. Collective Actions: clusters & pool contributions
CREATE POLICY "Authenticated users can browse collective action clusters"
    ON public.clusters FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can view their pool contributions"
    ON public.collective_pool_contributions FOR ALL
    TO authenticated
    USING (user_id = auth.uid()::text)
    WITH CHECK (user_id = auth.uid()::text);

-- 10. Audit Events (Read-only for audit logs associated with user's cases)
CREATE POLICY "Users can view audit events for their cases"
    ON public.audit_events FOR SELECT
    TO authenticated
    USING (
        target_id IN (
            SELECT c.case_id FROM public.cases c
            JOIN public.sessions s ON c.session_id = s.session_id
            WHERE s.user_id = auth.uid()::text
        )
    );
