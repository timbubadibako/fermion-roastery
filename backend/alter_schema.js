import { supabase } from './lib/supabase.js';

const alter = async () => {
  try {
    const { data, error } = await supabase.rpc('alter_products_table');
    if (error) {
       console.log("RPC failed, trying raw SQL if possible...");
       // Supabase JS doesn't support raw SQL directly unless it's via RPC
       throw error;
    }
    console.log("Schema altered successfully!");
  } catch (err) {
    console.error("Alter failed:", err);
  }
};
alter();
