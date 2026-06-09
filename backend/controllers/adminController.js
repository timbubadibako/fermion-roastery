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

// 3. Get Admin Analytics Stats
export const getAdminStats = async (req, res) => {
  try {
    // In a real app, we would query the database for real-time aggregation
    // SELECT SUM(total_price) FROM orders ... etc.
    
    // For now, we return comprehensive mock data matching the design spec
    const stats = {
      revenue: 45250000,
      volume: 124,
      pendingB2B: 3,
      activeSubs: 18,
      revenueTrends: [
        { date: '01 Jun', amount: 1200000 },
        { date: '02 Jun', amount: 2100000 },
        { date: '03 Jun', amount: 1800000 },
        { date: '04 Jun', amount: 3400000 },
        { date: '05 Jun', amount: 2900000 },
        { date: '06 Jun', amount: 4100000 },
        { date: '07 Jun', amount: 3800000 },
      ],
      volumeTrends: [
        { name: 'Espresso', kg: 45 },
        { name: 'Filter', kg: 62 },
        { name: 'Micro-lots', kg: 17 },
      ]
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};
