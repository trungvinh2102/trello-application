import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/boards/:boardId/activities', authMiddleware, ActivityController.getBoardActivities);
router.get('/cards/:cardId/activities', authMiddleware, ActivityController.getCardActivities);
router.get('/users/:userId/activities', authMiddleware, ActivityController.getUserActivities);
router.get('/boards/:boardId/activities/count', authMiddleware, ActivityController.getBoardActivityCount);
router.get('/cards/:cardId/activities/count', authMiddleware, ActivityController.getCardActivityCount);

export default router;
