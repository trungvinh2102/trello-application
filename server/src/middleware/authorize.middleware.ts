import { Response, NextFunction } from 'express';
import { BoardMemberModel } from '../models/auth.model';
import { AuthRequest } from '../types/auth';

export type BoardRole = 'admin' | 'member' | 'observer';

interface BoardPermission {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canInviteMembers: boolean;
  canManageSettings: boolean;
}

const rolePermissions: Record<BoardRole, BoardPermission> = {
  admin: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canInviteMembers: true,
    canManageSettings: true,
  },
  member: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canInviteMembers: false,
    canManageSettings: false,
  },
  observer: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canInviteMembers: false,
    canManageSettings: false,
  },
};

export const requireBoardMember = (boardIdParam: string = 'boardId') => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params[boardIdParam]);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(boardId, req.user.id);
      if (!role) {
        res.status(403).json({ error: 'You are not a member of this board' });
        return;
      }

      req.boardRole = role;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

export const requireBoardRole = (allowedRoles: BoardRole[], boardIdParam: string = 'boardId') => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params[boardIdParam]);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(boardId, req.user.id);
      if (!role) {
        res.status(403).json({ error: 'You are not a member of this board' });
        return;
      }

      if (!allowedRoles.includes(role)) {
        res.status(403).json({
          error: `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`,
        });
        return;
      }

      req.boardRole = role;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

export const requireBoardPermission = (
  permission: keyof BoardPermission,
  boardIdParam: string = 'boardId'
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const boardId = parseInt(req.params[boardIdParam]);
      if (isNaN(boardId)) {
        res.status(400).json({ error: 'Invalid board ID' });
        return;
      }

      const role = await BoardMemberModel.findUserRole(boardId, req.user.id);
      if (!role) {
        res.status(403).json({ error: 'You are not a member of this board' });
        return;
      }

      const permissions = rolePermissions[role];
      if (!permissions[permission]) {
        res.status(403).json({
          error: `Insufficient permissions. Required: ${permission}`,
        });
        return;
      }

      req.boardRole = role;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

export const getBoardRole = async (boardId: number, userId: number): Promise<BoardRole | null> => {
  return BoardMemberModel.findUserRole(boardId, userId);
};

export const hasPermission = (role: BoardRole, permission: keyof BoardPermission): boolean => {
  return rolePermissions[role]?.[permission] || false;
};
