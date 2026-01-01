import pool from '../db';
import { Attachment } from '../types/attachment';

export class AttachmentModel {
  static async findByCard(cardId: number): Promise<Attachment[]> {
    const result = await pool.query(
      'SELECT * FROM attachments WHERE card_id = $1 ORDER BY uploaded_at DESC',
      [cardId]
    );

    return result.rows;
  }

  static async findById(id: number): Promise<Attachment | null> {
    const result = await pool.query('SELECT * FROM attachments WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(
    cardId: number,
    name: string,
    fileUrl: string,
    fileSize?: number,
    mimeType?: string
  ): Promise<Attachment> {
    const result = await pool.query(
      `INSERT INTO attachments (card_id, name, file_url, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [cardId, name, fileUrl, fileSize || null, mimeType || null]
    );

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM attachments WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async findByCardIdAndName(cardId: number, fileName: string): Promise<Attachment | null> {
    const result = await pool.query(
      'SELECT * FROM attachments WHERE card_id = $1 AND name = $2',
      [cardId, fileName]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async countByCard(cardId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM attachments WHERE card_id = $1',
      [cardId]
    );

    return parseInt(result.rows[0].count, 10);
  }

  static async findCardId(id: number): Promise<number | null> {
    const result = await pool.query('SELECT card_id FROM attachments WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].card_id;
  }
}
