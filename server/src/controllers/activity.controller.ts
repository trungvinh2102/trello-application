import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service';
import { AuthRequest } from '../types/auth';
import { ActivityAction } from '../types/activity';

export class ActivityController {
  static async getBoardActivities(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params.boardId);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      const filter: {
        action?: ActivityAction;
        cardId?: number;
        userId?: number;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
      } = {};

      if (req.query.action) filter.action = req.query.action as ActivityAction;
      if (req.query.cardId) filter.cardId = parseInt(req.query.cardId as string);
      if (req.query.userId) filter.userId = parseInt(req.query.userId as string);
      if (req.query.startDate) filter.startDate = new Date(req.query.startDate as string);
      if (req.query.endDate) filter.endDate = new Date(req.query.endDate as string);
      if (req.query.limit) filter.limit = parseInt(req.query.limit as string);
      if (req.query.offset) filter.offset = parseInt(req.query.offset as string);

      const activities = await ActivityService.getBoardActivities(boardId, req.user.id, filter);
      res.json(activities);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not a member')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async getCardActivities(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const filter: {
        limit?: number;
        offset?: number;
      } = {};

      if (req.query.limit) filter.limit = parseInt(req.query.limit as string);
      if (req.query.offset) filter.offset = parseInt(req.query.offset as string);

      const activities = await ActivityService.getCardActivities(cardId, req.user.id, filter);
      res.json(activities);
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

  static async getUserActivities(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const filter: {
        limit?: number;
        offset?: number;
      } = {};

      if (req.query.limit) filter.limit = parseInt(req.query.limit as string);
      if (req.query.offset) filter.offset = parseInt(req.query.offset as string);

      const activities = await ActivityService.getUserActivities(userId, req.user.id, filter);
      res.json(activities);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('can only view your own')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async getBoardActivityCount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params.boardId);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      const count = await ActivityService.countByBoard(boardId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }

  static async getCardActivityCount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const count = await ActivityService.countByCard(cardId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }
}
