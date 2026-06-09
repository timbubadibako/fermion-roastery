import express from 'express';
import { getB2bPartners, updatePartnerStatus, getOrders, updateOrder } from '../controllers/adminController.js';

const router = express.Router();

// In a real app, these routes should be protected by an isAdmin middleware
// router.get('/stats', getAdminStats); // Temporarily removed from controller in previous step
router.get('/partners', getB2bPartners);
router.put('/partners/:id', updatePartnerStatus);

// Order Management
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrder);

export default router;
