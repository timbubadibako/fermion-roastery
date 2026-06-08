import express from 'express';
import { createTransaction, handleNotification } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/checkout', createTransaction);
router.post('/webhook', handleNotification);

export default router;
