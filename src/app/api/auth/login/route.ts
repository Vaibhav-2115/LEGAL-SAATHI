import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateCredentials } from '@/lib/auth/user-store';
import { signJwt } from '@/lib/auth/jwt';
import {
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
} from '@/lib/auth/cookies';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe = true } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email address and password are required.' },
        { status: 400 }
      );
    }

    // 1. Attempt Supabase Auth if cloud project is configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (!error && data?.user) {
          const authUser = {
            id: data.user.id,
            email: data.user.email || email,
            name:
              (data.user.user_metadata?.full_name as string) ||
              (data.user.user_metadata?.name as string) ||
              email.split('@')[0],
            role: ((data.user.user_metadata?.role as string) || 'CITIZEN') as
              | 'CITIZEN'
              | 'LEGAL_AID_ADVOCATE'
              | 'DLSA_OFFICER',
            docketId: (data.user.user_metadata?.docket_id as string) || 'LS-2026-0042',
            createdAt: data.user.created_at,
          };

          // Also set local session cookie for unified middleware compatibility
          const token = await signJwt({
            sub: authUser.id,
            email: authUser.email,
            name: authUser.name,
            role: authUser.role,
            docketId: authUser.docketId,
          });

          const cookieStore = await cookies();
          cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(rememberMe));

          return NextResponse.json({
            success: true,
            user: authUser,
            provider: 'supabase',
            message: 'Citizen authenticated successfully via Supabase.',
          });
        }
      } catch (sbErr) {
        console.warn('[Auth API] Supabase login attempted but failed; trying local user store fallback:', sbErr);
      }
    }

    // 2. Fallback to local user store (preserves seed users and offline demo mode)
    const user = await validateCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            'The email or password entered does not match our records. Please verify and try again.',
        },
        { status: 401 }
      );
    }

    // Create cryptographic JWT session token
    const token = await signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      docketId: user.docketId,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(rememberMe));

    return NextResponse.json({
      success: true,
      user,
      provider: 'local_store',
      message: 'Citizen authenticated successfully.',
    });
  } catch (error) {
    console.error('[Auth API] Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected internal error occurred during authentication.' },
      { status: 500 }
    );
  }
}
