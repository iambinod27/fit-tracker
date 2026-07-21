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


router.get('/streak', async (req, res, next) => {
    try {
        const workoutDates = await db.execute({
            sql: 'SELECT DISTINCT date FROM workouts WHERE user_id = ?',
            args: [req.userId]
        })
        const runDates = await db.execute({
            sql: 'SELECT DISTINCT date FROM runs WHERE user_id = ?',
            args: [req.userId]
        })

        const allDates = new Set([
            ...workoutDates.rows.map((r) => r.date),
            ...runDates.rows.map((r) => r.date),
        ])

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today)
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            if (allDates.has(dateStr)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        res.json({ streak })
    } catch (error) {
        next(error)
    }
})

router.get('/heatmap', async (req, res, next) => {
    try {
        const workoutCounts = await db.execute({
            sql: 'SELECT date, COUNT(*) as count FROM workouts WHERE user_id = ? GROUP BY date',
            args: [req.userId]
        })
        const runCounts = await db.execute({
            sql: 'SELECT date, COUNT(*) as count FROM runs WHERE user_id = ? GROUP BY date',
            args: [req.userId]
        })

        const countsByDate = {};

        for (const row of workoutCounts.rows) {
            countsByDate[row.date] = (countsByDate[row.date] || 0) + Number(row.count);
        }

        for (const row of runCounts.rows) {
            countsByDate[row.date] = (countsByDate[row.date] || 0) + Number(row.count);
        }

        res.json(countsByDate)
    } catch (error) {
        next(error)
    }
})

export default router