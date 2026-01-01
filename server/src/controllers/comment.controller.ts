import { Request, Response, NextFunction } from 'express';
import { CommentModel } from '../models/comment.model';
import { CardModel } from '../models/card.model';
import { BoardMemberModel } from '../models/auth.model';
import { AuthRequest } from '../types/auth';
import { commentCreateSchema, commentUpdateSchema } from '../validators/comment.validator';

export class CommentController {
  static async getComments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const comments = await CommentModel.findByCardWithUsers(cardId);
      res.json(comments);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async createComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = commentCreateSchema.parse(req.body);

      const comment = await CommentModel.create(cardId, req.user.id, validatedData.content);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('cannot create')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async updateComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = commentUpdateSchema.parse(req.body);

      const comment = await CommentModel.update(commentId, validatedData.content);

      res.json(comment);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Comment not found') {
          res.status(404).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const success = await CommentModel.delete(commentId);

      if (!success) {
        res.status(400).json({ error: 'Failed to delete comment' });
        return;
      }

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Comment not found' || error.message === 'Card not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('not a member of this board')) {
          res.status(403).json({ error: error.message });
          return;
        }
        if (error.message.includes('can only delete your own') || error.message.includes('cannot delete')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }
}
