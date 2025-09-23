// lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // optionally: ssl: { rejectUnauthorized: false } for some hosts
});

export default pool;
