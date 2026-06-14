import { query } from '../lib/db.js';

export const register = async (req, res) => {
  const { email, password, fullName, role = 'RETAIL' } = req.body;
  
  try {
    const profileResult = await query(
      'INSERT INTO profiles (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [email, password, fullName || email.split('@')[0], role] 
    );
    
    const profile = profileResult.rows[0];
    res.status(201).json({ message: "Registration successful", profile });
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.code === '23505') { 
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Error during registration", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await query('SELECT id, email, full_name, role, password_hash FROM profiles WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const profile = result.rows[0];
    
    // In production, use bcrypt.compare here
    if (profile.password_hash !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Remove password hash from response
    delete profile.password_hash;
    
    res.status(200).json({ message: "Login successful", profile });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};

export const applyB2B = async (req, res) => {
  const { profileId, cafeName, cafeAddress, volume } = req.body;
  
  try {
    // Check if profile exists
    const profileRes = await query('SELECT id FROM profiles WHERE id = $1', [profileId]);
    if (profileRes.rows.length === 0) {
        return res.status(404).json({ message: "Profile not found" });
    }

    // Update role to B2B if it isn't already
    await query("UPDATE profiles SET role = 'B2B' WHERE id = $1 AND role != 'B2B'", [profileId]);

    // Create or update B2B Partner Application
    const existingApp = await query('SELECT id FROM b2b_partners WHERE profile_id = $1', [profileId]);
    
    if (existingApp.rows.length > 0) {
       await query(
        'UPDATE b2b_partners SET company_name = $1, address = $2, estimated_volume_kg = $3, status = $4 WHERE profile_id = $5',
        [cafeName, cafeAddress, volume, 'pending', profileId]
       );
    } else {
       await query(
        'INSERT INTO b2b_partners (profile_id, company_name, address, estimated_volume_kg, status) VALUES ($1, $2, $3, $4, $5)',
        [profileId, cafeName, cafeAddress, volume, 'pending']
      );
    }
    
    res.status(201).json({ message: "B2B Application submitted successfully" });
  } catch (error) {
    console.error('B2B Application Error:', error);
    res.status(500).json({ message: "Error submitting application", error: error.message });
  }
};

export const verifyAdmin = async (req, res) => {
  const { id } = req.query;
  
  if (!id) return res.status(400).json({ isAdmin: false, message: "Profile ID required" });

  // Basic UUID format check to avoid Postgres errors
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(200).json({ isAdmin: false, message: "Invalid ID format" });
  }

  try {
    const result = await query('SELECT role FROM profiles WHERE id = $1', [id]);
    const profile = result.rows[0];

    if (profile && profile.role === 'ADMIN') {
      return res.status(200).json({ isAdmin: true });
    }

    res.status(200).json({ isAdmin: false });
  } catch (error) {
    console.error('Verify Admin Error:', error);
    res.status(200).json({ isAdmin: false, error: "Database error" }); // Return false instead of 500 for middleware
  }
};

export const getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      'SELECT id, email, full_name, role, phone, address, city, postal_code FROM profiles WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, address, city, postalCode } = req.body;

  try {
    const result = await query(
      `UPDATE profiles 
       SET full_name = $1, phone = $2, address = $3, city = $4, postal_code = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 RETURNING id, email, full_name, role, phone, address, city, postal_code`,
      [fullName, phone, address, city, postalCode, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ message: "Profile updated successfully", profile: result.rows[0] });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

export const claimSilverTier = async (req, res) => {
  const { profileId } = req.body;
  try {
    const result = await query(
      "UPDATE b2b_partners SET tier_name = 'Silver' WHERE profile_id = $1 AND is_silver_eligible = true RETURNING *",
      [profileId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Not eligible for Silver Tier or profile not found" });
    }

    res.status(200).json({ message: "Silver Tier claimed successfully", partner: result.rows[0] });
  } catch (error) {
    console.error('Claim Tier Error:', error);
    res.status(500).json({ message: "Failed to claim tier", error: error.message });
  }
};
