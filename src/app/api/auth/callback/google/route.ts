import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
  getSessionCookieOptions,
  getExpiredCookieOptions,
} from '@/lib/auth/cookies';
import { signJwt } from '@/lib/auth/jwt';
import { findUserByEmail, createUser } from '@/lib/auth/user-store';
import { getSafeCallbackUrl } from '@/lib/auth/redirect';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(OAUTH_STATE_COOKIE_NAME);

  let savedCallbackUrl = '/complaints';
  let expectedState = '';
  let codeVerifier = '';

  if (stateCookie?.value) {
    try {
      const parsed = JSON.parse(stateCookie.value);
      expectedState = parsed.state;
      codeVerifier = parsed.codeVerifier;
      savedCallbackUrl = getSafeCallbackUrl(parsed.callbackUrl);
    } catch {
      // Malformed cookie
    }
  }

  // Clear OAuth state cookie
  cookieStore.set(OAUTH_STATE_COOKIE_NAME, '', getExpiredCookieOptions());

  // Handle provider cancellation or error
  if (error) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'OAuthCancelled');
    loginUrl.searchParams.set('details', error);
    return NextResponse.redirect(loginUrl);
  }

  // Validate state against CSRF
  if (!state || !expectedState || state !== expectedState) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'InvalidOAuthState');
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'MissingAuthorizationCode');
    return NextResponse.redirect(loginUrl);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl =
    process.env.NEXTAUTH_URL ||
    process.env.APP_URL ||
    new URL(request.url).origin;
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'OAuthConfigurationRequired');
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 1. Exchange authorization code for access token with Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('[Google OAuth] Token exchange error:', await tokenResponse.text());
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'OAuthTokenExchangeFailed');
      return NextResponse.redirect(loginUrl);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch authenticated citizen profile from Google UserInfo
    const userInfoResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoResponse.ok) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'OAuthUserInfoFailed');
      return NextResponse.redirect(loginUrl);
    }

    const googleUser = await userInfoResponse.json();
    const email = googleUser.email;
    const name = googleUser.name || 'Verified Citizen';

    if (!email) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'OAuthEmailMissing');
      return NextResponse.redirect(loginUrl);
    }

    // 3. Find existing citizen or register new OAuth citizen account
    let user = await findUserByEmail(email);

    if (!user) {
      user = (await createUser({
        name,
        email,
        consentDpdp: true,
        role: 'CITIZEN',
      })) as any;
    }

    // 4. Issue cryptographic session JWT
    const token = await signJwt({
      sub: user!.id,
      email: user!.email,
      name: user!.name,
      role: user!.role,
      docketId: user!.docketId,
    });

    cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(true));

    // 5. Redirect to safe destination
    const destinationUrl = new URL(savedCallbackUrl, request.url);
    return NextResponse.redirect(destinationUrl);
  } catch (err) {
    console.error('[Google OAuth] Callback exception:', err);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'OAuthUnexpectedError');
    return NextResponse.redirect(loginUrl);
  }
}
