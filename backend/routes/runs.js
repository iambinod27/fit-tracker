import { Router } from "express";
import db from '../db/index.js'
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);


router.get('/', (req, res) => {
    const runs = db.prepare('SELECT * FROM runs WHERE user_id = ? ORDER BY date DESC').all(req.user.id);
    res.json(runs)
})

router.post('/', (req, res) => {
    const { date, distance_km, duration_min, notes } = req.body;
    if (!date || !distance_km || !duration_min) {
        return req.status(400).json({ error: 'date, distance_km, duration_min are required' });
    }

    const result = db.prepare('INSERT INTO runs (user_id, date, distance_km, duration_min, notes) VALUES (?,?,?,?,?)').run(req.userId, date, distance_km, duration_min, notes || null);

    res.status(201).json({ id: result.lastInsertRowid });
});

export default router;