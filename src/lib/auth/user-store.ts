/**
 * Legal Saathi — Civic User Store & Authentication Registry
 * Stores citizen accounts with hashed credentials and DPDP Act compliance audit.
 */

import fs from 'node:fs';
import path from 'node:path';
import { hashPassword, verifyPassword } from './password';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'CITIZEN' | 'LEGAL_AID_ADVOCATE' | 'DLSA_OFFICER';
  docketId?: string;
  createdAt: string;
}

export interface UserRecord extends AuthUser {
  passwordHash: string;
  consentDpdp: boolean;
}

// In-memory cache for fast lookup and fallback
const inMemoryUsers: Map<string, UserRecord> = new Map();

// Default seed demo users
const SEED_USERS: UserRecord[] = [
  {
    id: 'usr_rajesh_kumar',
    email: 'rajesh.kumar@example.com',
    name: 'Rajesh Kumar',
    role: 'CITIZEN',
    docketId: 'LS-2026-0042',
    passwordHash: hashPassword('secretPassword123'),
    consentDpdp: true,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'usr_kavitha_r',
    email: 'kavitha.r@example.com',
    name: 'Kavitha R.',
    role: 'CITIZEN',
    docketId: 'LS-2026-0042',
    passwordHash: hashPassword('secretPassword123'),
    consentDpdp: true,
    createdAt: '2026-02-10T11:30:00.000Z',
  },
  {
    id: 'usr_adv_sharma',
    email: 'advocate.sharma@delhibar.in',
    name: 'Adv. Vikram Sharma',
    role: 'LEGAL_AID_ADVOCATE',
    passwordHash: hashPassword('secretPassword123'),
    consentDpdp: true,
    createdAt: '2026-01-01T09:00:00.000Z',
  },
];

// Initialize in-memory map
for (const u of SEED_USERS) {
  inMemoryUsers.set(u.email.toLowerCase(), u);
}

const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function loadPersistedUsers(): void {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      const users: UserRecord[] = JSON.parse(content);
      for (const u of users) {
        inMemoryUsers.set(u.email.toLowerCase(), u);
      }
    }
  } catch {
    // If reading fails, inMemoryUsers remains initialized with seed users
  }
}

function persistUsers(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const list = Array.from(inMemoryUsers.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch {
    // Graceful fallback to memory storage
  }
}

// Initial load
loadPersistedUsers();

export function toAuthUser(user: UserRecord): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    docketId: user.docketId,
    createdAt: user.createdAt,
  };
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  if (!email) return null;
  const user = inMemoryUsers.get(email.trim().toLowerCase());
  return user || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  if (!id) return null;
  for (const user of inMemoryUsers.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  role?: 'CITIZEN' | 'LEGAL_AID_ADVOCATE' | 'DLSA_OFFICER';
  consentDpdp: boolean;
}): Promise<AuthUser> {
  const normalizedEmail = data.email.trim().toLowerCase();

  if (inMemoryUsers.has(normalizedEmail)) {
    throw new Error('An account is already registered with this email address.');
  }

  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const passwordHash = data.password ? hashPassword(data.password) : '';

  const newUser: UserRecord = {
    id,
    email: normalizedEmail,
    name: data.name.trim(),
    role: data.role || 'CITIZEN',
    docketId: 'LS-2026-0042', // Associate default sample civic docket
    passwordHash,
    consentDpdp: data.consentDpdp,
    createdAt: new Date().toISOString(),
  };

  inMemoryUsers.set(normalizedEmail, newUser);
  persistUsers();

  return toAuthUser(newUser);
}

export async function validateCredentials(
  email: string,
  plainPassword: string
): Promise<AuthUser | null> {
  const user = await findUserByEmail(email);
  if (!user || !user.passwordHash) return null;

  const valid = verifyPassword(plainPassword, user.passwordHash);
  if (!valid) return null;

  return toAuthUser(user);
}
