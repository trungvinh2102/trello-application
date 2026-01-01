import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);

      const result = await AuthService.register(validatedData);

      res.cookie('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
        path: '/',
      });

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.status(201).json({
        message: 'Registration successful',
        user: result.user,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          res.status(409).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);

      const result = await AuthService.login(validatedData);

      res.cookie('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
        path: '/',
      });

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.json({
        message: 'Login successful',
        user: result.user,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid email or password') {
          res.status(401).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });

      res.json({ message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  }

  static async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      await AuthService.logoutAll(userId);

      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });

      res.json({ message: 'Logged out from all devices' });
    } catch (error) {
      next(error);
    }
  }

  static async refreshTokens(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token is required' });
        return;
      }

      const result = await AuthService.refreshTokens(refreshToken);

      res.cookie('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
        path: '/',
      });

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.json({
        message: 'Tokens refreshed successfully',
        user: result.user,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Invalid or expired')) {
          res.status(401).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async getMe(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.getMe(req.user.id);

      res.json({ user });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          res.status(404).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }
}
