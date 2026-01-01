import { Response, NextFunction } from 'express';
import { JWTUtil } from '../utils/jwt';
import { AuthRequest } from '../types/auth';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      res.status(401).json({ error: 'Access token is required' });
      return;
    }

    const payload = JWTUtil.verifyAccessToken(accessToken);

    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired access token' });
  }
};

export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (accessToken) {
      const payload = JWTUtil.verifyAccessToken(accessToken);
      req.user = {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
      };
    }

    next();
  } catch (error) {
    next();
  }
};
