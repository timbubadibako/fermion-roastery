import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixFaq() {
  try {
    console.log('Connected to Supabase via REST API');

    const { data, error } = await supabase
      .from('faqs')
      .update({
        answer_en: 'Fermion Roastery is a micro roastery focused on providing the best specialty coffee beans for your daily brew and cafe, straight from East Cirebon.',
        answer_id: 'Fermion Roastery adalah micro roastery yang berfokus menyajikan biji kopi specialty terbaik untuk rutinitas seduh dan kafe kamu, langsung dari Cirebon Timur.'
      })
      .ilike('question_en', '%What is Fermion Roastery?%')
      .select();

    if (error) {
      throw error;
    }
    
    console.log(`Updated ${data.length} rows successfully.`);
    
  } catch (err) {
    console.error('Error updating faqs', err);
  }
}

fixFaq();
