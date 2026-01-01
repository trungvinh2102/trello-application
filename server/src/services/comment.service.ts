import pool from '../db';

export class CommentService {
  static async getComments(cardId: number, userId: number) {
    const result = await pool.query(
      'SELECT id, card_id, user_id, content, created_at FROM comments WHERE card_id = $1 ORDER BY created_at ASC',
      [cardId]
    );

    return result.rows;
  }

  static async createComment(cardId: number, userId: number, content: string) {
    const result = await pool.query(
      'INSERT INTO comments (card_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [cardId, userId, content]
    );

    return result.rows[0];
  }

  static async updateComment(commentId: number, userId: number, content: string) {
    const result = await pool.query(
      'UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [content, commentId, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async deleteComment(commentId: number, userId: number) {
    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 AND user_id = $2',
      [commentId, userId]
    );

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
