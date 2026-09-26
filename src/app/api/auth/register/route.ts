import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createUser } from '@/lib/auth/user-store';
import { signJwt } from '@/lib/auth/jwt';
import {
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
} from '@/lib/auth/cookies';

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
