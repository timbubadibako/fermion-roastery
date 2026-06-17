import { query } from '../lib/db.js';
import { supabase } from '../lib/supabase.js';

export const register = async (req, res) => {
  const { id: externalId, email, password, fullName, role = 'RETAIL' } = req.body;
  
  try {
    let finalId = externalId;

    // 1. If no external ID provided, try to create in Supabase Auth first
    if (!finalId) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role }
      });

      if (authError) {
        // If user already exists in Supabase, we might just want to sync them
        if (authError.message.includes('already registered')) {
            const { data: existingUser } = await supabase.auth.admin.listUsers();
            const foundUser = existingUser.users.find(u => u.email === email);
            if (foundUser) {
                finalId = foundUser.id;
            } else {
                throw authError;
            }
        } else {
            throw authError;
        }
      } else {
        finalId = authData.user.id;
      }
    }

    // 2. Sync with local profiles table
    const profileResult = await query(
      `INSERT INTO profiles (id, email, password_hash, full_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO UPDATE SET 
         full_name = EXCLUDED.full_name,
         role = EXCLUDED.role,
         updated_at = CURRENT_TIMESTAMP
       RETURNING id, email, full_name, role`,
      [finalId, email, password, fullName || email.split('@')[0], role] 
    );
    
    const profile = profileResult.rows[0];
    res.status(201).json({ message: "Registration successful", profile });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: "Error during registration", error: error.message });
  }
};

export const getProfileByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const result = await query(
      'SELECT id, email, full_name, role, phone, address, city, postal_code FROM profiles WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) {
        return res.status(401).json({ message: "Invalid credentials", error: authError.message });
    }

    const supabaseUser = authData.user;

    // 2. Fetch or Sync local profile
    let result = await query('SELECT id, email, full_name, role FROM profiles WHERE id = $1', [supabaseUser.id]);
    
    if (result.rows.length === 0) {
      // Auto-sync if profile missing locally
      const syncResult = await query(
        `INSERT INTO profiles (id, email, full_name, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, email, full_name, role`,
        [supabaseUser.id, email, supabaseUser.user_metadata?.full_name || email.split('@')[0], supabaseUser.user_metadata?.role || 'RETAIL']
      );
      result = syncResult;
    }

    const profile = result.rows[0];
    res.status(200).json({ 
        message: "Login successful", 
        profile,
        session: authData.session 
    });
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
      'SELECT id, email, full_name, role, phone, address, city, postal_code, area_id, district, regency, province, patokan, addresses_json FROM profiles WHERE id = $1',
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
  const { 
    fullName, phone, address, city, postalCode, 
    areaId, district, regency, province, patokan,
    addresses 
  } = req.body;

  try {
    const result = await query(
      `UPDATE profiles 
       SET full_name = $1, phone = $2, address = $3, city = $4, postal_code = $5, 
           area_id = $6, district = $7, regency = $8, province = $9, patokan = $10,
           addresses_json = $11, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $12 RETURNING id, email, full_name, role, phone, address, city, postal_code, area_id, district, regency, province, patokan, addresses_json`,
      [
        fullName, phone, address, city, postalCode, 
        areaId, district, regency, province, patokan,
        JSON.stringify(addresses || []),
        id
      ]
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
