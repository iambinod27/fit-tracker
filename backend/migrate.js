import 'dotenv/config'
import db from './db/index.js'

await db.execute('ALTER TABLE users ADD COLUMN weight_kg REAL');
await db.execute('ALTER TABLE users ADD COLUMN height_cm REAL');
await db.execute('ALTER TABLE users ADD COLUMN age INTEGER');

console.log('Migration completed');
process.exit(0);