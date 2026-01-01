import { Request, Response, NextFunction } from 'express';
import { ChecklistModel, ChecklistItemModel } from '../models/checklist.model';
import { CardModel } from '../models/card.model';
import { BoardMemberModel } from '../models/auth.model';
import { BoardModel } from '../models/board.model';
import { AuthRequest } from '../types/auth';
import {
  checklistCreateSchema,
  checklistUpdateSchema,
  checklistItemCreateSchema,
  checklistItemUpdateSchema,
  reorderItemsSchema,
  batchCreateItemsSchema,
} from '../validators/checklist.validator';

export class ChecklistController {
  static async getChecklists(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const checklists = await ChecklistModel.findByCardWithProgress(cardId);
      res.json(checklists);
    } catch (error) {
      next(error);
    }
  }

  static async createChecklist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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
        res.status(403).json({ error: 'Observers cannot create checklists' });
        return;
      }

      const validatedData = checklistCreateSchema.parse(req.body);

      const checklist = await ChecklistModel.create(validatedData.name, cardId, validatedData.position);
      res.status(201).json(checklist);
    } catch (error) {
      next(error);
    }
  }

  static async updateChecklist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const checklistId = parseInt(req.params.id);
      if (isNaN(checklistId)) {
        res.status(400).json({ error: 'Invalid checklist ID' });
        return;
      }

      const cardId = await ChecklistModel.findCardId(checklistId);

      if (!cardId) {
        res.status(404).json({ error: 'Checklist not found' });
        return;
      }

      const card = await CardModel.findById(cardId);

      if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);

      if (role === 'observer') {
        res.status(403).json({ error: 'Observers cannot update checklists' });
        return;
      }

      const validatedData = checklistUpdateSchema.parse(req.body);

      const checklist = await ChecklistModel.update(checklistId, validatedData.name, validatedData.position);
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  }

  static async deleteChecklist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const checklistId = parseInt(req.params.id);
      if (isNaN(checklistId)) {
        res.status(400).json({ error: 'Invalid checklist ID' });
        return;
      }

      const cardId = await ChecklistModel.findCardId(checklistId);

      if (!cardId) {
        res.status(404).json({ error: 'Checklist not found' });
        return;
      }

      const card = await CardModel.findById(cardId);

      if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);

      if (role === 'observer') {
        res.status(403).json({ error: 'Observers cannot delete checklists' });
        return;
      }

      await ChecklistModel.delete(checklistId);
      res.json({ message: 'Checklist deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export class ChecklistItemController {
  static async getItems(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const checklistId = parseInt(req.params.checklistId);
      if (isNaN(checklistId)) {
        res.status(400).json({ error: 'Invalid checklist ID' });
        return;
      }

      const items = await ChecklistItemModel.findByChecklist(checklistId);
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async createItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const checklistId = parseInt(req.params.checklistId);
      if (isNaN(checklistId)) {
        res.status(400).json({ error: 'Invalid checklist ID' });
        return;
      }

      const cardId = await ChecklistModel.findCardId(checklistId);

      if (!cardId) {
        res.status(404).json({ error: 'Checklist not found' });
        return;
      }

      const card = await CardModel.findById(cardId);

      if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);

      if (role === 'observer') {
        res.status(403).json({ error: 'Observers cannot create checklist items' });
        return;
      }

      const validatedData = checklistItemCreateSchema.parse(req.body);

      const item = await ChecklistItemModel.create(checklistId, validatedData.name, validatedData.position);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  static async updateItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }

      const checklistId = await ChecklistItemModel.findChecklistId(itemId);

      if (!checklistId) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      const cardId = await ChecklistModel.findCardId(checklistId);

      if (!cardId) {
        res.status(404).json({ error: 'Checklist not found' });
        return;
      }

      const card = await CardModel.findById(cardId);

      if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);

      if (role === 'observer') {
        res.status(403).json({ error: 'Observers cannot update checklist items' });
        return;
      }

      const validatedData = checklistItemUpdateSchema.parse(req.body);

      const item = await ChecklistItemModel.update(itemId, validatedData.name, validatedData.completed, validatedData.position);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async deleteItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }

      const checklistId = await ChecklistItemModel.findChecklistId(itemId);

      if (!checklistId) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      const cardId = await ChecklistModel.findCardId(checklistId);

      if (!cardId) {
        res.status(404).json({ error: 'Checklist not found' });
        return;
      }

      const card = await CardModel.findById(cardId);

      if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);

      if (role === 'observer') {
        res.status(403).json({ error: 'Observers cannot delete checklist items' });
        return;
      }

      await ChecklistItemModel.delete(itemId);
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async reorderItems(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const checklistId = parseInt(req.params.checklistId);
      if (isNaN(checklistId)) {
        res.status(400).json({ error: 'Invalid checklist ID' });
        return;
      }

      const cardId = await ChecklistModel.findCardId(checklistId);

      if (!cardId) {
        res.status(404).json({ error: 'Checklist not found' });
        return;
      }

      const card = await CardModel.findById(cardId);

      if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);

      if (role === 'observer') {
        res.status(403).json({ error: 'Observers cannot reorder checklist items' });
        return;
      }

      const validatedData = reorderItemsSchema.parse(req.body);

      await ChecklistItemModel.reorder(checklistId, validatedData.itemIds);

      const items = await ChecklistItemModel.findByChecklist(checklistId);
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async batchCreateItems(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const checklistId = parseInt(req.params.checklistId);
      if (isNaN(checklistId)) {
        res.status(400).json({ error: 'Invalid checklist ID' });
        return;
      }

      const cardId = await ChecklistModel.findCardId(checklistId);

      if (!cardId) {
        res.status(404).json({ error: 'Checklist not found' });
        return;
      }

      const card = await CardModel.findById(cardId);

      if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(card.board_id, req.user.id);

      if (role === 'observer') {
        res.status(403).json({ error: 'Observers cannot create checklist items' });
        return;
      }

      const validatedData = batchCreateItemsSchema.parse(req.body);

      const items = await ChecklistItemModel.batchCreate(checklistId, validatedData.items);
      res.status(201).json(items);
    } catch (error) {
      next(error);
    }
  }
}
