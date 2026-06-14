import { query } from '../lib/db.js';

// 1. Sync / Save Cart
export const syncCart = async (req, res) => {
  const { profileId, items } = req.body;

  if (!profileId) return res.status(400).json({ message: "Profile ID required" });

  try {
    await query('BEGIN');
    
    // Clear existing cart for this user
    await query('DELETE FROM cart_items WHERE profile_id = $1', [profileId]);

    // Insert current items
    for (const item of items) {
      await query(
        `INSERT INTO cart_items (profile_id, product_id, variant_weight, variant_grind, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [profileId, item.id, item.weight, item.grind, item.quantity]
      );
    }

    await query('COMMIT');
    res.status(200).json({ message: "Cart synced successfully" });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Sync Cart Error:', error);
    res.status(500).json({ message: "Failed to sync cart" });
  }
};

// 2. Load Cart
export const getCart = async (req, res) => {
  const { profileId } = req.query;

  if (!profileId) return res.status(400).json({ message: "Profile ID required" });

  try {
    const result = await query(`
      SELECT ci.product_id as id, p.name, p.price_retail as price, ci.variant_weight as weight, 
             ci.variant_grind as grind, ci.quantity, p.image_url as image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.profile_id = $1
    `, [profileId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};
