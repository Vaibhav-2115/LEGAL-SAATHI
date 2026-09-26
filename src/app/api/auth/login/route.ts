import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateCredentials } from '@/lib/auth/user-store';
import { signJwt } from '@/lib/auth/jwt';
import {
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
} from '@/lib/auth/cookies';

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
