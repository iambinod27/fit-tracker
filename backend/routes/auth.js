import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) return res.status(409).json({ error: 'Email already registered' });

        const hash = await bcrypt.hash(password, 10);
        const result = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash);

        const token = jwt.sign({ userId: result.lastInsertRowid }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token })
    } catch (error) {
        next(err);
    }
})

export default router;