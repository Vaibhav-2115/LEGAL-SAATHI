import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { getSafeCallbackUrl } from '@/lib/auth/redirect';

// Protected routes that require an authenticated citizen session
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/cases',
  '/complaints',
  '/chat',
  '/draft',
  '/actions',
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Read session cookie
  const sessionCookie =
    request.cookies.get(SESSION_COOKIE_NAME) ||
    request.cookies.get('__Secure-legal-saathi.session-token') ||
    request.cookies.get('legal-saathi.session-token');

  const token = sessionCookie?.value;
  const user = token ? await verifyJwt(token) : null;
  const isAuthenticated = !!user;

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // 1. Unauthenticated citizen attempting to access protected route
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    const destination = `${pathname}${search}`;
    loginUrl.searchParams.set('callbackUrl', destination);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already-authenticated citizen attempting to access /login or /register
  if (isAuthRoute && isAuthenticated) {
    const rawCallback = request.nextUrl.searchParams.get('callbackUrl');
    const safeDestination = getSafeCallbackUrl(rawCallback, '/complaints');
    return NextResponse.redirect(new URL(safeDestination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled individually)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (.png, .jpg, .svg, .webp)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
