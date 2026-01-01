import pool from '../db';
import { Card, CardCreateInput, CardUpdateInput, CardMember, CardMemberWithUser } from '../types/card';

export class CardModel {
  static async findAllByColumn(columnId: number): Promise<Card[]> {
    const result = await pool.query(
      `SELECT 
        c.id, c.name, c.description, c.board_id, c.column_id, 
        c.due_date, c.completed, c.position, c.created_at, c.updated_at,
        CASE 
          WHEN c.due_date < NOW() AND c.completed = FALSE THEN TRUE 
          ELSE FALSE 
        END as is_overdue
       FROM cards c
       WHERE c.column_id = $1
       ORDER BY c.position ASC`,
      [columnId]
    );

    return result.rows;
  }

  static async findById(id: number): Promise<Card | null> {
    const result = await pool.query(
      `SELECT 
        c.id, c.name, c.description, c.board_id, c.column_id, 
        c.due_date, c.completed, c.position, c.created_at, c.updated_at,
        CASE 
          WHEN c.due_date < NOW() AND c.completed = FALSE THEN TRUE 
          ELSE FALSE 
        END as is_overdue
       FROM cards c
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findBoardId(cardId: number): Promise<number | null> {
    const result = await pool.query('SELECT board_id FROM cards WHERE id = $1', [cardId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].board_id;
  }

  static async create(
    name: string,
    boardId: number,
    columnId: number,
    description?: string,
    dueDate?: Date,
    position?: number
  ): Promise<Card> {
    const result = await pool.query(
      `INSERT INTO cards (name, board_id, column_id, description, due_date, position)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, boardId, columnId, description || null, dueDate || null, position ?? 0]
    );

    return result.rows[0];
  }

  static async update(id: number, data: CardUpdateInput): Promise<Card | null> {
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

    if (data.due_date !== undefined) {
      updates.push(`due_date = $${paramIndex++}`);
      values.push(data.due_date);
    }

    if (data.completed !== undefined) {
      updates.push(`completed = $${paramIndex++}`);
      values.push(data.completed);

      if (data.completed) {
        updates.push(`completed_at = CURRENT_TIMESTAMP`);
      } else {
        updates.push(`completed_at = NULL`);
      }
    }

    if (data.position !== undefined) {
      updates.push(`position = $${paramIndex++}`);
      values.push(data.position);
    }

    if (data.column_id !== undefined) {
      updates.push(`column_id = $${paramIndex++}`);
      values.push(data.column_id);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE cards SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM cards WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async getMaxPosition(columnId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COALESCE(MAX(position), -1) as max_position FROM cards WHERE column_id = $1',
      [columnId]
    );

    return result.rows[0].max_position;
  }

  static async moveToColumn(cardId: number, targetColumnId: number, position: number): Promise<Card | null> {
    const result = await pool.query(
      `UPDATE cards 
       SET column_id = $1, position = $2
       WHERE id = $3
       RETURNING *`,
      [targetColumnId, position, cardId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async duplicate(
    cardId: number,
    targetColumnId: number,
    newName: string,
    position: number
  ): Promise<Card | null> {
    const originalCard = await this.findById(cardId);

    if (!originalCard) {
      return null;
    }

    const result = await pool.query(
      `INSERT INTO cards (name, description, board_id, column_id, due_date, position)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [newName, originalCard.description, originalCard.board_id, targetColumnId, originalCard.due_date, position]
    );

    return result.rows[0];
  }
}

export class CardMemberModel {
  static async findByCard(cardId: number): Promise<CardMemberWithUser[]> {
    const result = await pool.query(
      `SELECT cm.id, cm.card_id, cm.user_id, cm.assigned_at,
              u.username, u.email, u.full_name, u.avatar_url
       FROM card_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.card_id = $1
       ORDER BY cm.assigned_at ASC`,
      [cardId]
    );

    return result.rows;
  }

  static async findByCardAndUser(cardId: number, userId: number): Promise<CardMember | null> {
    const result = await pool.query(
      'SELECT * FROM card_members WHERE card_id = $1 AND user_id = $2',
      [cardId, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(cardId: number, userId: number): Promise<CardMember> {
    const result = await pool.query(
      `INSERT INTO card_members (card_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [cardId, userId]
    );

    return result.rows[0];
  }

  static async delete(cardId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM card_members WHERE card_id = $1 AND user_id = $2',
      [cardId, userId]
    );

    return (result.rowCount || 0) > 0;
  }

  static async batchCreate(cardId: number, userIds: number[]): Promise<CardMember[]> {
    if (userIds.length === 0) {
      return [];
    }

    const values = userIds.map((userId, index) => `($1, $${index + 2})`).join(',');
    const params = [cardId, ...userIds];

    const result = await pool.query(
      `INSERT INTO card_members (card_id, user_id)
       VALUES ${values}
       RETURNING *`,
      params
    );

    return result.rows;
  }

  static async countByCard(cardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM card_members WHERE card_id = $1',
      [cardId]
    );

    return parseInt(result.rows[0].count, 10);
  }
}
