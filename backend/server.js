import 'dotenv/config';
import express from 'express';
import cors from "cors";
import authRoutes from "./routes/auth.js"
import workoutRoutes from "./routes/workouts.js"
import runRoutes from "./routes/runs.js"
import statsRoutes from "./routes/stats.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});