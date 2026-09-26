/**
 * Legal Saathi — Safe Redirect Validation
 * Prevents Open Redirect vulnerabilities by restricting redirects to safe internal paths.
 */

export function getSafeCallbackUrl(
  callbackUrl: string | null | undefined,
  fallback = '/dashboard'
): string {
  if (!callbackUrl || typeof callbackUrl !== 'string') {
    return fallback;
  }

  const trimmed = callbackUrl.trim();

  // Reject URLs with schemes (http://, https://, javascript:, data:)
  if (trimmed.includes('://') || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  // Reject protocol-relative URLs (e.g. //attacker.com) or backslash bypasses (e.g. /\attacker.com)
  if (trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.startsWith('\\')) {
    return fallback;
  }

  // Must begin with a single forward slash
  if (!trimmed.startsWith('/')) {
    return fallback;
  }

  // Reject any internal path trying to navigate back to auth pages
  if (trimmed.startsWith('/login') || trimmed.startsWith('/register')) {
    return fallback;
  }

  return trimmed;
}
