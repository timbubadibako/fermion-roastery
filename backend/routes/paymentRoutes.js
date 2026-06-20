import express from 'express';
import { createInvoice, handleNotification, createSubscription, createManualInvoice } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/invoice', createInvoice);
router.post('/subscription', createSubscription);
router.post('/manual-invoice', createManualInvoice);
router.post('/webhook', handleNotification);

export default router;

