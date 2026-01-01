import { Router } from 'express';
import pool from '../db';

const router = Router();

router.get('/boards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM boards ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/boards', async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await pool.query(
      'INSERT INTO boards (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
