import { query } from '../lib/db.js';

// 0. Get Admin Stats for Dashboard Overview
export const getAdminStats = async (req, res) => {
  try {
    // Total Revenue
    const revenueRes = await query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'CANCELLED'");
    
    // Volume Sold (assuming 250g per unit if not specified, but let's just sum items quantity for now or use a multiplier)
    const volumeRes = await query(`
      SELECT COALESCE(SUM(oi.quantity * 0.25), 0) as total_kg 
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'CANCELLED'
    `);

    // Pending B2B Partners
    const pendingB2BRes = await query("SELECT COUNT(*) as count FROM b2b_partners WHERE status = 'pending'");

    // Active Subscriptions (mocked for now as we don't have a subs table yet, but let's count PAID orders as a proxy or just 0)
    const activeSubsRes = await query("SELECT COUNT(*) as count FROM profiles WHERE role = 'B2B'");

    // Volume Mix (Top Products)
    const volumeMixRes = await query(`
      SELECT product_name as name, SUM(quantity * 0.25) as kg
      FROM order_items
      GROUP BY product_name
      ORDER BY kg DESC
      LIMIT 5
    `);

    // Revenue Trends (Last 7 days)
    const revenueTrendsRes = await query(`
      SELECT TO_CHAR(created_at, 'DD Mon') as name, SUM(total_amount) as value
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND status != 'CANCELLED'
      GROUP BY TO_CHAR(created_at, 'DD Mon'), DATE_TRUNC('day', created_at)
      ORDER BY DATE_TRUNC('day', created_at) ASC
    `);

    res.status(200).json({
      revenue: parseFloat(revenueRes.rows[0].total),
      volume: parseFloat(volumeRes.rows[0].total_kg),
      pendingB2B: parseInt(pendingB2BRes.rows[0].count),
      activeSubs: parseInt(activeSubsRes.rows[0].count),
      volumeTrends: volumeMixRes.rows.map(r => ({ name: r.name, kg: parseFloat(r.kg) })),
      revenueTrends: revenueTrendsRes.rows.map(r => ({ name: r.name, value: parseFloat(r.value) })),
      recentOrders: (await query("SELECT id, customer_name, customer_email, total_amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5")).rows
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

// 1. Get all B2B Partners (Pending, Approved, Rejected)
export const getB2bPartners = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        b.id, 
        b.company_name, 
        b.address, 
        b.estimated_volume_kg, 
        b.status, 
        b.tier_name, 
        b.created_at,
        p.email,
        p.full_name
      FROM b2b_partners b
      JOIN profiles p ON b.profile_id = p.id
      ORDER BY b.created_at DESC
    `);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching B2B partners:', error);
    res.status(500).json({ message: "Failed to fetch partners", error: error.message });
  }
};

// 2. Update Partner Status & Assign Tier
export const updatePartnerStatus = async (req, res) => {
  const { id } = req.params;
  const { status, tier_name } = req.body;

  try {
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateQuery = `
      UPDATE b2b_partners 
      SET status = $1, tier_name = $2 
      WHERE id = $3 
      RETURNING *
    `;
    
    const result = await query(updateQuery, [status, tier_name || null, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Partner application not found" });
    }

    res.status(200).json({ 
      message: `Partner successfully ${status}`, 
      partner: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating partner status:', error);
    res.status(500).json({ message: "Failed to update partner", error: error.message });
  }
};

// Delete Partner
export const deletePartner = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("DELETE FROM b2b_partners WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Partner application not found" });
    }
    res.status(200).json({ message: "Application successfully cancelled", id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ message: "Failed to cancel application", error: error.message });
  }
};

// 3. Create B2B Contract
export const createContract = async (req, res) => {
  const { profile_id, end_date, contract_type = 'Bronze' } = req.body;
  try {
    // Determine sequence
    const seqRes = await query('SELECT MAX(contract_sequence) as max_seq FROM b2b_contracts WHERE profile_id = $1', [profile_id]);
    const nextSeq = (seqRes.rows[0].max_seq || 0) + 1;

    // Insert contract
    const result = await query(
      `INSERT INTO b2b_contracts (profile_id, end_date, contract_sequence, contract_type) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [profile_id, end_date, nextSeq, contract_type]
    );

    // Update partner status and logo logic can be added later
    res.status(201).json({ message: "Contract created successfully", contract: result.rows[0] });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ message: "Failed to create contract", error: error.message });
  }
};

// 3.5 Get Maintenance Schedule
export const getMaintenanceSchedule = async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, p.company_name, p.address 
      FROM b2b_contracts c
      JOIN b2b_partners p ON c.profile_id = p.profile_id
      WHERE c.contract_sequence >= 2 AND c.status = 'active'
      ORDER BY c.end_date ASC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching maintenance schedule:', error);
    res.status(500).json({ message: "Failed to fetch maintenance schedule", error: error.message });
  }
};

// 3.6 Get Churn Alerts
export const getChurnAlerts = async (req, res) => {
  try {
    const result = await query(`
      SELECT p.company_name, p.profile_id, MAX(o.created_at) as last_order_date
      FROM b2b_partners p
      LEFT JOIN orders o ON p.profile_id = o.profile_id
      WHERE p.status = 'approved'
      GROUP BY p.company_name, p.profile_id
      HAVING CURRENT_DATE - MAX(o.created_at)::date > 45 OR MAX(o.created_at) IS NULL
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching churn alerts:', error);
    res.status(500).json({ message: "Failed to fetch churn alerts", error: error.message });
  }
};

// 4. Get All Orders
export const getOrders = async (req, res) => {
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
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// 5. Update Order Status (Roasting/Shipping)
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, shipping_awb, shipping_courier } = req.body;

  try {
    const validStatuses = ['UNPAID', 'PAID', 'ROASTING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Build dynamic update query based on provided fields
    let updateFields = [];
    let values = [];
    let paramCount = 1;

    if (status) {
      updateFields.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (shipping_awb !== undefined) {
      updateFields.push(`shipping_awb = $${paramCount++}`);
      values.push(shipping_awb);
    }
    if (shipping_courier !== undefined) {
      updateFields.push(`shipping_courier = $${paramCount++}`);
      values.push(shipping_courier);
    }

    if (updateFields.length === 0) return res.status(400).json({ message: "No fields to update" });

    values.push(id); // for the WHERE clause
    const updateQuery = `
      UPDATE orders 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING *
    `;
    
    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", order: result.rows[0] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};

// 6. Get Site Settings
export const getSettings = async (req, res) => {
  try {
    const result = await query("SELECT * FROM site_settings");
    const settings = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error: error.message });
  }
};

// 7. Update Site Settings
export const updateSettings = async (req, res) => {
  const settings = req.body; // Object with key-value pairs
  try {
    await query('BEGIN');
    for (const [key, value] of Object.entries(settings)) {
      await query(
        "INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP",
        [key, value]
      );
    }
    await query('COMMIT');
    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    await query('ROLLBACK');
    res.status(500).json({ message: "Error updating settings", error: error.message });
  }
};

// 9. Manual Offline Transaction Ledger
export const createManualTransaction = async (req, res) => {
  const { partnerId, productId, weightKg, totalPaid, transactionDate } = req.body;

  try {
    await query('BEGIN');

    // 1. Create the order
    const orderRes = await query(
      `INSERT INTO orders (profile_id, total_amount, status, order_type) 
       VALUES ($1, $2, 'PAID', 'manual_offline') RETURNING id`,
      [partnerId, totalPaid]
    );
    const orderId = orderRes.rows[0].id;

    // 2. Create the order item
    await query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
       VALUES ($1, $2, $3, $4)`,
      [orderId, productId, parseFloat(weightKg) * 4, (parseFloat(totalPaid) / (parseFloat(weightKg) * 4))] // Storing in 250g units
    );

    // 3. Deduct Stock
    await query(
      `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
      [parseFloat(weightKg) * 4, productId]
    );

    await query('COMMIT');
    res.status(201).json({ message: "Manual transaction recorded successfully", orderId });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Manual Transaction Error:', error);
    res.status(500).json({ message: "Failed to record manual transaction", error: error.message });
  }
};

