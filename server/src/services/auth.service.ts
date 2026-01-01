import { UserModel, RefreshTokenModel } from '../models/auth.model';
import { PasswordUtil } from '../utils/password';
import { JWTUtil } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { LoginResponse, User } from '../types/auth';

export class AuthService {
  static async register(data: RegisterInput): Promise<LoginResponse> {
    const { username, email, password, full_name } = data;

    const existingByEmail = await UserModel.findByEmail(email);
    if (existingByEmail) {
      throw new Error('Email already exists');
    }

    const existingByUsername = await UserModel.findByUsername(username);
    if (existingByUsername) {
      throw new Error('Username already exists');
    }

    const passwordHash = await PasswordUtil.hash(password);
    const user = await UserModel.create(username, email, passwordHash, full_name);

    const tokens = await this.generateTokens(user.id, email, username);

    return {
      user,
      tokens,
    };
  }

  static async login(data: LoginInput): Promise<LoginResponse> {
    const { email, password } = data;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await PasswordUtil.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    await UserModel.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user.id, user.email, user.username);

    const userWithoutPassword: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  static async refreshTokens(refreshToken: string): Promise<LoginResponse> {
    const tokenRecord = await RefreshTokenModel.findByToken(refreshToken);
    if (!tokenRecord) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await UserModel.findById(tokenRecord.user_id);
    if (!user) {
      throw new Error('User not found');
    }

    await RefreshTokenModel.revoke(refreshToken);

    const tokens = await this.generateTokens(user.id, user.email, user.username);

    return {
      user,
      tokens,
    };
  }

  static async logout(refreshToken: string): Promise<void> {
    await RefreshTokenModel.revoke(refreshToken);
  }

  static async logoutAll(userId: number): Promise<void> {
    await RefreshTokenModel.revokeAllUserTokens(userId);
  }

  static async getMe(userId: number): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  private static async generateTokens(userId: number, email: string, username: string) {
    const accessToken = JWTUtil.generateAccessToken({
      sub: userId,
      email,
      username,
    });

    const refreshTokenData = JWTUtil.generateRefreshToken(userId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshTokenModel.create(userId, refreshTokenData.token, expiresAt);

    return {
      accessToken,
      refreshToken: refreshTokenData.token,
    };
  }

  static async cleanupExpiredTokens(): Promise<number> {
    return RefreshTokenModel.deleteExpired();
  }
}
