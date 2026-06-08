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
