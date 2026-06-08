import express from 'express';
import { getB2bPartners, updatePartnerStatus } from '../controllers/adminController.js';

const router = express.Router();

// In a real app, these routes should be protected by an isAdmin middleware
router.get('/partners', getB2bPartners);
router.put('/partners/:id', updatePartnerStatus);

export default router;
