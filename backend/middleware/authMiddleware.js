import { supabase } from '../lib/supabase.js';

export const verifyAuth = async (req, res, next) => {
  try {
    let token;
    
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } 

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error during authentication.", error: error.message });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated." });
    }

    // Fetch the user's profile to check their role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile || profile.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Requires admin privileges." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error during role verification.", error: error.message });
  }
};
