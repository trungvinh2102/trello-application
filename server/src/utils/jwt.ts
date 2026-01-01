import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_ACCESS_EXPIRY = '15m';
const JWT_REFRESH_EXPIRY = '7d';

export class JWTUtil {
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti'>): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRY,
      issuer: 'trello-app',
      audience: 'trello-app-users',
    });
  }

  static generateRefreshToken(userId: number): { token: string; jti: string } {
    const jti = `${userId}-${Date.now()}-${Math.random()}`;
    const payload = {
      sub: userId,
      email: '',
      username: '',
      jti,
    };

    return {
      token: jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRY,
        issuer: 'trello-app',
        audience: 'trello-app-refresh',
      }),
      jti,
    };
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'trello-app',
        audience: 'trello-app-users',
      });
      if (typeof decoded === 'string') {
        throw new Error('Invalid access token');
      }
      return decoded as unknown as JWTPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'trello-app',
        audience: 'trello-app-refresh',
      });
      if (typeof decoded === 'string') {
        throw new Error('Invalid refresh token');
      }
      return decoded as unknown as JWTPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static decodeToken(token: string): JWTPayload | null {
    return jwt.decode(token) as JWTPayload | null;
  }
}
