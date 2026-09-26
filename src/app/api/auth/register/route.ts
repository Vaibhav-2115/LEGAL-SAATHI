import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createUser } from '@/lib/auth/user-store';
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
    const { name, email, password, consentDpdp } = body;

    // Field validations
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid full citizen name (minimum 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid citizen email address.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (!consentDpdp) {
      return NextResponse.json(
        {
          success: false,
          error:
            'You must acknowledge and consent to statutory data handling under the Digital Personal Data Protection (DPDP) Act, 2023.',
        },
        { status: 400 }
      );
    }

    // 1. Attempt Supabase Auth registration if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              role: 'CITIZEN',
              consent_dpdp: true,
              docket_id: 'LS-2026-0042',
            },
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes('already registered')) {
            return NextResponse.json(
              { success: false, error: 'An account is already registered with this email address.' },
              { status: 409 }
            );
          }
          throw error;
        }

        if (data?.user) {
          const authUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: name.trim(),
            role: 'CITIZEN' as const,
            docketId: 'LS-2026-0042',
            createdAt: data.user.created_at,
          };

          // Issue session token if session exists (email confirmation disabled or auto-confirmed)
          const token = await signJwt({
            sub: authUser.id,
            email: authUser.email,
            name: authUser.name,
            role: authUser.role,
            docketId: authUser.docketId,
          });

          const cookieStore = await cookies();
          cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(true));

          return NextResponse.json({
            success: true,
            user: authUser,
            provider: 'supabase',
            requiresEmailVerification: !data.session,
            message: data.session
              ? 'Citizen profile created and authenticated successfully via Supabase.'
              : 'Citizen profile created. Please check your email to verify your account.',
          });
        }
      } catch (sbErr) {
        console.warn('[Auth API] Supabase registration error, falling back to local user store:', sbErr);
      }
    }

    // 2. Fallback to local user store
    const user = await createUser({
      name,
      email,
      password,
      consentDpdp: true,
      role: 'CITIZEN',
    });

    // Automatically issue session JWT on registration
    const token = await signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      docketId: user.docketId,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(true));

    return NextResponse.json({
      success: true,
      user,
      provider: 'local_store',
      message: 'Citizen profile created and authenticated successfully.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed.';
    if (message.includes('already registered')) {
      return NextResponse.json({ success: false, error: message }, { status: 409 });
    }
    console.error('[Auth API] Register error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected internal error occurred during registration.' },
      { status: 500 }
    );
  }
}
