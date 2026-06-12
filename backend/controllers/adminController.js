import { query } from '../lib/db.js';

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

