-- ==============================================================================
-- Legal Saathi - Supabase User Profiles Schema & Auth Triggers
-- Migration ID: 20260927000003_profiles_schema
-- Engine: PostgreSQL 15+ / Supabase Auth
-- ==============================================================================

-- 1. Create Public User Profiles Table linked to Supabase auth.users
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

-- Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_legacy_id ON public.profiles(legacy_user_id);

-- 2. Trigger Function: Automatically create profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        phone,
        role,
        docket_id,
        avatar_url,
        consent_dpdp,
        legacy_user_id,
        created_at,
        updated_at
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            split_part(new.email, '@', 1)
        ),
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
    SET 
        full_name = EXCLUDED.full_name,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = NOW();

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Automatically update updated_at on profile edit
CREATE OR REPLACE FUNCTION public.handle_profile_updated()
RETURNS trigger AS $$
BEGIN
    new.updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_profile_updated();
