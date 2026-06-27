import express from 'express';
import { getMyOrders, getOrderDetail, downloadOrderInvoice } from '../controllers/orderController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-orders', verifyAuth, getMyOrders);
router.get('/:id/invoice', verifyAuth, downloadOrderInvoice);
router.get('/:id', verifyAuth, getOrderDetail);

export default router;
