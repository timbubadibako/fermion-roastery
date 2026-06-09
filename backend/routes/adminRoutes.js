import express from 'express';
import { getB2bPartners, updatePartnerStatus, getAdminStats } from '../controllers/adminController.js';

const router = express.Router();

// In a real app, these routes should be protected by an isAdmin middleware
router.get('/stats', getAdminStats);
router.get('/partners', getB2bPartners);
router.put('/partners/:id', updatePartnerStatus);

export default router;
