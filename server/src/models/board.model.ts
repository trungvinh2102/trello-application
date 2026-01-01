import pool from '../db';
import { Board, BoardCreateInput, BoardUpdateInput } from '../types/board';

export class BoardModel {
  static async findAllByUser(userId: number): Promise<Board[]> {
    const result = await pool.query(
      `SELECT b.id, b.name, b.description, b.owner_id, b.visibility, b.background_color, 
              b.ordered_columns_id, b.created_at, b.updated_at
       FROM boards b
       WHERE b.owner_id = $1 
          OR EXISTS (
            SELECT 1 FROM board_members bm 
            WHERE bm.board_id = b.id AND bm.user_id = $1
          )
       ORDER BY b.updated_at DESC`,
      [userId]
    );

    return result.rows;
  }

  static async findById(id: number): Promise<Board | null> {
    const result = await pool.query(
      'SELECT * FROM boards WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(
    name: string,
    ownerId: number,
    description?: string,
    visibility?: string,
    backgroundColor?: string
  ): Promise<Board> {
    const result = await pool.query(
      `INSERT INTO boards (name, owner_id, description, visibility, background_color)
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, ownerId, description || null, visibility || 'private', backgroundColor || null]
    );

    return result.rows[0];
  }

  static async update(
    id: number,
    data: BoardUpdateInput
  ): Promise<Board | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }

    if (data.visibility !== undefined) {
      updates.push(`visibility = $${paramIndex++}`);
      values.push(data.visibility);
    }

    if (data.background_color !== undefined) {
      updates.push(`background_color = $${paramIndex++}`);
      values.push(data.background_color);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE boards SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM boards WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async findByOwner(userId: number): Promise<Board[]> {
    const result = await pool.query(
      'SELECT * FROM boards WHERE owner_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return result.rows;
  }

  static async isOwner(boardId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT id FROM boards WHERE id = $1 AND owner_id = $2',
      [boardId, userId]
    );

    return result.rows.length > 0;
  }

  static async updateOrderedColumnsId(boardId: number, columnIds: number[]): Promise<void> {
    const orderString = JSON.stringify(columnIds);
    await pool.query(
      'UPDATE boards SET ordered_columns_id = $1 WHERE id = $2',
      [orderString, boardId]
    );
  }

  static async getOrderedColumnsId(boardId: number): Promise<number[]> {
    const result = await pool.query(
      'SELECT ordered_columns_id FROM boards WHERE id = $1',
      [boardId]
    );

    if (result.rows.length === 0 || !result.rows[0].ordered_columns_id) {
      return [];
    }

    try {
      return JSON.parse(result.rows[0].ordered_columns_id);
    } catch {
      return [];
    }
  }
}
