/**
 * Legal Saathi — Session Cookie Specifications
 * Enforces HttpOnly, SameSite=Lax, and Secure flags in production.
 */

export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === 'production'
    ? '__Secure-legal-saathi.session-token'
    : 'legal-saathi.session-token';

export const OAUTH_STATE_COOKIE_NAME = 'legal-saathi.oauth-state';

export const SESSION_MAX_AGE_SECONDS = 14 * 24 * 60 * 60; // 14 days

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge: number;
}

export function getSessionCookieOptions(rememberMe = true): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: rememberMe ? SESSION_MAX_AGE_SECONDS : 24 * 60 * 60, // 14 days or 1 day session
  };
}

export function getExpiredCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  };
}
