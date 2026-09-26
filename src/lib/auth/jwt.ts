/**
 * Legal Saathi — Web Crypto JWT Utility
 * Works in Node.js server routes and Next.js Edge Middleware.
 * Uses HMAC-SHA256 (HS256) via standard Web Crypto API (crypto.subtle).
 */

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  name: string;
  role: 'CITIZEN' | 'LEGAL_AID_ADVOCATE' | 'DLSA_OFFICER';
  docketId?: string;
  iat?: number;
  exp?: number;
}

const DEFAULT_SECRET = 'legal-saathi-sovereign-civic-secret-key-32-bytes-minimum-length-2026';

function toArrayBuffer(u: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(u.byteLength);
  new Uint8Array(ab).set(u);
  return ab;
}

function getSecretBytes(secret?: string): ArrayBuffer {
  const secretStr = secret || process.env.AUTH_SECRET || DEFAULT_SECRET;
  return toArrayBuffer(new TextEncoder().encode(secretStr));
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Sign a JWT using Web Crypto HMAC-SHA256.
 */
export async function signJwt(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  expiresInSeconds = 1209600 // 14 days default
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    docketId: payload.docketId,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(fullPayload)));
  const dataToSign = toArrayBuffer(new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`));

  const key = await crypto.subtle.importKey(
    'raw',
    getSecretBytes(),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, dataToSign);
  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify a JWT using Web Crypto HMAC-SHA256.
 * Returns the decoded payload if valid and unexpired, or null otherwise.
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  try {
    const dataToVerify = toArrayBuffer(new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`));
    const signatureBytes = toArrayBuffer(base64UrlDecode(encodedSignature));

    const key = await crypto.subtle.importKey(
      'raw',
      getSecretBytes(),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      dataToVerify
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(encodedPayload));
    const payload = JSON.parse(payloadJson) as JwtPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}
