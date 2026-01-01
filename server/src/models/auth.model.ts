import pool from '../db';
import { User, UserWithPassword, RefreshToken } from '../types/auth';

export class UserModel {
  static async findByEmail(email: string): Promise<UserWithPassword | null> {
    const result = await pool.query(
      'SELECT id, username, email, password_hash, full_name, avatar_url, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findById(id: number): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, username, email, full_name, avatar_url, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findByUsername(username: string): Promise<UserWithPassword | null> {
    const result = await pool.query(
      'SELECT id, username, email, password_hash, full_name, avatar_url, created_at, updated_at FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(
    username: string,
    email: string,
    passwordHash: string,
    fullName?: string
  ): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name, avatar_url, created_at, updated_at',
      [username, email, passwordHash, fullName || null]
    );

    return result.rows[0];
  }

  static async updateLastLogin(userId: number): Promise<void> {
    await pool.query('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [userId]);
  }
}

export class RefreshTokenModel {
  static async create(userId: number, token: string, expiresAt: Date): Promise<RefreshToken> {
    const result = await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [userId, token, expiresAt]
    );

    return result.rows[0];
  }

  static async findByToken(token: string): Promise<RefreshToken | null> {
    const result = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND is_revoked = FALSE AND expires_at > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async revoke(token: string): Promise<void> {
    await pool.query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = $1', [token]);
  }

  static async revokeAllUserTokens(userId: number): Promise<void> {
    await pool.query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = $1', [userId]);
  }

  static async deleteExpired(): Promise<number> {
    const result = await pool.query('DELETE FROM refresh_tokens WHERE expires_at < NOW() OR is_revoked = TRUE');
    return result.rowCount || 0;
  }

  static async deleteByUserId(userId: number): Promise<void> {
    await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  }
}

export class BoardMemberModel {
  static async findUserRole(boardId: number, userId: number): Promise<'admin' | 'member' | 'observer' | null> {
    const result = await pool.query(
      `SELECT role FROM board_members 
       WHERE board_id = $1 AND user_id = $2`,
      [boardId, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].role;
  }

  static async findByBoard(
    boardId: number
  ): Promise<
    Array<{
      id: number;
      user_id: number;
      username: string;
      email: string;
      full_name: string | null;
      avatar_url: string | null;
      role: string;
      joined_at: Date;
    }>
  > {
    const result = await pool.query(
      `SELECT bm.id, bm.user_id, u.username, u.email, u.full_name, u.avatar_url, bm.role, bm.joined_at
       FROM board_members bm
       JOIN users u ON bm.user_id = u.id
       WHERE bm.board_id = $1
       ORDER BY bm.joined_at ASC`,
      [boardId]
    );

    return result.rows;
  }

  static async findByUser(userId: number): Promise<Array<{ board_id: number; board_name: string; role: string }>> {
    const result = await pool.query(
      `SELECT bm.board_id, b.name as board_name, bm.role
       FROM board_members bm
       JOIN boards b ON bm.board_id = b.id
       WHERE bm.user_id = $1`,
      [userId]
    );

    return result.rows;
  }

  static async create(boardId: number, userId: number, role: string): Promise<any> {
    const result = await pool.query(
      `INSERT INTO board_members (board_id, user_id, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [boardId, userId, role]
    );

    return result.rows[0];
  }

  static async updateRole(boardId: number, userId: number, role: string): Promise<any | null> {
    const result = await pool.query(
      `UPDATE board_members 
       SET role = $1 
       WHERE board_id = $2 AND user_id = $3
       RETURNING *`,
      [role, boardId, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async delete(boardId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM board_members WHERE board_id = $1 AND user_id = $2',
      [boardId, userId]
    );

    return (result.rowCount || 0) > 0;
  }

  static async findByBoardAndUser(boardId: number, userId: number): Promise<any | null> {
    const result = await pool.query(
      'SELECT * FROM board_members WHERE board_id = $1 AND user_id = $2',
      [boardId, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async isMember(boardId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT id FROM board_members WHERE board_id = $1 AND user_id = $2',
      [boardId, userId]
    );

    return result.rows.length > 0;
  }
}
