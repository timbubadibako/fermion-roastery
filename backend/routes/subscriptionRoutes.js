import express from 'express';
import { query } from '../lib/db.js';

const router = express.Router();

router.get('/plans', async (req, res) => {
  try {
    const result = await query('SELECT * FROM subscription_plans WHERE is_active = true ORDER BY price ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/active/:profileId', async (req, res) => {
  const { profileId } = req.params;
  try {
    const result = await query('SELECT * FROM subscriptions WHERE profile_id = $1 AND status = $2 LIMIT 1', [profileId, 'active']);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No active subscription found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cancel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['cancelled', id]);
    res.json({ message: "Subscription cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
