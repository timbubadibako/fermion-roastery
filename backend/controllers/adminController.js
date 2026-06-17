import { query } from '../lib/db.js';
import { publishEvent } from '../lib/ably.js';
import { subDays, startOfDay, endOfDay, differenceInDays, format } from 'date-fns';

// 0. Get Admin Stats for Dashboard Overview
export const getAdminStats = async (req, res) => {
  const { startDate, endDate, days } = req.query;
  
  let start, end;
  
  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
  } else {
    const d = parseInt(days) || 30;
    end = new Date();
    start = subDays(end, d);
  }

  // Sanitize to start/end of day
  const finalStart = startOfDay(start).toISOString();
  const finalEnd = endOfDay(end).toISOString();
  const diffDays = differenceInDays(new Date(finalEnd), new Date(finalStart));
  const isMonthly = diffDays > 60;

  try {
    // Total Revenue
    const revenueRes = await query(`
      SELECT COALESCE(SUM(total_amount), 0) as total 
      FROM orders 
      WHERE status != 'CANCELLED' 
      AND created_at BETWEEN $1 AND $2
    `, [finalStart, finalEnd]);
    
    // Volume Sold
    const volumeRes = await query(`
      SELECT COALESCE(SUM(oi.quantity * 0.25), 0) as total_kg 
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'CANCELLED'
      AND o.created_at BETWEEN $1 AND $2
    `, [finalStart, finalEnd]);

    // Global Stats
    const pendingB2BRes = await query("SELECT COUNT(*) as count FROM b2b_partners WHERE status = 'pending'");
    const activePartnersRes = await query("SELECT COUNT(*) as count FROM b2b_partners WHERE status = 'approved'");

    // Revenue Trends
    const trendQuery = isMonthly ? `
      WITH months AS (
        SELECT generate_series(
          DATE_TRUNC('month', $1::timestamp), 
          DATE_TRUNC('month', $2::timestamp), 
          '1 month'::interval
        )::date as month
      )
      SELECT TO_CHAR(ms.month, 'Mon YY') as label, COALESCE(SUM(o.total_amount), 0) as revenue
      FROM months ms
      LEFT JOIN orders o ON DATE_TRUNC('month', o.created_at) = ms.month AND o.status != 'CANCELLED'
      GROUP BY ms.month ORDER BY ms.month ASC
    ` : `
      WITH dates AS (
        SELECT generate_series(
          ($1::timestamp)::date, 
          ($2::timestamp)::date, 
          '1 day'::interval
        )::date as day
      )
      SELECT TO_CHAR(ds.day, 'DD Mon') as label, COALESCE(SUM(o.total_amount), 0) as revenue
      FROM dates ds
      LEFT JOIN orders o ON DATE(o.created_at) = ds.day AND o.status != 'CANCELLED'
      GROUP BY ds.day ORDER BY ds.day ASC
    `;

    const revenueTrendsRes = await query(trendQuery, [finalStart, finalEnd]);

    res.status(200).json({
      revenue: parseFloat(revenueRes.rows[0].total),
      volume: parseFloat(volumeRes.rows[0].total_kg),
      pendingB2B: parseInt(pendingB2BRes.rows[0].count),
      activeSubs: parseInt(activePartnersRes.rows[0].count),
      revenueTrends: revenueTrendsRes.rows.map(r => ({ 
        label: r.label, 
        revenue: parseFloat(r.revenue) 
      })),
      recentOrders: (await query("SELECT id, customer_name, customer_email, total_amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5")).rows
    });
  } catch (error) {
    console.error('❌ Admin Stats Error:', error);
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
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended', 'flagged', 'onboarding', 'awaiting_contract_review'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Build dynamic update
    let updateFields = [];
    let values = [];
    let idx = 1;

    if (status) {
      updateFields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (tier_name !== undefined) {
      updateFields.push(`tier_name = $${idx++}`);
      values.push(tier_name);
    }

    if (updateFields.length === 0) return res.status(400).json({ message: "No fields to update" });

    values.push(id);
    const result = await query(`
      UPDATE b2b_partners 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx} 
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Partner application not found" });
    }

    res.status(200).json({ 
      message: "Data mitra berhasil diperbarui", 
      partner: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating partner status:', error);
    res.status(500).json({ message: "Gagal memperbarui data mitra", error: error.message });
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
  const { status, shipping_awb, shipping_courier, rejection_reason, qcData } = req.body;

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
    if (rejection_reason !== undefined) {
      updateFields.push(`rejection_reason = $${paramCount++}`);
      values.push(rejection_reason);
    }
    if (qcData) {
      if (qcData.sweetness !== undefined) {
        updateFields.push(`qc_sweetness = $${paramCount++}`);
        values.push(qcData.sweetness);
      }
      if (qcData.acidity !== undefined) {
        updateFields.push(`qc_acidity = $${paramCount++}`);
        values.push(qcData.acidity);
      }
      if (qcData.body !== undefined) {
        updateFields.push(`qc_body = $${paramCount++}`);
        values.push(qcData.body);
      }
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

    publishEvent('orders', 'order_updated', { id: id, status: status || result.rows[0].status });

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

