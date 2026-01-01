import { Router } from 'express';
import { CardController, CardMemberController } from '../controllers/card.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/columns/:columnId/cards', authMiddleware, CardController.getAllCards);
router.get('/cards/:id', authMiddleware, CardController.getCard);
router.post('/columns/:columnId/cards', authMiddleware, CardController.createCard);
router.put('/cards/:id', authMiddleware, CardController.updateCard);
router.delete('/cards/:id', authMiddleware, CardController.deleteCard);

router.put('/cards/:id/move', authMiddleware, CardController.moveCard);

router.post('/cards/:id/duplicate', authMiddleware, CardController.duplicateCard);

router.put('/cards/:id/archive', authMiddleware, CardController.archiveCard);

router.get('/cards/:id/members', authMiddleware, CardMemberController.getMembers);
router.post('/cards/:id/members', authMiddleware, CardMemberController.addMember);
router.delete('/cards/:id/members/:userId', authMiddleware, CardMemberController.removeMember);
router.post('/cards/:id/members/batch', authMiddleware, CardMemberController.batchAddMembers);

export default router;
