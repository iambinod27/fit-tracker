import { Router } from "express";
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';


const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const workoutsResult  = await db.execute({ sql: 'SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC', args: [req.userId] });

        const withExercises = await Promise.all(
            workoutsResult.rows.map(async (w) => {
                const exerciseResult = await db.execute({
                    sql: 'SELECT * FROM exercises WHERE workout_id = ?',
                    args: [w.id]
                });
                return { ...w, exercises: exerciseResult.rows }
            })
        )
        res.json(withExercises);
    } catch (error) {
        next(error)
    }
})


router.post('/', async (req, res, next) => {
    try {
        const { date, notes, exercises = [] } = req.body;
        if (!date) return res.status(400).json({ error: 'Date is required' });

        const workoutsResult = await db.execute({
            sql: 'INSERT INTO workouts (user_id, date, notes) VALUES (?, ?, ?)',
            args: [req.userId, date, notes || null]
        });
        const workoutId = Number(workoutsResult.lastInsertRowid);

        for (const ex of exercises) {
            await db.execute({
                sql: 'INSERT INTO exercises (workout_id, name, sets, reps, weight) VALUES (?, ?, ?, ?, ?)',
                args: [workoutId, ex.name, ex.sets, ex.reps, ex.weight]
            })
        }
        res.status(201).json({ id: workoutId });
    } catch (error) {
        next(error)
    }
});


router.delete("/:id", async (req, res, next) => {
    try {
        const result = db.execute({ sql: 'DELETE FROM workouts WHERE id = ? AND user_id = ?', args: [req.params.id, req.userId] })

        if ((await result).rowsAffected === 0) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(204).send();
    } catch (error) {
        next(error)
    }
})

export default router;



