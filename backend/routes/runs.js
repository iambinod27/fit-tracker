import { Router } from "express";
import db from '../db/index.js'
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);


router.get('/', async (req, res, next) => {
    try {
        const runs = await db.execute({ sql: 'SELECT * FROM runs WHERE user_id = ? ORDER BY date DESC', args: [req.userId] });
        res.json(runs.rows)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { date, distance_km, duration_min, notes } = req.body;
        if (!date || !distance_km || !duration_min) {
            return res.status(400).json({ error: 'date, distance_km, duration_min are required' });
        }

        const result = await db.execute({ sql: 'INSERT INTO runs (user_id, date, distance_km, duration_min, notes) VALUES (?,?,?,?,?)', args: [req.userId, date, distance_km, duration_min, notes || null] })
        res.status(201).json({ id: Number(result.lastInsertRowid) });
    } catch (error) {
        next(error)
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const result = await db.execute({ sql: 'DELETE FROM runs WHERE id = ? AND user_id = ?', args: [req.params.id, req.userId] })

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Run not found' });
        }

        res.status(204).send();
    } catch (error) {
        next(error)
    }
})

export default router;