import fs from 'fs';
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:iy0HtQOLJ6kyYAZ8@db.clxijsaeiemwywgkjqqd.supabase.co:5432/postgres',
});

async function run() {
  try {
    await client.connect();
    const sql = fs.readFileSync('seed_journal_new.sql', 'utf8');
    await client.query(sql);
    console.log('Seeded successfully!');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await client.end();
  }
}

run();
