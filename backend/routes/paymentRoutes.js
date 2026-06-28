import express from 'express';
import { createInvoice, handleNotification, createSubscription, createManualInvoice } from '../controllers/paymentController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';
import { validateInvoicePayload, webhookRateLimiter } from '../lib/security.js';

const router = express.Router();

router.post('/invoice', validateInvoicePayload, createInvoice);
router.post('/b2b-invoice', verifyAuth, validateInvoicePayload, createInvoice);
router.post('/subscription', createSubscription);
router.post('/manual-invoice', verifyAuth, createManualInvoice);
router.post('/webhook', webhookRateLimiter, handleNotification);

export default router;
