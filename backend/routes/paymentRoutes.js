import express from 'express';
import { createInvoice, handleNotification, createSubscription, createManualInvoice } from '../controllers/paymentController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/invoice', createInvoice);
router.post('/b2b-invoice', verifyAuth, createInvoice);
router.post('/subscription', createSubscription);
router.post('/manual-invoice', verifyAuth, createManualInvoice);
router.post('/webhook', handleNotification);

export default router;
