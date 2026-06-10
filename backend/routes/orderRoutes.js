import express from 'express';
import { getMyOrders, getOrderDetail } from '../controllers/orderController.js';

const router = express.Router();

router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderDetail);

export default router;
