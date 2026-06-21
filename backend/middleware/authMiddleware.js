import { supabase } from '../lib/supabase.js';

export const verifyAuth = async (req, res, next) => {
  try {
    let token;
    
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } 
    // 2. Check cookies if passed directly
    else if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      }, {});
      // Usually token is not in cookie unless we manually set it, we set 'fermion_profile_id' in UI.
      // But for real auth, we need the JWT token.
    }

    if (!token) {
      // Temporarily allow pass-through if no token but log a warning (until frontend fully passes JWTs)
      console.warn(`[SECURITY WARNING] Missing JWT token on protected route: ${req.method} ${req.url}. Passing through due to migration period.`);
      return next(); 
      // To strictly enforce: return res.status(401).json({ message: "Access denied. No token provided." });
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
