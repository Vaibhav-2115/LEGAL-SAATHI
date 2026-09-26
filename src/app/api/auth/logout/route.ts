import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
  getExpiredCookieOptions,
} from '@/lib/auth/cookies';

import { isSupabaseConfigured } from '@/lib/supabase/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase.auth.signOut();
      } catch (sbErr) {
        console.warn('[Auth API] Supabase signOut warning:', sbErr);
      }
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, '', getExpiredCookieOptions());
    cookieStore.set(OAUTH_STATE_COOKIE_NAME, '', getExpiredCookieOptions());

    return NextResponse.json({
      success: true,
      message: 'Citizen session invalidated successfully.',
    });
  } catch (error) {
    console.error('[Auth API] Logout error:', error);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred during logout.' },
      { status: 500 }
    );
  }
}
