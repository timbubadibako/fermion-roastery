import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://clxijsaeiemwywgkjqqd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseGlqc2FlaWVtd3l3Z2tqcXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTUyMDQsImV4cCI6MjA5NzE5MTIwNH0.vnZeW9M3keMnCp5jLPWPU-dQTvODB9-vqrEcNS9OSJc';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        detectSessionInUrl: true
    }
});