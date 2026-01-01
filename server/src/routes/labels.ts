import { Router } from 'express';
import { LabelController, CardLabelController } from '../controllers/label.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/boards/:boardId/labels', authMiddleware, LabelController.getBoardLabels);
router.post('/boards/:boardId/labels', authMiddleware, LabelController.createLabel);
router.put('/boards/:boardId/labels/:id', authMiddleware, LabelController.updateLabel);
router.delete('/boards/:boardId/labels/:id', authMiddleware, LabelController.deleteLabel);

router.get('/cards/:id/labels', authMiddleware, CardLabelController.getCardLabels);
router.post('/cards/:id/labels', authMiddleware, CardLabelController.assignLabel);
router.delete('/cards/:id/labels/:labelId', authMiddleware, CardLabelController.removeLabel);
router.put('/cards/:id/labels', authMiddleware, CardLabelController.batchUpdateLabels);

export default router;
