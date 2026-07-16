import { Router } from "express";
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';


const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
    const workouts = db.prepare('SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC').all(req.userId);

    const exerciseStmt = db.prepare('SELECT * FROM exercises WHERE workout_id = ?');
    const withExercises = workouts.map((w) => ({
        ...w, exercise: exerciseStmt.all(w.id),
    }))

    res.json(withExercises);
})


router.post('/', (req, res) => {
    const { date, notes, exercises = [] } = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    const insertWorkout = db.prepare(
        'INSERT INTO workouts (user_id, date, notes) VALUES (?, ?, ?)'
    );

    const insertExercises = db.prepare(
        'INSERT INTO exercises (workout_id, name, sets, reps, weight) VALUES (?, ?, ?, ?, ?)'
    );

    const tx = db.transaction(() => {
        const result = insertWorkout.run(req.userId, date, notes || null);
        const workoutId = result.lastInsertRowid;

        for (const ex of exercises) {
            insertExercises.run(workoutId, ex.name, ex.sets, ex.reps, ex.weight);
        }

        return workoutId
    });

    const workoutId = tx();
    res.status(201).json({ id: workoutId });
});

export default router;