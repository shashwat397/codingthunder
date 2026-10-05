import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'codingthunder_secret_jwt_key_2026';

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
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const data = JSON.stringify({ ...payload, exp });
  const base64Data = Buffer.from(data).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(base64Data).digest('base64url');
  return `${base64Data}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const [base64Data, signature] = token.split('.');
    if (!base64Data || !signature) return null;

    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(base64Data).digest('base64url');
    if (signature !== expectedSig) return null;

    const data = JSON.parse(Buffer.from(base64Data, 'base64url').toString('utf8')) as TokenPayload;
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return data;
  } catch {
    return null;
  }
}
