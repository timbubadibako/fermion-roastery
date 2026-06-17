import { supabase } from './supabase.js';

/**
 * Middleware to verify Supabase Auth Token (JWT)
 * Expects header: Authorization: Bearer <token>
 */
export const authenticateSupabase = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid or expired token", error: error?.message });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.status(500).json({ message: "Authentication internal error" });
  }
};
