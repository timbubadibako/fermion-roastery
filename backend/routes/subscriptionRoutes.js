import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

router.get('/plans', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/active/:profileId', async (req, res) => {
  const { profileId } = req.params;
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('profile_id', profileId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    // No active subscription is a normal state, not an error
    res.json(data || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cancel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    res.json({ message: "Subscription cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
