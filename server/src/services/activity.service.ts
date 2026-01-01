import { ActivityModel } from '../models/activity.model';
import { BoardMemberModel } from '../models/auth.model';
import { BoardModel } from '../models/board.model';
import { CardModel } from '../models/card.model';
import { ActivityAction } from '../types/activity';

export class ActivityService {
  static async logActivity(
    boardId: number,
    userId: number,
    action: string,
    details: Record<string, any>,
    cardId?: number
  ): Promise<void> {
    await ActivityModel.create(boardId, userId, action, details, cardId);
  }

  static async getBoardActivities(
    boardId: number,
    userId: number,
    filter?: {
      action?: ActivityAction;
      cardId?: number;
      userId?: number;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<any[]> {
    const isMember = await BoardMemberModel.isMember(boardId, userId) || (await BoardModel.isOwner(boardId, userId));

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    const activities = await ActivityModel.findByBoard(boardId, filter);

    return activities;
  }

  static async getCardActivities(
    cardId: number,
    userId: number,
    filter?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<any[]> {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    const isMember = await BoardMemberModel.isMember(card.board_id, userId) || (await BoardModel.isOwner(card.board_id, userId));

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    return ActivityModel.findByCard(cardId, filter);
  }

  static async getUserActivities(
    userId: number,
    requesterId: number,
    filter?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<any[]> {
    if (userId !== requesterId) {
      throw new Error('You can only view your own activities');
    }

    return ActivityModel.findByUser(userId, filter);
  }

  static async countByBoard(boardId: number) {
    return ActivityModel.countByBoard(boardId);
  }

  static async countByCard(cardId: number) {
    return ActivityModel.countByCard(cardId);
  }

  static async logCardCreated(boardId: number, cardId: number, userId: number, cardName: string) {
    await this.logActivity(
      boardId,
      userId,
      'card_created',
      { card_id: cardId, card_name: cardName },
      cardId
    );
  }

  static async logCardUpdated(boardId: number, cardId: number, userId: number, updates: any) {
    await this.logActivity(
      boardId,
      userId,
      'card_updated',
      { card_id: cardId, ...updates },
      cardId
    );
  }

  static async logCardDeleted(boardId: number, cardId: number, userId: number, cardName: string) {
    await this.logActivity(
      boardId,
      userId,
      'card_deleted',
      { card_id: cardId, card_name: cardName },
      cardId
    );
  }

  static async logCardMoved(boardId: number, cardId: number, userId: number, fromColumnId: number, toColumnId: number) {
    await this.logActivity(
      boardId,
      userId,
      'card_moved',
      { card_id: cardId, from_column_id: fromColumnId, to_column_id: toColumnId },
      cardId
    );
  }

  static async logCardArchived(boardId: number, cardId: number, userId: number, cardName: string) {
    await this.logActivity(
      boardId,
      userId,
      'card_archived',
      { card_id: cardId, card_name: cardName },
      cardId
    );
  }

  static async logCardRestored(boardId: number, cardId: number, userId: number, cardName: string) {
    await this.logActivity(
      boardId,
      userId,
      'card_restored',
      { card_id: cardId, card_name: cardName },
      cardId
    );
  }

  static async logCardAssigned(boardId: number, cardId: number, userId: number, assignee: string) {
    await this.logActivity(
      boardId,
      userId,
      'card_assigned',
      { card_id: cardId, assignee },
      cardId
    );
  }

  static async logCardUnassigned(boardId: number, cardId: number, userId: number, assignee: string) {
    await this.logActivity(
      boardId,
      userId,
      'card_unassigned',
      { card_id: cardId, assignee },
      cardId
    );
  }

  static async logCardLabeled(boardId: number, cardId: number, userId: number, labelName: string, labelColor: string) {
    await this.logActivity(
      boardId,
      userId,
      'card_labeled',
      { card_id: cardId, label_name: labelName, label_color: labelColor },
      cardId
    );
  }

  static async logCardUnlabeled(boardId: number, cardId: number, userId: number, labelName: string) {
    await this.logActivity(
      boardId,
      userId,
      'card_unlabeled',
      { card_id: cardId, label_name: labelName },
      cardId
    );
  }

  static async logColumnCreated(boardId: number, columnId: number, userId: number, columnName: string) {
    await this.logActivity(
      boardId,
      userId,
      'column_created',
      { column_id: columnId, column_name: columnName }
    );
  }

  static async logColumnDeleted(boardId: number, columnId: number, userId: number, columnName: string) {
    await this.logActivity(
      boardId,
      userId,
      'column_deleted',
      { column_id: columnId, column_name: columnName }
    );
  }

  static async logColumnMoved(boardId: number, columnId: number, userId: number, newPosition: number) {
    await this.logActivity(
      boardId,
      userId,
      'column_moved',
      { column_id: columnId, new_position: newPosition }
    );
  }

  static async logCommentCreated(boardId: number, cardId: number, userId: number, commentContent: string) {
    await this.logActivity(
      boardId,
      userId,
      'comment_created',
      { card_id: cardId, comment_preview: commentContent.substring(0, 100) },
      cardId
    );
  }

  static async logCommentUpdated(boardId: number, cardId: number, userId: number, commentId: number) {
    await this.logActivity(
      boardId,
      userId,
      'comment_updated',
      { card_id: cardId, comment_id: commentId },
      cardId
    );
  }

  static async logCommentDeleted(boardId: number, cardId: number, userId: number, commentId: number) {
    await this.logActivity(
      boardId,
      userId,
      'comment_deleted',
      { card_id: cardId, commentId },
      cardId
    );
  }

  static async logAttachmentAdded(boardId: number, cardId: number, userId: number, attachmentId: number, fileName: string) {
    await this.logActivity(
      boardId,
      userId,
      'attachment_added',
      { card_id: cardId, 'attachment_id': attachmentId, file_name: fileName },
      cardId
    );
  }

  static async logAttachmentRemoved(boardId: number, cardId: number, userId: number, attachmentId: number, fileName: string) {
    await this.logActivity(
      boardId,
      userId,
      'attachment_removed',
      { card_id: cardId, attachment_id: attachmentId, file_name: fileName },
      cardId
    );
  }

  static async logMemberAdded(boardId: number, boardName: string, userId: number, addedUserId: number, addedUserName: string, role: string) {
    await this.logActivity(
      boardId,
      userId,
      'member_added',
      { board_id: boardId, board_name: boardName, added_user_id: addedUserId, added_user_name: addedUserName, role }
    );
  }

  static async logMemberRemoved(boardId: number, boardName: string, userId: number, removedUserId: number, removedUserName: string) {
    await this.logActivity(
      boardId,
      userId,
      'member_removed',
      { board_id: boardId, board_name: boardName, removed_user_id: removedUserId, removed_user_name: removedUserName }
    );
  }

  static async logMemberRoleUpdated(boardId: number, boardName: string, userId: number, targetUserId: number, targetUserName: string, oldRole: string, newRole: string) {
    await this.logActivity(
      boardId,
      userId,
      'member_role_updated',
      { board_id: boardId, board_name: boardName, target_user_id: targetUserId, target_user_name: targetUserName, old_role: oldRole, new_role: newRole }
    );
  }
}
