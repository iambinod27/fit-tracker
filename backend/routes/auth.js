import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js'


const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await db.execute({
      sql: 'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
      args: [email, hash, first_name || null, last_name || null],
    });

    const token = jwt.sign({ userId: Number(result.lastInsertRowid) }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {

    const result = await db.execute({
      sql: 'SELECT id, email, first_name, last_name, weight_kg, height_cm, age FROM users WHERE id = ?',
      args: [req.userId]
    })

    const user = result.rows[0];

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);

  } catch (error) {
    next(error)
  }
})

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const { first_name, last_name, weight_kg, height_cm, age } = req.body

    await db.execute({
      sql: `UPDATE users
          SET first_name = ?, last_name = ?, weight_kg = ?, height_cm = ?, age = ?
          WHERE id = ?`,
      args: [
        first_name ?? null,
        last_name ?? null,
        weight_kg ?? null,
        height_cm ?? null,
        age ?? null,
        req.userId
      ]
    })

    const result = await db.execute({
      sql: 'SELECT id, email, first_name, last_name, weight_kg, height_cm, age FROM users WHERE id = ?',
      args: [req.userId]
    })

    res.json(result.rows[0]);
  } catch (error) {
    next(error)
  }
})

export default router;

