import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth/jwt';
import { findUserById } from '@/lib/auth/user-store';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';

export async function GET() {
  try {
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
