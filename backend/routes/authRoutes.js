import express from 'express';
import { getProfile, updateProfile, register, login, applyB2B, verifyAdmin, claimSilverTier, getProfileByEmail, changePassword } from '../controllers/authController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/apply-b2b', applyB2B);
router.post('/claim-silver-tier', claimSilverTier);
router.post('/change-password', verifyAuth, changePassword);
router.get('/verify-admin', verifyAdmin);
router.get('/profile-by-email', getProfileByEmail);
router.get('/profile/:id', verifyAuth, getProfile);
router.put('/profile/:id', verifyAuth, updateProfile);

export default router;
