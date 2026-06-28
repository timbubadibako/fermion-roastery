import express from 'express';
import { getProfile, updateProfile, register, login, applyB2B, verifyAdmin, claimSilverTier, getProfileByEmail, changePassword } from '../controllers/authController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';
import { authRateLimiter, b2bRateLimiter, validateLogin, validateRegister } from '../lib/security.js';

const router = express.Router();

router.post('/register', authRateLimiter, validateRegister, register);
router.post('/login', authRateLimiter, validateLogin, login);
router.post('/apply-b2b', b2bRateLimiter, applyB2B);
router.post('/claim-silver-tier', claimSilverTier);
router.post('/change-password', verifyAuth, changePassword);
router.get('/verify-admin', verifyAdmin);
router.get('/profile-by-email', getProfileByEmail);
router.get('/profile/:id', verifyAuth, getProfile);
router.put('/profile/:id', verifyAuth, updateProfile);

export default router;
