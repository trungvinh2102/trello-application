import { Request } from 'express';

export interface JWTPayload {
  sub: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
  jti?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

export interface RefreshToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
  is_revoked: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: Omit<User, 'password_hash'>;
  tokens: AuthTokens;
}

export interface BoardMemberRole {
  board_id: number;
  user_id: number;
  role: 'admin' | 'member' | 'observer';
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
  };
  boardRole?: 'admin' | 'member' | 'observer';
}
