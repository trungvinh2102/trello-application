import pool from '../db';
import { Activity, ActivityAction, ActivityFilter } from '../types/activity';

export class ActivityModel {
  static async findByBoard(
    boardId: number,
    filter?: ActivityFilter
  ): Promise<Activity[]> {
    const conditions: string[] = [`board_id = $1`];
    const values: any[] = [boardId];
    let paramIndex = 2;

    if (filter?.action) {
      conditions.push(`action = $${paramIndex++}`);
      values.push(filter.action);
    }

    if (filter?.cardId) {
      conditions.push(`card_id = $${paramIndex++}`);
      values.push(filter.cardId);
    }

    if (filter?.userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      values.push(filter.userId);
    }

    if (filter?.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      values.push(filter.startDate);
    }

    if (filter?.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      values.push(filter.endDate);
    }

    let query = `SELECT * FROM activities WHERE ${conditions.join(' AND ')}`;

    query += ' ORDER BY created_at DESC';

    if (filter?.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(filter.limit);
    }

    if (filter?.offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(filter.offset);
    }

    const result = await pool.query(query, values);

    return result.rows;
  }

  static async findByCard(
    cardId: number,
    filter?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<Activity[]> {
    let query = 'SELECT * FROM activities WHERE card_id = $1 ORDER BY created_at DESC';
    const values: any[] = [cardId];
    let paramIndex = 2;

    if (filter?.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(filter.limit);
    }

    if (filter?.offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(filter.offset);
    }

    const result = await pool.query(query, values);

    return result.rows;
  }

  static async findByUser(
    userId: number,
    filter?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<Activity[]> {
    let query = 'SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC';
    const values: any[] = [userId];
    let paramIndex = 2;

    if (filter?.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(filter.limit);
    }

    if (filter?.offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(filter.offset);
    }

    const result = await pool.query(query, values);

    return result.rows;
  }

  static async findById(id: number): Promise<Activity | null> {
    const result = await pool.query('SELECT * FROM activities WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(
    boardId: number,
    userId: number,
    action: string,
    details: Record<string, any>,
    cardId?: number
  ): Promise<Activity> {
    const result = await pool.query(
      `INSERT INTO activities (board_id, card_id, user_id, action, details)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [boardId, cardId || null, userId, action, JSON.stringify(details)]
    );

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM activities WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async deleteByCard(cardId: number): Promise<void> {
    await pool.query('DELETE FROM activities WHERE card_id = $1', [cardId]);
  }

  static async countByBoard(boardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM activities WHERE board_id = $1',
      [boardId]
    );

    return parseInt(result.rows[0].count, 10);
  }

  static async countByCard(cardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM activities WHERE card_id = $1',
      [cardId]
    );

    return parseInt(result.rows[0].count, 10);
  }
}
