import { AttachmentModel } from '../models/attachment.model';
import { BoardMemberModel } from '../models/auth.model';
import { CardModel } from '../models/card.model';
import { AttachmentCreateInput } from '../types/attachment';

export class AttachmentService {
  static async getAttachments(cardId: number, userId: number) {
    const cardBoardId = await CardModel.findBoardId(cardId);

    if (!cardBoardId) {
      throw new Error('Card not found');
    }

    const isMember = await BoardMemberModel.isMember(cardBoardId, userId);

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    return AttachmentModel.findByCard(cardId);
  }

  static async uploadAttachment(cardId: number, userId: number, name: string, fileUrl: string, fileSize?: number, mimeType?: string) {
    const cardBoardId = await CardModel.findBoardId(cardId);

    if (!cardBoardId) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(cardBoardId, userId);

    if (role === 'observer') {
      throw new Error('Observers cannot upload attachments');
    }

    const attachment = await AttachmentModel.create(cardId, name, fileUrl, fileSize, mimeType);

    return attachment;
  }

  static async deleteAttachment(attachmentId: number, userId: number) {
    const attachment = await AttachmentModel.findById(attachmentId);

    if (!attachment) {
      throw new Error('Attachment not found');
    }

    const cardBoardId = await CardModel.findBoardId(attachment.card_id);

    if (!cardBoardId) {
      throw new Error('Card not found');
    }

    const role = await BoardMemberModel.findUserRole(cardBoardId, userId);

    if (role === 'observer') {
      throw new Error('Observers cannot delete attachments');
    }

    const success = await AttachmentModel.delete(attachmentId);

    if (!success) {
      throw new Error('Failed to delete attachment');
    }
  }

  static async countByCard(cardId: number) {
    return AttachmentModel.countByCard(cardId);
  }

  static async findById(attachmentId: number) {
    return AttachmentModel.findById(attachmentId);
  }
}
