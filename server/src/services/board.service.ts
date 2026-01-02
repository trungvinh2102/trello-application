import { BoardModel } from '../models/board.model';
import { BoardMemberModel } from '../models/auth.model';
import { UserModel } from '../models/auth.model';
import { ColumnModel } from '../models/column.model';
import { BoardCreateInput, BoardUpdateInput, BoardMemberCreateInput, BoardWithMembers } from '../types/board';

export class BoardService {
  static async getBoards(userId: number) {
    const boards = await BoardModel.findAllByUser(userId);
    return boards;
  }

  static async getBoardById(boardId: number, userId: number, includeCards = true): Promise<BoardWithMembers | null> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    const isMember = await BoardMemberModel.isMember(boardId, userId) || board.owner_id === userId;

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    const members = await BoardMemberModel.findByBoard(boardId);

    const membersWithUserInfo = members.map((member) => ({
      id: member.id,
      user_id: member.user_id,
      role: member.role as 'admin' | 'member' | 'observer',
      joined_at: member.joined_at,
      username: member.username,
      email: member.email,
      full_name: member.full_name,
      avatar_url: member.avatar_url,
    }));

    const columns = includeCards ? await ColumnModel.findAllByBoardWithCards(boardId) : await ColumnModel.findAllByBoard(boardId);

    return {
      ...board,
      members: membersWithUserInfo,
      columns,
    };
  }

  static async createBoard(userId: number, data: BoardCreateInput): Promise<any> {
    const board = await BoardModel.create(data.name, userId, data.description, data.visibility, data.background_color);

    await BoardMemberModel.create(board.id, userId, 'admin');

    return board;
  }

  static async updateBoard(boardId: number, userId: number, data: BoardUpdateInput): Promise<any> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    const role = await BoardMemberModel.findUserRole(boardId, userId);
    const isOwner = board.owner_id === userId;

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer') {
      throw new Error('Observers cannot update boards');
    }

    const updatedBoard = await BoardModel.update(boardId, data);

    return updatedBoard;
  }

  static async deleteBoard(boardId: number, userId: number): Promise<void> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    const role = await BoardMemberModel.findUserRole(boardId, userId);
    const isOwner = board.owner_id === userId;

    if (!isOwner && role !== 'admin') {
      throw new Error('Only board owners or admins can delete boards');
    }

    await BoardModel.delete(boardId);
  }
}

export class BoardMemberService {
  static async addMember(boardId: number, requesterId: number, data: BoardMemberCreateInput): Promise<any> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    const requesterRole = await BoardMemberModel.findUserRole(boardId, requesterId);

    if (requesterRole !== 'admin') {
      throw new Error('Only admins can add members');
    }

    let targetUserId: number;

    if (data.user_id) {
      const user = await UserModel.findById(data.user_id);
      if (!user) {
        throw new Error('User not found');
      }
      targetUserId = data.user_id;
    } else if (data.email) {
      const user = await UserModel.findByEmail(data.email);
      if (!user) {
        throw new Error('User with this email not found');
      }
      targetUserId = user.id;
    } else {
      throw new Error('Either user_id or email is required');
    }

    const existingMember = await BoardMemberModel.findByBoardAndUser(boardId, targetUserId);

    if (existingMember) {
      throw new Error('User is already a member of this board');
    }

    const member = await BoardMemberModel.create(boardId, targetUserId, data.role);

    const user = await UserModel.findById(targetUserId);

    return {
      id: member.id,
      user_id: member.user_id,
      role: member.role,
      joined_at: member.joined_at,
      username: user?.username,
      email: user?.email,
      full_name: user?.full_name,
      avatar_url: user?.avatar_url,
    };
  }

  static async getMembers(boardId: number, userId: number): Promise<any[]> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    const isMember = await BoardMemberModel.isMember(boardId, userId) || board.owner_id === userId;

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    const members = await BoardMemberModel.findByBoard(boardId);

    return members.map((member) => ({
      id: member.id,
      user_id: member.user_id,
      role: member.role as 'admin' | 'member' | 'observer',
      joined_at: member.joined_at,
      username: member.username,
      email: member.email,
      full_name: member.full_name,
      avatar_url: member.avatar_url,
    }));
  }

  static async updateMemberRole(
    boardId: number,
    targetUserId: number,
    requesterId: number,
    newRole: string
  ): Promise<any> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    if (board.owner_id === targetUserId) {
      throw new Error('Cannot change owner role');
    }

    const requesterRole = await BoardMemberModel.findUserRole(boardId, requesterId);

    if (requesterRole !== 'admin') {
      throw new Error('Only admins can update member roles');
    }

    const existingMember = await BoardMemberModel.findByBoardAndUser(boardId, targetUserId);

    if (!existingMember) {
      throw new Error('User is not a member of this board');
    }

    const updatedMember = await BoardMemberModel.updateRole(boardId, targetUserId, newRole);

    const user = await UserModel.findById(targetUserId);

    return {
      id: updatedMember.id,
      user_id: updatedMember.user_id,
      role: updatedMember.role,
      joined_at: updatedMember.joined_at,
      username: user?.username,
      email: user?.email,
      full_name: user?.full_name,
      avatar_url: user?.avatar_url,
    };
  }

  static async removeMember(boardId: number, targetUserId: number, requesterId: number): Promise<void> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    if (board.owner_id === targetUserId) {
      throw new Error('Cannot remove board owner');
    }

    const requesterRole = await BoardMemberModel.findUserRole(boardId, requesterId);

    if (requesterRole !== 'admin') {
      throw new Error('Only admins can remove members');
    }

    const success = await BoardMemberModel.delete(boardId, targetUserId);

    if (!success) {
      throw new Error('Failed to remove member');
    }
  }

  static async leaveBoard(boardId: number, userId: number): Promise<void> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    if (board.owner_id === userId) {
      throw new Error('Board owner cannot leave the board');
    }

    const success = await BoardMemberModel.delete(boardId, userId);

    if (!success) {
      throw new Error('Failed to leave board');
    }
  }
}
