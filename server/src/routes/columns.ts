import { Router } from 'express';
import { ColumnController } from '../controllers/column.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/boards/:boardId/columns', authMiddleware, ColumnController.getAllColumns);
router.get('/columns/:id', authMiddleware, ColumnController.getColumn);
router.post('/boards/:boardId/columns', authMiddleware, ColumnController.createColumn);
router.put('/columns/:id', authMiddleware, ColumnController.updateColumn);
router.delete('/columns/:id', authMiddleware, ColumnController.deleteColumn);

router.put('/boards/:boardId/columns/reorder', authMiddleware, ColumnController.reorderColumns);

router.post('/columns/:id/duplicate', authMiddleware, ColumnController.duplicateColumn);

router.put('/columns/:id/move', authMiddleware, ColumnController.moveColumn);

export default router;
