import { CardModel, CardMemberModel } from '../models/card.model';
import { BoardModel } from '../models/board.model';
import { BoardMemberModel } from '../models/auth.model';
import { LabelModel, CardLabelModel } from '../models/label.model';
import { ChecklistModel } from '../models/checklist.model';
import { UserModel } from '../models/auth.model';
import pool from '../db';
import {
  Card,
  CardWithDetails,
  CardCreateInput,
  CardUpdateInput,
  CardMoveInput,
  CardDuplicateInput,
  CardArchiveInput,
} from '../types/card';
import { Label } from '../types/label';
import { PREDEFINED_COLORS } from '../types/label';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export class CardService {
  static async getCards(columnId: number, userId: number): Promise<Card[]> {
    const columnResult = await pool.query('SELECT board_id FROM columns WHERE id = $1', [columnId]);

    if (columnResult.rows.length === 0) {
      throw new Error('Column not found');
    }

    const boardId = columnResult.rows[0].board_id;

    const isMember = await BoardMemberModel.isMember(boardId, userId) || (await BoardModel.isOwner(boardId, userId));

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    return CardModel.findAllByColumn(columnId);
  }

  static async getCard(cardId: number, userId: number): Promise<CardWithDetails> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const isMember = await BoardMemberModel.isMember(card.board_id, userId) || (await BoardModel.isOwner(card.board_id, userId));

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    const members = await CardMemberModel.findByCard(cardId);
    const labels = await LabelModel.findByCard(cardId);
    const checklists = await ChecklistModel.findByCardWithProgress(cardId);

    return {
      ...card,
      members: members.map((m) => ({
        ...m,
        role: 'member',
      })),
      labels,
      checklists,
    };
  }

  static async createCard(columnId: number, userId: number, data: CardCreateInput): Promise<Card> {
    const columnResult = await pool.query('SELECT board_id FROM columns WHERE id = $1', [columnId]);

    if (columnResult.rows.length === 0) {
      throw new Error('Column not found');
    }

    const boardId = columnResult.rows[0].board_id;

    const role = await BoardMemberModel.findUserRole(boardId, userId);

    if (role === 'observer') {
      throw new Error('Observers cannot create cards');
    }

    let position = data.position;

    if (position === undefined) {
      const maxPosition = await CardModel.getMaxPosition(columnId);
      position = maxPosition + 1;
    }

    const dueDate = data.due_date ? new Date(data.due_date) : undefined;

    const card = await CardModel.create(data.name, boardId, columnId, data.description, dueDate, position);

    return card;
  }

  static async updateCard(cardId: number, userId: number, data: CardUpdateInput): Promise<Card> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot update cards');
    }

    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.due_date !== undefined) updateData.due_date = data.due_date ? new Date(data.due_date) : null;
    if (data.completed !== undefined) updateData.completed = data.completed;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.column_id !== undefined) updateData.column_id = data.column_id;

    const updatedCard = await CardModel.update(cardId, updateData);

    if (!updatedCard) {
      throw new Error('Failed to update card');
    }

    return updatedCard;
  }

  static async deleteCard(cardId: number, userId: number): Promise<void> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot delete cards');
    }

    await CardModel.delete(cardId);
  }

  static async moveCard(cardId: number, userId: number, data: CardMoveInput): Promise<Card> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot move cards');
    }

    const targetColumnResult = await pool.query(
      'SELECT board_id FROM columns WHERE id = $1',
      [data.target_column_id]
    );

    if (targetColumnResult.rows.length === 0) {
      throw new Error('Target column not found');
    }

    const targetBoardId = targetColumnResult.rows[0].board_id;

    if (targetBoardId !== card.board_id) {
      throw new Error('Cannot move cards between boards');
    }

    let position = data.position;

    if (position === undefined) {
      const maxPosition = await CardModel.getMaxPosition(data.target_column_id);
      position = maxPosition + 1;
    }

    const movedCard = await CardModel.moveToColumn(cardId, data.target_column_id, position);

    if (!movedCard) {
      throw new Error('Failed to move card');
    }

    return movedCard;
  }

  static async duplicateCard(cardId: number, userId: number, data: CardDuplicateInput): Promise<Card> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot duplicate cards');
    }

    const targetColumnId = data.target_column_id || card.column_id;
    const maxPosition = await CardModel.getMaxPosition(targetColumnId);
    const newPosition = maxPosition + 1;
    const newName = data.name || `${card.name} (Copy)`;

    const newCard = await CardModel.duplicate(cardId, targetColumnId, newName, newPosition);

    if (!newCard) {
      throw new Error('Failed to duplicate card');
    }

    return newCard;
  }

  static async archiveCard(cardId: number, userId: number, data: CardArchiveInput): Promise<Card> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot archive cards');
    }

    const updatedCard = await CardModel.update(cardId, { completed: data.archived });

    if (!updatedCard) {
      throw new Error('Failed to archive card');
    }

    return updatedCard;
  }
}

export class CardMemberService {
  static async getMembers(cardId: number, userId: number) {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const isMember = await BoardMemberModel.isMember(card.board_id, userId) || (await BoardModel.isOwner(card.board_id, userId));

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    const members = await CardMemberModel.findByCard(cardId);

    return members.map((m) => ({
      ...m,
      role: 'member',
    }));
  }

  static async addMember(cardId: number, userId: number, data: any): Promise<any> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot add card members');
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

    const isBoardMember = await BoardMemberModel.isMember(card.board_id, targetUserId);

    if (!isBoardMember) {
      throw new Error('User must be a member of the board first');
    }

    const existingMember = await CardMemberModel.findByCardAndUser(cardId, targetUserId);

    if (existingMember) {
      throw new Error('User is already a member of this card');
    }

    const member = await CardMemberModel.create(cardId, targetUserId);

    const user = await UserModel.findById(targetUserId);

    return {
      ...member,
      role: 'member',
      username: user?.username,
      email: user?.email,
      full_name: user?.full_name,
      avatar_url: user?.avatar_url,
    };
  }

  static async removeMember(cardId: number, targetUserId: number, userId: number): Promise<void> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot remove card members');
    }

    const success = await CardMemberModel.delete(cardId, targetUserId);

    if (!success) {
      throw new Error('Failed to remove member');
    }
  }

  static async batchAddMembers(cardId: number, userId: number, data: any): Promise<any[]> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot add card members');
    }

    let userIds: number[] = [];

    if (data.userIds && data.userIds.length > 0) {
      userIds = data.userIds;
    } else if (data.emails && data.emails.length > 0) {
      for (const email of data.emails) {
        const user = await UserModel.findByEmail(email);
        if (!user) {
          throw new Error(`User with email ${email} not found`);
        }

        const isBoardMember = await BoardMemberModel.isMember(card.board_id, user.id);

        if (!isBoardMember) {
          throw new Error(`User ${email} must be a member of the board first`);
        }

        userIds.push(user.id);
      }
    } else {
      throw new Error('Either userIds or emails is required');
    }

    const existingMembers = await CardMemberModel.findByCard(cardId);
    const existingUserIds = existingMembers.map((m) => m.user_id);

    const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));

    if (newUserIds.length === 0) {
      return [];
    }

    const members = await CardMemberModel.batchCreate(cardId, newUserIds);

    const result = [];

    for (const member of members) {
      const user = await UserModel.findById(member.user_id);
      result.push({
        ...member,
        role: 'member',
        username: user?.username,
        email: user?.email,
        full_name: user?.full_name,
        avatar_url: user?.avatar_url,
      });
    }

    return result;
  }
}

export class LabelService {
  static async getBoardLabels(boardId: number, userId: number): Promise<Label[]> {
    const isMember = await BoardMemberModel.isMember(boardId, userId) || (await BoardModel.isOwner(boardId, userId));

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    return LabelModel.findByBoard(boardId);
  }

  static async createLabel(boardId: number, userId: number, data: any): Promise<Label> {
    const role = await BoardMemberModel.findUserRole(boardId, userId);
    const isOwner = await BoardModel.isOwner(boardId, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot create labels');
    }

    let color = data.color;

    if (!hexColorRegex.test(color)) {
      const predefinedColor = PREDEFINED_COLORS.find((c) => c.name === color);

      if (!predefinedColor) {
        throw new Error('Invalid color. Use a valid hex code or predefined color name');
      }

      color = predefinedColor.hex;
    }

    const label = await LabelModel.create(data.name, boardId, color);

    return label;
  }

  static async updateLabel(labelId: number, userId: number, data: any): Promise<Label> {
    const label = await LabelModel.findById(labelId);

    if (!label) {
      throw new Error('Label not found');
    }

    const role = await BoardMemberModel.findUserRole(label.board_id, userId);
    const isOwner = await BoardModel.isOwner(label.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot update labels');
    }

    let color = data.color;

    if (color !== undefined && !hexColorRegex.test(color)) {
      const predefinedColor = PREDEFINED_COLORS.find((c) => c.name === color);

      if (!predefinedColor) {
        throw new Error('Invalid color. Use a valid hex code or predefined color name');
      }

      color = predefinedColor.hex;
    }

    const updatedLabel = await LabelModel.update(labelId, data.name, color);

    if (!updatedLabel) {
      throw new Error('Failed to update label');
    }

    return updatedLabel;
  }

  static async deleteLabel(labelId: number, userId: number): Promise<void> {
    const label = await LabelModel.findById(labelId);

    if (!label) {
      throw new Error('Label not found');
    }

    const role = await BoardMemberModel.findUserRole(label.board_id, userId);
    const isOwner = await BoardModel.isOwner(label.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot delete labels');
    }

    await LabelModel.delete(labelId);
  }
}

export class CardLabelService {
  static async getCardLabels(cardId: number, userId: number): Promise<Label[]> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const isMember = await BoardMemberModel.isMember(card.board_id, userId) || (await BoardModel.isOwner(card.board_id, userId));

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    return LabelModel.findByCard(cardId);
  }

  static async assignLabel(cardId: number, userId: number, data: any): Promise<Label[]> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot assign labels');
    }

    const label = await LabelModel.findById(data.labelId);

    if (!label) {
      throw new Error('Label not found');
    }

    if (label.board_id !== card.board_id) {
      throw new Error('Label does not belong to this board');
    }

    await CardLabelModel.create(cardId, data.labelId);

    return LabelModel.findByCard(cardId);
  }

  static async removeLabel(cardId: number, labelId: number, userId: number): Promise<void> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot remove labels');
    }

    await CardLabelModel.delete(cardId, labelId);
  }

  static async batchUpdateLabels(cardId: number, userId: number, data: any): Promise<Label[]> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(card.board_id, userId);
    const isOwner = await BoardModel.isOwner(card.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot update labels');
    }

    await CardLabelModel.batchUpdate(cardId, data.labelIds);

    return LabelModel.findByCard(cardId);
  }
}
