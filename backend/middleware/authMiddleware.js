import { supabase } from '../lib/supabase.js';
import { logError } from '../lib/logger.js';
import { sanitizeError } from '../lib/security.js';

export const verifyAuth = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    req.user = user;
    next();
  } catch (error) {
    logError('auth.verify.failed', error);
    res.status(500).json(sanitizeError(error, "Internal server error during authentication."));
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

    if (error || !profile || profile.role !== 'ADMIN') {
      return res.status(403).json({ message: "Forbidden: Requires admin privileges." });
    }

    next();
  } catch (error) {
    logError('auth.verify_admin.failed', error, { userId: req.user?.id });
    res.status(500).json(sanitizeError(error, "Internal server error during role verification."));
  }
};
