import { query } from '../lib/db.js';

export const b2bRegister = async (req, res) => {
  const { email, password, cafeName, cafeAddress, volume } = req.body;
  
  try {
    // 1. Create Profile
    const profileResult = await query(
      'INSERT INTO profiles (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, password, cafeName, 'B2B'] // password should be hashed in production
    );
    
    const profileId = profileResult.rows[0].id;
    
    // 2. Create B2B Partner Application
    await query(
      'INSERT INTO b2b_partners (profile_id, company_name, address, estimated_volume_kg, status) VALUES ($1, $2, $3, $4, $5)',
      [profileId, cafeName, cafeAddress, volume, 'pending']
    );
    
    res.status(201).json({ 
      message: "B2B Registration successful", 
      profileId 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Error during B2B registration", error: error.message });
  }
};

export const syncUser = (req, res) => {
  // Logic to sync Clerk/Kinde user with our local logic
  res.status(200).json({ message: "User synced successfully (Mock)" });
};

export const getProfile = (req, res) => {
  res.status(200).json({ 
    id: "usr_123", 
    name: "Fermion Partner", 
    role: "B2B_PARTNER" 
  });
};
