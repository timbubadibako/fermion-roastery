import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

// Frontend CUKUP pakai Url dan Anon Key saja!
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, // Pastikan ini true agar token disimpan di localStorage browser lu
        detectSessionInUrl: true
    }
});