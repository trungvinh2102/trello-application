import { Request, Response, NextFunction } from 'express';
import { ColumnService } from '../services/column.service';
import { AuthRequest } from '../types/auth';
import {
  columnCreateSchema,
  columnUpdateSchema,
  columnReorderSchema,
  columnMoveSchema,
  columnDuplicateSchema,
} from '../validators/column.validator';

export class ColumnController {
  static async getAllColumns(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const includeCards = req.query.includeCards === 'true';

      const columns = await ColumnService.getColumns(boardId, req.user.id, includeCards);
      res.json(columns);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Board not found') {
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

  static async getColumn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const columnId = parseInt(req.params.id);
      if (isNaN(columnId)) {
        res.status(400).json({ error: 'Invalid column ID' });
        return;
      }

      const includeCards = req.query.includeCards === 'true';

      const column = await ColumnService.getColumn(columnId, req.user.id, includeCards);
      res.json(column);
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

  static async createColumn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = columnCreateSchema.parse(req.body);

      const column = await ColumnService.createColumn(boardId, req.user.id, validatedData);
      res.status(201).json(column);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Board not found') {
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

  static async updateColumn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const columnId = parseInt(req.params.id);
      if (isNaN(columnId)) {
        res.status(400).json({ error: 'Invalid column ID' });
        return;
      }

      const validatedData = columnUpdateSchema.parse(req.body);

      const column = await ColumnService.updateColumn(columnId, req.user.id, validatedData);
      res.json(column);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Column not found') {
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

  static async deleteColumn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const columnId = parseInt(req.params.id);
      if (isNaN(columnId)) {
        res.status(400).json({ error: 'Invalid column ID' });
        return;
      }

      await ColumnService.deleteColumn(columnId, req.user.id);
      res.json({ message: 'Column deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Column not found') {
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

  static async reorderColumns(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const validatedData = columnReorderSchema.parse(req.body);

      const columns = await ColumnService.reorderColumns(boardId, req.user.id, validatedData);
      res.json(columns);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Board not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot reorder')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async duplicateColumn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const columnId = parseInt(req.params.id);
      if (isNaN(columnId)) {
        res.status(400).json({ error: 'Invalid column ID' });
        return;
      }

      const validatedData = columnDuplicateSchema.parse(req.body);

      const column = await ColumnService.duplicateColumn(columnId, req.user.id, validatedData);
      res.status(201).json(column);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Column not found') {
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

  static async moveColumn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const columnId = parseInt(req.params.id);
      if (isNaN(columnId)) {
        res.status(400).json({ error: 'Invalid column ID' });
        return;
      }

      const validatedData = columnMoveSchema.parse(req.body);

      const column = await ColumnService.moveColumn(columnId, req.user.id, validatedData);
      res.json(column);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('not a member') || error.message.includes('cannot move')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }
}
