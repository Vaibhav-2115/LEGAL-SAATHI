import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth/jwt';
import { findUserById } from '@/lib/auth/user-store';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';

import { isSupabaseConfigured } from '@/lib/supabase/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // 1. Check Supabase Auth session first if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const {
          data: { user: sbUser },
        } = await supabase.auth.getUser();

        if (sbUser) {
          return NextResponse.json({
            authenticated: true,
            provider: 'supabase',
            user: {
              id: sbUser.id,
              email: sbUser.email || '',
              name:
                (sbUser.user_metadata?.full_name as string) ||
                (sbUser.user_metadata?.name as string) ||
                sbUser.email?.split('@')[0] ||
                'Citizen User',
              role: ((sbUser.user_metadata?.role as string) || 'CITIZEN') as
                | 'CITIZEN'
                | 'LEGAL_AID_ADVOCATE'
                | 'DLSA_OFFICER',
              docketId: (sbUser.user_metadata?.docket_id as string) || 'LS-2026-0042',
              createdAt: sbUser.created_at,
            },
          });
        }
      } catch (sbErr) {
        console.warn('[Auth API] Supabase session retrieval error; checking local cookie fallback:', sbErr);
      }
    }

    // 2. Fall back to local cookie session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const payload = await verifyJwt(sessionCookie.value);

    if (!payload || !payload.sub) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Verify user exists in registry
    const userRecord = await findUserById(payload.sub);
    const user = userRecord
      ? {
          id: userRecord.id,
          email: userRecord.email,
          name: userRecord.name,
          role: userRecord.role,
          docketId: userRecord.docketId,
          createdAt: userRecord.createdAt,
        }
      : {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role,
          docketId: payload.docketId,
        };

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('[Auth API] Session check error:', error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}
