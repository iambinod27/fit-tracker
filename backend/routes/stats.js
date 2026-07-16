import { Router } from "express";
import db from "../db/index.js"
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get('/exercise/:name', (req, res) => {
    const rows = db.prepare(
        `SELECT w.date, e.weight, e.sets, e.reps
         FROM exercises e
         JOIN workouts w ON w.id = e.workout_id
         WHERE w.user_id = ? AND e.name = ?
         ORDER BY w.date ASC`
    ).all(req.userId, req.params.name);
    res.json(rows);
});

router.get("/prs", (req, res) => {
    const rows = db.prepare(
        `SELECT e.name, MAX(e.weight) as max_weight
        FROM exercises e
        JOIN workouts w ON w.id = e.workout_id
        WHERE w.user_id = ?
        GROUP BY e.name
        ORDER BY e.name`
    ).all(req.userId)

    res.json(rows);
})


export default router