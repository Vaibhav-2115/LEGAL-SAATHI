import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
  getExpiredCookieOptions,
} from '@/lib/auth/cookies';

export async function POST() {
  try {
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
