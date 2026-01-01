import { Router, Response, NextFunction } from 'express';
import { CommentModel } from '../models/comment.model';
import { CardModel } from '../models/card.model';
import { BoardModel } from '../models/board.model';
import { BoardMemberModel } from '../models/auth.model';

const router = Router();

router.get('/cards/:cardId/comments', async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const cardId = parseInt(req.params.cardId);
    if (isNaN(cardId)) {
      res.status(400).json({ error: 'Invalid card ID' });
      return;
    }

    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    const isMember = await BoardMemberModel.isMember(card.board_id, req.user.id) || (await BoardModel.isOwner(card.board_id, req.user.id));
    if (!isMember) {
      res.status(403).json({ error: 'You are not a member of this board' });
      return;
    }

    const comments = await CommentModel.findByCardWithUsers(cardId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/cards/:cardId/comments', async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const cardId = parseInt(req.params.cardId);
    if (isNaN(cardId)) {
      res.status(400).json({ error: 'Invalid card ID' });
      return;
    }

    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);
    if (role === 'observer') {
      res.status(403).json({ error: 'Observers cannot create comments' });
      return;
    }

    const { content } = req.body;

    const comment = await CommentModel.create(cardId, req.user.id, content);

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/comments/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const commentId = parseInt(req.params.id);
    if (isNaN(commentId)) {
      res.status(400).json({ error: 'Invalid comment ID' });
      return;
    }

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const card = await CardModel.findById(comment.card_id);
    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);
    if (role === 'observer') {
      res.status(403).json({ error: 'Observers cannot update comments' });
      return;
    }

    if (comment.user_id !== req.user.id) {
      res.status(403).json({ error: 'You can only update your own comments' });
      return;
    }

    const { content } = req.body;

    const updatedComment = await CommentModel.update(commentId, content);
    if (!updatedComment) {
      res.status(404).json({ error: 'Failed to update comment' });
      return;
    }

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/comments/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const commentId = parseInt(req.params.id);
    if (isNaN(commentId)) {
      res.status(400).json({ error: 'Invalid comment ID' });
      return;
    }

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const card = await CardModel.findById(comment.card_id);
    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);
    if (role === 'observer') {
      res.status(403).json({ error: 'Observers cannot delete comments' });
      return;
    }

    if (comment.user_id !== req.user.id) {
      res.status(403).json({ error: 'You can only delete your own comments' });
      return;
    }

    await CommentModel.delete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
