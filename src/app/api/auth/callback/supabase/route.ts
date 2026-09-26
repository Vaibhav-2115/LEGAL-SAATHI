import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSafeCallbackUrl } from '@/lib/auth/redirect';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next');
  const next = getSafeCallbackUrl(rawNext, '/dashboard');

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('[Supabase Auth Callback] Session exchange error:', error);
    } catch (err) {
      console.error('[Supabase Auth Callback] Unexpected exception:', err);
    }
  }

  // Return to login with error details if code exchange fails
  const loginUrl = new URL('/login', origin);
  loginUrl.searchParams.set('error', 'AuthCallbackFailed');
  return NextResponse.redirect(loginUrl);
}
