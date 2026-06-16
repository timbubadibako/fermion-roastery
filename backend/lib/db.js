import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Use connection pooling with ssl for Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Adjust based on Vercel/Supabase plan limits
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text, params) => pool.query(text, params);
