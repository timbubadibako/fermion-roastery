import express from 'express';
import { getProfile, register, login, applyB2B } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/apply-b2b', applyB2B);
router.get('/profile', getProfile);

export default router;
