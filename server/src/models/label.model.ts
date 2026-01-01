import pool from '../db';
import { Label } from '../types/label';

export class LabelModel {
  static async findByBoard(boardId: number): Promise<Label[]> {
    const result = await pool.query(
      'SELECT * FROM labels WHERE board_id = $1 ORDER BY created_at ASC',
      [boardId]
    );

    return result.rows;
  }

  static async findById(id: number): Promise<Label | null> {
    const result = await pool.query('SELECT * FROM labels WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findBoardId(labelId: number): Promise<number | null> {
    const result = await pool.query('SELECT board_id FROM labels WHERE id = $1', [labelId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].board_id;
  }

  static async create(name: string, boardId: number, color: string): Promise<Label> {
    const result = await pool.query(
      `INSERT INTO labels (name, board_id, color)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, boardId, color]
    );

    return result.rows[0];
  }

  static async update(id: number, name?: string, color?: string): Promise<Label | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }

    if (color !== undefined) {
      updates.push(`color = $${paramIndex++}`);
      values.push(color);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE labels SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM labels WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async findByCard(cardId: number): Promise<Label[]> {
    const result = await pool.query(
      `SELECT l.*
       FROM labels l
       JOIN card_labels cl ON l.id = cl.label_id
       WHERE cl.card_id = $1
       ORDER BY l.name ASC`,
      [cardId]
    );

    return result.rows;
  }
}

export class CardLabelModel {
  static async findByCard(cardId: number): Promise<Array<{ label_id: number }>> {
    const result = await pool.query(
      'SELECT label_id FROM card_labels WHERE card_id = $1',
      [cardId]
    );

    return result.rows;
  }

  static async create(cardId: number, labelId: number): Promise<any> {
    const result = await pool.query(
      `INSERT INTO card_labels (card_id, label_id)
       VALUES ($1, $2)
       RETURNING *`,
      [cardId, labelId]
    );

    return result.rows[0];
  }

  static async delete(cardId: number, labelId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM card_labels WHERE card_id = $1 AND label_id = $2',
      [cardId, labelId]
    );

    return (result.rowCount || 0) > 0;
  }

  static async deleteAllForCard(cardId: number): Promise<void> {
    await pool.query('DELETE FROM card_labels WHERE card_id = $1', [cardId]);
  }

  static async batchUpdate(cardId: number, labelIds: number[]): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM card_labels WHERE card_id = $1', [cardId]);

      if (labelIds.length > 0) {
        const values = labelIds.map((labelId, index) => `($1, $${index + 2})`).join(',');
        const params = [cardId, ...labelIds];

        await client.query(
          `INSERT INTO card_labels (card_id, label_id) VALUES ${values}`,
          params
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

  static async countByCard(cardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM card_labels WHERE card_id = $1',
      [cardId]
    );

    return parseInt(result.rows[0].count, 10);
  }
}
