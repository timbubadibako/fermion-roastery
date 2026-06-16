import { query } from './lib/db.js';
import fs from 'fs';

const migrate = async () => {
  try {
    const schema = fs.readFileSync('schema.sql', 'utf8');
    console.log("Applying schema...");
    await query(schema);
    console.log("Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};
migrate();
