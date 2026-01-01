import { Router } from 'express';
import { BoardController, BoardMemberController } from '../controllers/board.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/boards', authMiddleware, BoardController.getAllBoards);
router.get('/boards/:id', authMiddleware, BoardController.getBoard);
router.post('/boards', authMiddleware, BoardController.createBoard);
router.put('/boards/:id', authMiddleware, BoardController.updateBoard);
router.delete('/boards/:id', authMiddleware, BoardController.deleteBoard);

router.get('/boards/:id/members', authMiddleware, BoardMemberController.getMembers);
router.post('/boards/:id/members', authMiddleware, BoardMemberController.addMember);
router.put('/boards/:id/members/:userId', authMiddleware, BoardMemberController.updateMemberRole);
router.delete('/boards/:id/members/:userId', authMiddleware, BoardMemberController.removeMember);
router.delete('/boards/:id/members/leave', authMiddleware, BoardMemberController.leaveBoard);

export default router;
