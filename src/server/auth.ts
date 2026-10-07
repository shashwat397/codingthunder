import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'codingthunder_secret_jwt_key_2026';
export const ADMIN_EMAIL = 'mishrashashwat90@gmail.com';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'student' | 'admin';
  exp: number;
}

export function createToken(payload: Omit<TokenPayload, 'exp'>, expiresInSeconds = 7 * 24 * 3600): string {
  const cleanEmail = payload.email.toLowerCase().trim();
  const strictlyEnforcedRole: 'student' | 'admin' = cleanEmail === ADMIN_EMAIL ? 'admin' : 'student';

  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const data = JSON.stringify({ ...payload, email: cleanEmail, role: strictlyEnforcedRole, exp });
  const base64Data = Buffer.from(data).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(base64Data).digest('base64url');
  return `${base64Data}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  if (!token) return null;
  try {
    const [base64Data, signature] = token.split('.');
    if (base64Data && signature) {
      const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(base64Data).digest('base64url');
      if (signature === expectedSig) {
        const data = JSON.parse(Buffer.from(base64Data, 'base64url').toString('utf8')) as TokenPayload;
        if (!data.exp || data.exp >= Math.floor(Date.now() / 1000)) {
          // Re-enforce strict admin role check on verified token
          const cleanEmail = data.email.toLowerCase().trim();
          const enforcedRole: 'student' | 'admin' = cleanEmail === ADMIN_EMAIL ? 'admin' : 'student';
          return {
            ...data,
            email: cleanEmail,
            role: enforcedRole,
          };
        }
      }
    }
  } catch {
    // continue
  }

  return null;
}
