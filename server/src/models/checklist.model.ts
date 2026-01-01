import pool from '../db';
import { Checklist, ChecklistItem, ChecklistWithProgress } from '../types/checklist';

export class ChecklistModel {
  static async findByCard(cardId: number): Promise<Checklist[]> {
    const result = await pool.query(
      'SELECT * FROM checklists WHERE card_id = $1 ORDER BY position ASC',
      [cardId]
    );

    return result.rows;
  }

  static async findById(id: number): Promise<Checklist | null> {
    const result = await pool.query('SELECT * FROM checklists WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findCardId(checklistId: number): Promise<number | null> {
    const result = await pool.query('SELECT card_id FROM checklists WHERE id = $1', [checklistId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].card_id;
  }

  static async findByIdWithProgress(id: number): Promise<ChecklistWithProgress | null> {
    const checklistResult = await pool.query('SELECT * FROM checklists WHERE id = $1', [id]);

    if (checklistResult.rows.length === 0) {
      return null;
    }

    const checklist = checklistResult.rows[0];

    const itemsResult = await pool.query(
      'SELECT * FROM checklist_items WHERE checklist_id = $1',
      [id]
    );

    const total = itemsResult.rows.length;
    const completed = itemsResult.rows.filter((item: any) => item.completed).length;

    return {
      ...checklist,
      total_items: total,
      completed_items: completed,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
      items: itemsResult.rows,
    };
  }

  static async findByCardWithProgress(cardId: number): Promise<ChecklistWithProgress[]> {
    const checklistsResult = await pool.query(
      'SELECT * FROM checklists WHERE card_id = $1 ORDER BY position ASC',
      [cardId]
    );

    const checklists: ChecklistWithProgress[] = [];

    for (const checklist of checklistsResult.rows) {
      const itemsResult = await pool.query(
        'SELECT * FROM checklist_items WHERE checklist_id = $1',
        [checklist.id]
      );

      const total = itemsResult.rows.length;
      const completed = itemsResult.rows.filter((item: any) => item.completed).length;

      checklists.push({
        ...checklist,
        total_items: total,
        completed_items: completed,
        progress: total === 0 ? 0 : Math.round((completed / total) * 100),
        items: itemsResult.rows,
      });
    }

    return checklists;
  }

  static async create(name: string, cardId: number, position?: number): Promise<Checklist> {
    const result = await pool.query(
      `INSERT INTO checklists (name, card_id, position)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, cardId, position ?? 0]
    );

    return result.rows[0];
  }

  static async update(id: number, name?: string, position?: number): Promise<Checklist | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }

    if (position !== undefined) {
      updates.push(`position = $${paramIndex++}`);
      values.push(position);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE checklists SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM checklists WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async getMaxPosition(cardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COALESCE(MAX(position), -1) as max_position FROM checklists WHERE card_id = $1',
      [cardId]
    );

    return result.rows[0].max_position;
  }

  static async countByCard(cardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM checklists WHERE card_id = $1',
      [cardId]
    );

    return parseInt(result.rows[0].count, 10);
  }
}

export class ChecklistItemModel {
  static async findByChecklist(checklistId: number): Promise<ChecklistItem[]> {
    const result = await pool.query(
      'SELECT * FROM checklist_items WHERE checklist_id = $1 ORDER BY position ASC',
      [checklistId]
    );

    return result.rows;
  }

  static async findById(id: number): Promise<ChecklistItem | null> {
    const result = await pool.query('SELECT * FROM checklist_items WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findChecklistId(itemId: number): Promise<number | null> {
    const result = await pool.query('SELECT checklist_id FROM checklist_items WHERE id = $1', [itemId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].checklist_id;
  }

  static async create(
    checklistId: number,
    name: string,
    position?: number
  ): Promise<ChecklistItem> {
    const result = await pool.query(
      `INSERT INTO checklist_items (checklist_id, name, position)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [checklistId, name, position ?? 0]
    );

    return result.rows[0];
  }

  static async update(
    id: number,
    name?: string,
    completed?: boolean,
    position?: number
  ): Promise<ChecklistItem | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }

    if (completed !== undefined) {
      updates.push(`completed = $${paramIndex++}`);
      values.push(completed);

      if (completed) {
        updates.push(`completed_at = CURRENT_TIMESTAMP`);
      } else {
        updates.push(`completed_at = NULL`);
      }
    }

    if (position !== undefined) {
      updates.push(`position = $${paramIndex++}`);
      values.push(position);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE checklist_items SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM checklist_items WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async batchCreate(
    checklistId: number,
    items: Array<{ name: string; position?: number }>
  ): Promise<ChecklistItem[]> {
    if (items.length === 0) {
      return [];
    }

    const values = items
      .map((item, index) => `($1, $${index * 2 + 2}, $${index * 2 + 3})`)
      .join(',');
    const params: any[] = [checklistId];
    items.forEach((item) => {
      params.push(item.name, item.position ?? 0);
    });

    const result = await pool.query(
      `INSERT INTO checklist_items (checklist_id, name, position)
       VALUES ${values}
       RETURNING *`,
      params
    );

    return result.rows;
  }

  static async reorder(checklistId: number, itemIds: number[]): Promise<void> {
    const updates = itemIds.map((itemId, index) => ({
      id: itemId,
      position: index,
    }));

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const update of updates) {
        await client.query(
          'UPDATE checklist_items SET position = $1 WHERE id = $2',
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

  static async getMaxPosition(checklistId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COALESCE(MAX(position), -1) as max_position FROM checklist_items WHERE checklist_id = $1',
      [checklistId]
    );

    return result.rows[0].max_position;
  }

  static async countByChecklist(checklistId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM checklist_items WHERE checklist_id = $1',
      [checklistId]
    );

    return parseInt(result.rows[0].count, 10);
  }

  static async countCompletedByChecklist(checklistId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM checklist_items WHERE checklist_id = $1 AND completed = TRUE',
      [checklistId]
    );

    return parseInt(result.rows[0].count, 10);
  }
}
