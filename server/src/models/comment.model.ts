import pool from '../db';
import { Comment, CommentCreateInput, CommentUpdateInput } from '../types/comment';
import { UserModel } from '../models/auth.model';

export class CommentModel {
  static async findByCard(cardId: number): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT id, card_id, user_id, content, created_at
       FROM comments
       WHERE card_id = $1
       ORDER BY created_at ASC`,
      [cardId]
    );

    return result.rows;
  }

  static async findById(id: number): Promise<Comment | null> {
    const result = await pool.query(
      'SELECT * FROM comments WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findByCardWithUsers(cardId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT c.id, c.card_id, c.user_id, c.content, c.created_at,
              u.username, u.email, u.full_name, u.avatar_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.card_id = $1
       ORDER BY c.created_at ASC`,
      [cardId]
    );

    return result.rows;
  }

  static async create(cardId: number, userId: number, content: string): Promise<Comment> {
    const result = await pool.query(
      `INSERT INTO comments (card_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [cardId, userId, content]
    );

    return result.rows[0];
  }

  static async update(id: number, content: string): Promise<Comment | null> {
    const result = await pool.query(
      `UPDATE comments
       SET content = $1
       WHERE id = $2
       RETURNING *`,
      [content, id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async countByCard(cardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM comments WHERE card_id = $1',
      [cardId]
    );

    return parseInt(result.rows[0].count, 10);
  }
}
