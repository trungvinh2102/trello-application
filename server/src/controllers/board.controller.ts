import { Request, Response, NextFunction } from 'express';
import { BoardService, BoardMemberService } from '../services/board.service';
import { AuthRequest } from '../types/auth';
import { boardCreateSchema, boardUpdateSchema, addMemberSchema, updateMemberRoleSchema } from '../validators/board.validator';

export class BoardController {
  static async getAllBoards(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boards = await BoardService.getBoards(req.user.id);
      res.json(boards);
    } catch (error) {
      next(error);
    }
  }

  static async getBoard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params.id);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      const includeCards = req.query.includeCards !== 'false';
      const board = await BoardService.getBoardById(boardId, req.user.id, includeCards);
      res.json(board);
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

  static async createBoard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const validatedData = boardCreateSchema.parse(req.body);

      const board = await BoardService.createBoard(req.user.id, validatedData);
      res.status(201).json(board);
    } catch (error) {
      next(error);
    }
  }

  static async updateBoard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params.id);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      const validatedData = boardUpdateSchema.parse(req.body);

      const board = await BoardService.updateBoard(boardId, req.user.id, validatedData);
      res.json(board);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Board not found') {
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

  static async deleteBoard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params.id);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      await BoardService.deleteBoard(boardId, req.user.id);
      res.json({ message: 'Board deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Board not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('can delete')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }
}

export class BoardMemberController {
  static async addMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params.id);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      const validatedData = addMemberSchema.parse(req.body);

      const member = await BoardMemberService.addMember(boardId, req.user.id, {
        ...validatedData,
        board_id: boardId,
      });
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Board not found' || error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('can add') || error.message.includes('already a member')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async getMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params.id);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      const members = await BoardMemberService.getMembers(boardId, req.user.id);
      res.json(members);
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

  static async updateMemberRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params.id);
      const targetUserId = parseInt(req.params.userId);

      if (isNaN(boardId) || isNaN(targetUserId)) {
        res.status(400).json({ error: 'Invalid board ID or user ID' });
        return;
      }

      const validatedData = updateMemberRoleSchema.parse(req.body);

      const member = await BoardMemberService.updateMemberRole(boardId, targetUserId, req.user.id, validatedData.role);
      res.json(member);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Board not found' || error.message.includes('not a member')) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('Cannot change') || error.message.includes('can update') || error.message.includes('can change')) {
          res.status(403).json({ error: error.message });
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

      const boardId = parseInt(req.params.id);
      const targetUserId = parseInt(req.params.userId);

      if (isNaN(boardId) || isNaN(targetUserId)) {
        res.status(400).json({ error: 'Invalid board ID or user ID' });
        return;
      }

      await BoardMemberService.removeMember(boardId, targetUserId, req.user.id);
      res.json({ message: 'Member removed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Board not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('Cannot remove') || error.message.includes('can remove') || error.message.includes('Only admins')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }

  static async leaveBoard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params.id);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      await BoardMemberService.leaveBoard(boardId, req.user.id);
      res.json({ message: 'Left board successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Board not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('cannot leave')) {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  }
}
