import { Request, Response, NextFunction } from 'express';
import { LabelService, CardLabelService } from '../services/card.service';
import { AuthRequest } from '../types/auth';
import {
  labelCreateSchema,
  labelUpdateSchema,
  assignLabelSchema,
  batchUpdateLabelsSchema,
} from '../validators/label.validator';

export class LabelController {
  static async getBoardLabels(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const labels = await LabelService.getBoardLabels(boardId, req.user.id);
      res.json(labels);
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

  static async createLabel(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = labelCreateSchema.parse(req.body);

      const label = await LabelService.createLabel(boardId, req.user.id, validatedData);
      res.status(201).json(label);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not a member') || error.message.includes('cannot create')) {
          res.status(403).json({ error: error.message });
          return;
        }
        if (error.message.includes('Invalid color')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async updateLabel(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const labelId = parseInt(req.params.id);
      if (isNaN(labelId)) {
        res.status(400).json({ error: 'Invalid label ID' });
        return;
      }

      const validatedData = labelUpdateSchema.parse(req.body);

      const label = await LabelService.updateLabel(labelId, req.user.id, validatedData);
      res.json(label);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Label not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot update')) {
          res.status(403).json({ error: error.message });
          return;
        }
        if (error.message.includes('Invalid color')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async deleteLabel(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const labelId = parseInt(req.params.id);
      if (isNaN(labelId)) {
        res.status(400).json({ error: 'Invalid label ID' });
        return;
      }

      await LabelService.deleteLabel(labelId, req.user.id);
      res.json({ message: 'Label deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Label not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot delete')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }
}

export class CardLabelController {
  static async getCardLabels(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const cardId = parseInt(req.params.id);
      if (isNaN(cardId)) {
        res.status(400).json({ error: 'Invalid card ID' });
        return;
      }

      const labels = await CardLabelService.getCardLabels(cardId, req.user.id);
      res.json(labels);
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

  static async assignLabel(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const cardId = parseInt(req.params.id);
      if (isNaN(cardId)) {
        res.status(400).json({ error: 'Invalid card ID' });
        return;
      }

      const validatedData = assignLabelSchema.parse(req.body);

      const labels = await CardLabelService.assignLabel(cardId, req.user.id, validatedData);
      res.json(labels);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found' || error.message === 'Label not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot assign')) {
          res.status(403).json({ error: error.message });
          return;
        }
        if (error.message.includes('does not belong')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async removeLabel(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const cardId = parseInt(req.params.id);
      const labelId = parseInt(req.params.labelId);

      if (isNaN(cardId) || isNaN(labelId)) {
        res.status(400).json({ error: 'Invalid card ID or label ID' });
        return;
      }

      await CardLabelService.removeLabel(cardId, labelId, req.user.id);
      res.json({ message: 'Label removed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot remove')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async batchUpdateLabels(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const cardId = parseInt(req.params.id);
      if (isNaN(cardId)) {
        res.status(400).json({ error: 'Invalid card ID' });
        return;
      }

      const validatedData = batchUpdateLabelsSchema.parse(req.body);

      const labels = await CardLabelService.batchUpdateLabels(cardId, req.user.id, validatedData);
      res.json(labels);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot update')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }
}
