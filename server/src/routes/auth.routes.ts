import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', optionalAuthMiddleware, AuthController.logout);
router.post('/logout-all', authMiddleware, AuthController.logoutAll);
router.post('/refresh', AuthController.refreshTokens);
router.get('/me', authMiddleware, AuthController.getMe);

export default router;
