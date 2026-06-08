import express from 'express';
import { syncUser, getProfile, b2bRegister } from '../controllers/authController.js';

const router = express.Router();

router.post('/sync', syncUser);
router.post('/b2b-register', b2bRegister);
router.get('/profile', getProfile);

export default router;
