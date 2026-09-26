/**
 * Legal Saathi — Cryptographic Password Hashing
 * Uses standard Node.js crypto scrypt with unique cryptographic salt.
 * Verifies with timing-safe comparison to prevent timing attacks.
 */

import crypto from 'node:crypto';

const KEY_LENGTH = 64;

/**
 * Hash a password using scrypt with a random 16-byte salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a plain text password against a stored scrypt hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  const parts = storedHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;

  const salt = parts[1];
  const originalKeyHex = parts[2];

  try {
    const originalBuffer = Buffer.from(originalKeyHex, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);

    if (originalBuffer.length !== derivedKey.length) return false;
    return crypto.timingSafeEqual(originalBuffer, derivedKey);
  } catch {
    return false;
  }
}
