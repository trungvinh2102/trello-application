import { ColumnModel } from '../models/column.model';
import { BoardModel } from '../models/board.model';
import { BoardMemberModel } from '../models/auth.model';
import {
  ColumnCreateInput,
  ColumnUpdateInput,
  ColumnReorderInput,
  ColumnWithCards,
  ColumnMoveInput,
  ColumnDuplicateInput,
} from '../types/column';

export class ColumnService {
  static async getColumns(boardId: number, userId: number, includeCards = false): Promise<any[]> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    const isMember = await BoardMemberModel.isMember(boardId, userId) || board.owner_id === userId;

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    if (includeCards) {
      const columns = await ColumnModel.findAllByBoard(boardId);
      const columnsWithCards = [];

      for (const column of columns) {
        const columnWithCards = await ColumnModel.findByIdWithCards(column.id);
        if (columnWithCards) {
          columnsWithCards.push(columnWithCards);
        }
      }

      return columnsWithCards;
    }

    return ColumnModel.findAllByBoardWithCardsCount(boardId);
  }

  static async getColumn(columnId: number, userId: number, includeCards = false): Promise<any> {
    const column = await ColumnModel.findById(columnId);

    if (!column) {
      throw new Error('Column not found');
    }

    const isMember = await BoardMemberModel.isMember(column.board_id, userId) || (await BoardModel.isOwner(column.board_id, userId));

    if (!isMember) {
      throw new Error('You are not a member of this board');
    }

    if (includeCards) {
      const columnWithCards = await ColumnModel.findByIdWithCards(columnId);
      if (!columnWithCards) {
        throw new Error('Column not found');
      }
      return columnWithCards;
    }

    return column;
  }

  static async createColumn(boardId: number, userId: number, data: ColumnCreateInput): Promise<any> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    const role = await BoardMemberModel.findUserRole(boardId, userId);

    if (role === 'observer' && board.owner_id !== userId) {
      throw new Error('Observers cannot create columns');
    }

    let position = data.position;

    if (position === undefined) {
      const maxPosition = await ColumnModel.getMaxPosition(boardId);
      position = maxPosition + 1;
    }

    const column = await ColumnModel.create(data.name, boardId, position);

    const orderedColumns = await BoardModel.getOrderedColumnsId(boardId);
    orderedColumns.push(column.id);
    await BoardModel.updateOrderedColumnsId(boardId, orderedColumns);

    return column;
  }

  static async updateColumn(columnId: number, userId: number, data: ColumnUpdateInput): Promise<any> {
    const column = await ColumnModel.findById(columnId);

    if (!column) {
      throw new Error('Column not found');
    }

    const role = await BoardMemberModel.findUserRole(column.board_id, userId);
    const isOwner = await BoardModel.isOwner(column.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot update columns');
    }

    let updatedColumn = await ColumnModel.update(columnId, data);

    if (data.position !== undefined) {
      const newPosition = data.position;
      const allColumns = await ColumnModel.findAllByBoard(column.board_id);
      const updates: Array<{ id: number; position: number }> = [];

      allColumns.forEach((col, index) => {
        if (col.id === columnId) {
          updates.push({ id: col.id, position: newPosition });
        } else if (index >= newPosition) {
          updates.push({ id: col.id, position: index + 1 });
        } else {
          updates.push({ id: col.id, position: index });
        }
      });

      await ColumnModel.batchUpdatePositions(updates);

      const orderedColumns = await BoardModel.getOrderedColumnsId(column.board_id);
      const columnIdIndex = orderedColumns.indexOf(columnId);

      if (columnIdIndex > -1) {
        orderedColumns.splice(columnIdIndex, 1);
        orderedColumns.splice(newPosition, 0, columnId);
        await BoardModel.updateOrderedColumnsId(column.board_id, orderedColumns);
      }

      updatedColumn = await ColumnModel.findById(columnId);
    }

    return updatedColumn;
  }

  static async deleteColumn(columnId: number, userId: number): Promise<void> {
    const column = await ColumnModel.findById(columnId);

    if (!column) {
      throw new Error('Column not found');
    }

    const role = await BoardMemberModel.findUserRole(column.board_id, userId);
    const isOwner = await BoardModel.isOwner(column.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot delete columns');
    }

    await ColumnModel.delete(columnId);

    const orderedColumns = await BoardModel.getOrderedColumnsId(column.board_id);
    const columnIdIndex = orderedColumns.indexOf(columnId);

    if (columnIdIndex > -1) {
      orderedColumns.splice(columnIdIndex, 1);
      await BoardModel.updateOrderedColumnsId(column.board_id, orderedColumns);
    }
  }

  static async reorderColumns(boardId: number, userId: number, data: ColumnReorderInput): Promise<any[]> {
    const board = await BoardModel.findById(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    const role = await BoardMemberModel.findUserRole(boardId, userId);
    const isOwner = await BoardModel.isOwner(boardId, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot reorder columns');
    }

    const updates = data.columnIds.map((columnId, index) => ({
      id: columnId,
      position: index,
    }));

    await ColumnModel.batchUpdatePositions(updates);
    await BoardModel.updateOrderedColumnsId(boardId, data.columnIds);

    return ColumnModel.findAllByBoard(boardId);
  }

  static async duplicateColumn(columnId: number, userId: number, data: ColumnDuplicateInput): Promise<any> {
    const column = await ColumnModel.findById(columnId);

    if (!column) {
      throw new Error('Column not found');
    }

    const role = await BoardMemberModel.findUserRole(column.board_id, userId);
    const isOwner = await BoardModel.isOwner(column.board_id, userId);

    if (!role && !isOwner) {
      throw new Error('You are not a member of this board');
    }

    if (role === 'observer' && !isOwner) {
      throw new Error('Observers cannot duplicate columns');
    }

    const maxPosition = await ColumnModel.getMaxPosition(column.board_id);
    const newPosition = maxPosition + 1;

    const newColumn = await ColumnModel.duplicate(columnId, data.newName || `${column.name} (Copy)`, newPosition);

    if (!newColumn) {
      throw new Error('Failed to duplicate column');
    }

    const orderedColumns = await BoardModel.getOrderedColumnsId(column.board_id);
    orderedColumns.push(newColumn.id);
    await BoardModel.updateOrderedColumnsId(column.board_id, orderedColumns);

    return newColumn;
  }

  static async moveColumn(columnId: number, userId: number, data: ColumnMoveInput): Promise<any> {
    const column = await ColumnModel.findById(columnId);

    if (!column) {
      throw new Error('Column not found');
    }

    const currentBoardRole = await BoardMemberModel.findUserRole(column.board_id, userId);
    const currentIsOwner = await BoardModel.isOwner(column.board_id, userId);

    if (!currentBoardRole && !currentIsOwner) {
      throw new Error('You are not a member of current board');
    }

    if (currentBoardRole === 'observer' && !currentIsOwner) {
      throw new Error('Observers cannot move columns');
    }

    const targetBoard = await BoardModel.findById(data.targetBoardId);

    if (!targetBoard) {
      throw new Error('Target board not found');
    }

    const targetBoardRole = await BoardMemberModel.findUserRole(data.targetBoardId, userId);
    const targetIsOwner = await BoardModel.isOwner(data.targetBoardId, userId);

    if (!targetBoardRole && !targetIsOwner) {
      throw new Error('You are not a member of target board');
    }

    if (targetBoardRole === 'observer' && !targetIsOwner) {
      throw new Error('Observers cannot move columns to this board');
    }

    let position = data.position;

    if (position === undefined) {
      const maxPosition = await ColumnModel.getMaxPosition(data.targetBoardId);
      position = maxPosition + 1;
    }

    const movedColumn = await ColumnModel.moveToBoard(columnId, data.targetBoardId, position);

    if (!movedColumn) {
      throw new Error('Failed to move column');
    }

    const sourceOrderedColumns = await BoardModel.getOrderedColumnsId(column.board_id);
    const columnIdIndex = sourceOrderedColumns.indexOf(columnId);

    if (columnIdIndex > -1) {
      sourceOrderedColumns.splice(columnIdIndex, 1);
      await BoardModel.updateOrderedColumnsId(column.board_id, sourceOrderedColumns);
    }

    const targetOrderedColumns = await BoardModel.getOrderedColumnsId(data.targetBoardId);
    targetOrderedColumns.push(movedColumn.id);
    await BoardModel.updateOrderedColumnsId(data.targetBoardId, targetOrderedColumns);

    return movedColumn;
  }
}
