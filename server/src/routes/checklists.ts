import { Router } from 'express';
import { ChecklistController, ChecklistItemController } from '../controllers/checklist.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/cards/:cardId/checklists', authMiddleware, ChecklistController.getChecklists);
router.post('/cards/:cardId/checklists', authMiddleware, ChecklistController.createChecklist);
router.put('/checklists/:id', authMiddleware, ChecklistController.updateChecklist);
router.delete('/checklists/:id', authMiddleware, ChecklistController.deleteChecklist);

router.get('/checklists/:checklistId/items', authMiddleware, ChecklistItemController.getItems);
router.post('/checklists/:checklistId/items', authMiddleware, ChecklistItemController.createItem);
router.put('/checklist-items/:id', authMiddleware, ChecklistItemController.updateItem);
router.delete('/checklist-items/:id', authMiddleware, ChecklistItemController.deleteItem);

router.put('/checklists/:checklistId/items/reorder', authMiddleware, ChecklistItemController.reorderItems);

router.post('/checklists/:checklistId/items/batch', authMiddleware, ChecklistItemController.batchCreateItems);

export default router;
