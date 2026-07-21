import { Router } from "express";
import db from "../db/index.js"
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get('/exercise/:name', async (req, res, next) => {
    try {
        const rows = await db.execute({
            sql: `SELECT w.date, e.weight, e.sets, e.reps
         FROM exercises e
         JOIN workouts w ON w.id = e.workout_id
         WHERE w.user_id = ? AND e.name = ?
         ORDER BY w.date ASC`,
            args: [req.userId, req.params.name]
        })
        res.json(rows.rows);
    } catch (error) {
        next(error)
    }
});

router.get("/prs", async (req, res, next) => {
    try {
        const rows = await db.execute({
            sql: `SELECT e.name, MAX(e.weight) as max_weight
        FROM exercises e
        JOIN workouts w ON w.id = e.workout_id
        WHERE w.user_id = ?
        GROUP BY e.name
        ORDER BY e.name`,
            args: [req.userId]
        })
        res.json(rows.rows);
    } catch (error) {
        next(error)
    }
})


export default router