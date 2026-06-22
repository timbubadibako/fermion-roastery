import { supabase } from '../lib/supabase.js';
import { createClient } from '@supabase/supabase-js';

// Helper to get a clean client for auth checks to avoid RLS pollution
const getAuthClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

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
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: finalId,
        email,
        password_hash: password,
        full_name: fullName || email.split('@')[0],
        role,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .select('id, email, full_name, role')
      .single();
    
    if (error) throw error;

    res.status(201).json({ message: "Registration successful", profile: data });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: "Error during registration", error: error.message });
  }
};

export const getProfileByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, phone, address, city, postal_code')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') return res.status(404).json({ message: "Profile not found" });
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 1. Authenticate with a separate client to avoid polluting the service_role client
    const authClient = getAuthClient();
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) {
        return res.status(401).json({ message: "Invalid credentials", error: authError.message });
    }

    const supabaseUser = authData.user;

    // 2. Fetch or Sync local profile using the MAIN service_role client
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id, email, full_name, role,
        b2b_partners (status, tier_name)
      `)
      .eq('id', supabaseUser.id)
      .maybeSingle();

    if (profile && profile.b2b_partners) {
      const partner = Array.isArray(profile.b2b_partners) ? profile.b2b_partners[0] : profile.b2b_partners;
      if (partner) {
        profile.b2b_status = partner.status;
        profile.tier_name = partner.tier_name;
      }
      delete profile.b2b_partners;
    }
    
    if (!profile) {
      // Auto-sync if profile missing locally
      const { data: syncData, error: syncError } = await supabase
        .from('profiles')
        .insert({
          id: supabaseUser.id,
          email,
          full_name: supabaseUser.user_metadata?.full_name || email.split('@')[0],
          role: supabaseUser.user_metadata?.role || 'RETAIL'
        })
        .select('id, email, full_name, role')
        .single();
      
      if (syncError) throw syncError;
      profile = syncData;
    }

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
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .single();

    if (profileError && profileError.code === 'PGRST116') return res.status(404).json({ message: "Profile not found" });
    if (profileError) throw profileError;

    // Update role to B2B if it isn't already
    await supabase
      .from('profiles')
      .update({ role: 'B2B' })
      .eq('id', profileId)
      .neq('role', 'B2B');

    // Create or update B2B Partner Application
    const { data: existingApp, error: appError } = await supabase
      .from('b2b_partners')
      .select('id')
      .eq('profile_id', profileId)
      .maybeSingle();

    if (appError) throw appError;
    
    if (existingApp) {
       await supabase
        .from('b2b_partners')
        .update({
          company_name: cafeName,
          address: cafeAddress,
          estimated_volume_kg: volume,
          status: 'pending'
        })
        .eq('profile_id', profileId);
    } else {
       await supabase
        .from('b2b_partners')
        .insert({
          profile_id: profileId,
          company_name: cafeName,
          address: cafeAddress,
          estimated_volume_kg: volume,
          status: 'pending'
        });
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
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

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
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, email, full_name, role, phone, address, city, postal_code, area_id, district, regency, province, patokan, addresses_json,
        b2b_partners (status, tier_name)
      `)
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return res.status(404).json({ message: "Profile not found" });
    if (error) throw error;

    // Flatten B2B status
    if (data.b2b_partners) {
      const partner = Array.isArray(data.b2b_partners) ? data.b2b_partners[0] : data.b2b_partners;
      if (partner) {
        data.b2b_status = partner.status;
        data.tier_name = partner.tier_name;
      }
    }
    delete data.b2b_partners;

    res.status(200).json(data);
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
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone,
        address: address,
        city: city,
        postal_code: postalCode,
        area_id: areaId,
        district: district,
        regency: regency,
        province: province,
        patokan: patokan,
        addresses_json: addresses || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, email, full_name, role, phone, address, city, postal_code, area_id, district, regency, province, patokan, addresses_json')
      .single();

    if (error && error.code === 'PGRST116') return res.status(404).json({ message: "Profile not found" });
    if (error) throw error;

    res.status(200).json({ message: "Profile updated successfully", profile: data });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

export const claimSilverTier = async (req, res) => {
  const { profileId } = req.body;
  try {
    const { data, error } = await supabase
      .from('b2b_partners')
      .update({ tier_name: 'Silver' })
      .eq('profile_id', profileId)
      .eq('is_silver_eligible', true)
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(400).json({ message: "Not eligible for Silver Tier or profile not found" });
    }
    if (error) throw error;

    res.status(200).json({ message: "Silver Tier claimed successfully", partner: data });
  } catch (error) {
    console.error('Claim Tier Error:', error);
    res.status(500).json({ message: "Failed to claim tier", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { id } = req.user; // from verifyAuth
  const { oldPassword, newPassword } = req.body;

  try {
    // 1. Get user email
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', id)
      .single();

    if (profileError || !profileData) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify old password by trying to log in
    const authClient = getAuthClient();
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: profileData.email,
      password: oldPassword,
    });

    if (authError) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    // 3. Update password in Supabase Auth using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(id, {
      password: newPassword
    });

    if (updateError) {
      return res.status(500).json({ message: "Gagal mengganti password di sistem auth", error: updateError.message });
    }

    // 4. Update password_hash in profiles (if used)
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ password_hash: newPassword })
      .eq('id', id);

    res.status(200).json({ message: "Password berhasil diganti" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan sistem", error: error.message });
  }
};
