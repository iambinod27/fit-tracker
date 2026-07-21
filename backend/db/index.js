import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
const statements = schema.split(';').map((s) => s.trim()).filter(Boolean);
for (const stmt of statements) {
  await db.execute(stmt);
}

export default db;