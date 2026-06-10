import { query } from '../lib/db.js';

// 1. Get User's Own Orders
export const getMyOrders = async (req, res) => {
  const { profileId } = req.query;

  if (!profileId) {
    return res.status(400).json({ message: "Profile ID is required" });
  }

  try {
    const result = await query(`
      SELECT o.*, 
             COALESCE(
               json_agg(json_build_object(
                 'id', oi.id, 
                 'name', oi.product_name, 
                 'quantity', oi.quantity, 
                 'price', oi.unit_price,
                 'weight', oi.variant_weight,
                 'grind', oi.variant_grind
               )) FILTER (WHERE oi.id IS NOT NULL), '[]'
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.profile_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [profileId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// 2. Get Single Order Detail (for Tracking)
export const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  const { profileId } = req.query;

  try {
    const result = await query(`
      SELECT o.*, 
             COALESCE(
               json_agg(json_build_object(
                 'id', oi.id, 
                 'name', oi.product_name, 
                 'quantity', oi.quantity, 
                 'price', oi.unit_price,
                 'weight', oi.variant_weight,
                 'grind', oi.variant_grind
               )) FILTER (WHERE oi.id IS NOT NULL), '[]'
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1 AND (o.profile_id = $2 OR $2 IS NULL) -- Allow access if profile matches or admin
      GROUP BY o.id
    `, [id, profileId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ message: "Failed to fetch order detail", error: error.message });
  }
};
