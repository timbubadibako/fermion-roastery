import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ CRITICAL: Database connection string (SUPABASE_DB_URL or DATABASE_URL) is missing!');
} else {
  console.log(`📡 Database connection initialized (Mode: ${isProduction ? 'Production' : 'Development'}, SSL: ${isProduction || dbUrl?.includes('supabase.com') ? 'ON' : 'OFF'})`);
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: isProduction || dbUrl?.includes('supabase.com') ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text, params) => pool.query(text, params);
