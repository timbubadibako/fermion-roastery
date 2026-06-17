import express from 'express';
import { getProfile, updateProfile, register, login, applyB2B, verifyAdmin, claimSilverTier, getProfileByEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/apply-b2b', applyB2B);
router.post('/claim-silver-tier', claimSilverTier);
router.get('/verify-admin', verifyAdmin);
router.get('/profile-by-email', getProfileByEmail);
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);

export default router;
