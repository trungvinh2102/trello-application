import { Request, Response, NextFunction } from 'express';
import { CardService, CardMemberService } from '../services/card.service';
import { AuthRequest } from '../types/auth';
import {
  cardCreateSchema,
  cardUpdateSchema,
  cardMoveSchema,
  cardDuplicateSchema,
  cardArchiveSchema,
  addMemberSchema,
  batchAddMembersSchema,
} from '../validators/card.validator';

export class CardController {
  static async getAllCards(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const columnId = parseInt(req.params.columnId);
      if (isNaN(columnId)) {
        res.status(400).json({ error: 'Invalid column ID' });
        return;
      }

      const cards = await CardService.getCards(columnId, req.user.id);
      res.json(cards);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Column not found') {
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

  static async getCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const card = await CardService.getCard(cardId, req.user.id);
      res.json(card);
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

  static async createCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const columnId = parseInt(req.params.columnId);
      if (isNaN(columnId)) {
        res.status(400).json({ error: 'Invalid column ID' });
        return;
      }

      const validatedData = cardCreateSchema.parse(req.body);

      const card = await CardService.createCard(columnId, req.user.id, validatedData);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Column not found') {
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

  static async updateCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = cardUpdateSchema.parse(req.body);

      const card = await CardService.updateCard(cardId, req.user.id, validatedData);
      res.json(card);
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

  static async deleteCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      await CardService.deleteCard(cardId, req.user.id);
      res.json({ message: 'Card deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found') {
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

  static async moveCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = cardMoveSchema.parse(req.body);

      const card = await CardService.moveCard(cardId, req.user.id, validatedData);
      res.json(card);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found' || error.message === 'Target column not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot move') || error.message.includes('Cannot move cards')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async duplicateCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = cardDuplicateSchema.parse(req.body);

      const card = await CardService.duplicateCard(cardId, req.user.id, validatedData);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot duplicate')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async archiveCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = cardArchiveSchema.parse(req.body);

      const card = await CardService.archiveCard(cardId, req.user.id, validatedData);
      res.json(card);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot archive')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }
}

export class CardMemberController {
  static async getMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const members = await CardMemberService.getMembers(cardId, req.user.id);
      res.json(members);
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

  static async addMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = addMemberSchema.parse(req.body);

      const member = await CardMemberService.addMember(cardId, req.user.id, validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found' || error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('cannot add') || error.message.includes('already a member') || error.message.includes('must be a member')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async removeMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const cardId = parseInt(req.params.id);
      const targetUserId = parseInt(req.params.userId);

      if (isNaN(cardId) || isNaN(targetUserId)) {
        res.status(400).json({ error: 'Invalid card ID or user ID' });
        return;
      }

      await CardMemberService.removeMember(cardId, targetUserId, req.user.id);
      res.json({ message: 'Member removed successfully' });
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

  static async batchAddMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = batchAddMembersSchema.parse(req.body);

      const members = await CardMemberService.batchAddMembers(cardId, req.user.id, validatedData);
      res.status(201).json(members);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('cannot add') || error.message.includes('not found') || error.message.includes('must be a member')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }
}
