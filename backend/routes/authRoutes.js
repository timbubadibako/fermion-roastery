import express from 'express';
import { getProfile, register, login, applyB2B, verifyAdmin, claimSilverTier } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/apply-b2b', applyB2B);
router.post('/claim-silver-tier', claimSilverTier);
router.get('/verify-admin', verifyAdmin);
router.get('/profile', getProfile);

export default router;
