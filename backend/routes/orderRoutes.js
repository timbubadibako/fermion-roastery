import express from 'express';
import { getMyOrders, getOrderDetail, downloadOrderInvoice, getPublicOrderTracking, downloadPublicOrderInvoice } from '../controllers/orderController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public/:token', getPublicOrderTracking);
router.get('/public/:token/invoice', downloadPublicOrderInvoice);
router.get('/my-orders', verifyAuth, getMyOrders);
router.get('/:id/invoice', verifyAuth, downloadOrderInvoice);
router.get('/:id', verifyAuth, getOrderDetail);

export default router;
