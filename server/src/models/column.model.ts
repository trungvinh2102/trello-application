import pool from '../db';
import { Column, ColumnCreateInput, ColumnUpdateInput, ColumnWithCards, Card } from '../types/column';

export class ColumnModel {
  static async findAllByBoard(boardId: number): Promise<Column[]> {
    const result = await pool.query(
      `SELECT id, name, board_id, position, ordered_columns_id, created_at, updated_at
       FROM columns
       WHERE board_id = $1
       ORDER BY position ASC`,
      [boardId]
    );

    return result.rows;
  }

  static async findAllByBoardWithCardsCount(boardId: number): Promise<ColumnWithCards[]> {
    const result = await pool.query(
      `SELECT 
        c.id, c.name, c.board_id, c.position, c.ordered_columns_id, 
        c.created_at, c.updated_at,
        COALESCE(COUNT(cd.id), 0) as cards_count
       FROM columns c
       LEFT JOIN cards cd ON c.id = cd.column_id
       WHERE c.board_id = $1
       GROUP BY c.id, c.name, c.board_id, c.position, c.ordered_columns_id, c.created_at, c.updated_at
       ORDER BY c.position ASC`,
      [boardId]
    );

    return result.rows;
  }

  static async findById(id: number): Promise<Column | null> {
    const result = await pool.query(
      'SELECT * FROM columns WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findByIdWithCards(id: number): Promise<Column & { cards: Card[] } | null> {
    const columnResult = await pool.query(
      'SELECT * FROM columns WHERE id = $1',
      [id]
    );

    if (columnResult.rows.length === 0) {
      return null;
    }

    const column = columnResult.rows[0];

    const cardsResult = await pool.query(
      `SELECT id, name, description, board_id, column_id, due_date, completed, position, created_at, updated_at
       FROM cards
       WHERE column_id = $1
       ORDER BY position ASC`,
      [id]
    );

    return {
      ...column,
      cards: cardsResult.rows,
    };
  }

  static async create(name: string, boardId: number, position: number): Promise<Column> {
    const result = await pool.query(
      `INSERT INTO columns (name, board_id, position)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, boardId, position]
    );

    return result.rows[0];
  }

  static async update(id: number, data: ColumnUpdateInput): Promise<Column | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }

    if (data.position !== undefined) {
      updates.push(`position = $${paramIndex++}`);
      values.push(data.position);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE columns SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM columns WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async duplicate(columnId: number, newName: string, position?: number): Promise<Column | null> {
    const originalColumn = await this.findById(columnId);

    if (!originalColumn) {
      return null;
    }

    const result = await pool.query(
      `INSERT INTO columns (name, board_id, position)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [newName, originalColumn.board_id, position ?? originalColumn.position]
    );

    const newColumn = result.rows[0];

    await pool.query(
      `INSERT INTO cards (name, description, board_id, column_id, due_date, completed, position)
       SELECT 
         name, description, board_id, $2, due_date, completed, position
       FROM cards
       WHERE column_id = $1`,
      [columnId, newColumn.id]
    );

    return newColumn;
  }

  static async moveToBoard(columnId: number, targetBoardId: number, position?: number): Promise<Column | null> {
    const column = await this.findById(columnId);

    if (!column) {
      return null;
    }

    const result = await pool.query(
      `UPDATE columns 
       SET board_id = $1, position = $2
       WHERE id = $3
       RETURNING *`,
      [targetBoardId, position ?? column.position, columnId]
    );

    await pool.query(
      `UPDATE cards 
       SET board_id = $1 
       WHERE column_id = $2`,
      [targetBoardId, columnId]
    );

    return result.rows[0];
  }

  static async batchUpdatePositions(updates: Array<{ id: number; position: number }>): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const update of updates) {
        await client.query(
          'UPDATE columns SET position = $1 WHERE id = $2',
          [update.position, update.id]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async countByBoard(boardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM columns WHERE board_id = $1',
      [boardId]
    );

    return parseInt(result.rows[0].count, 10);
  }

  static async getMaxPosition(boardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COALESCE(MAX(position), -1) as max_position FROM columns WHERE board_id = $1',
      [boardId]
    );

    return result.rows[0].max_position;
  }
}
