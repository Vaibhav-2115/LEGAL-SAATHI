import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { OAUTH_STATE_COOKIE_NAME } from '@/lib/auth/cookies';
import { getSafeCallbackUrl } from '@/lib/auth/redirect';

function base64Url(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'));

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // Check if real Google OAuth credentials are configured
  if (!clientId || !clientSecret || clientId.includes('placeholder') || clientId.includes('xxxx')) {
    const loginRedirect = new URL('/login', request.url);
    loginRedirect.searchParams.set('error', 'OAuthConfigurationRequired');
    loginRedirect.searchParams.set('provider', 'Google');
    if (callbackUrl) {
      loginRedirect.searchParams.set('callbackUrl', callbackUrl);
    }
    return NextResponse.redirect(loginRedirect);
  }

  // Generate PKCE code_verifier and code_challenge
  const codeVerifier = base64Url(crypto.randomBytes(32));
  const codeChallenge = base64Url(
    crypto.createHash('sha256').update(codeVerifier).digest()
  );

  // Generate anti-CSRF state token
  const state = crypto.randomBytes(16).toString('hex');

  // Determine base app URL
  const appUrl =
    process.env.NEXTAUTH_URL ||
    process.env.APP_URL ||
    new URL(request.url).origin;
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  // Store state and verifier in secure HttpOnly cookie (expires in 10 minutes)
  const statePayload = JSON.stringify({ state, codeVerifier, callbackUrl });
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE_NAME, statePayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes
  });

  // Construct Google OIDC Authorization URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('code_challenge', codeChallenge);
  googleAuthUrl.searchParams.set('code_challenge_method', 'S256');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(googleAuthUrl);
}
