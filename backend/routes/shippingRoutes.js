import express from 'express';
import { searchAreas, getRates, getTracking, handleBiteshipWebhook, getBatchLabels } from '../controllers/shippingController.js';
import { validateSearchAreas, validateShippingRates, webhookRateLimiter } from '../lib/security.js';
import { verifyAuth, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/areas', validateSearchAreas, searchAreas);
router.get('/trackings/:id', getTracking);
router.post('/rates', validateShippingRates, getRates);
router.post('/webhook', webhookRateLimiter, handleBiteshipWebhook);
router.post('/batch-labels', verifyAuth, verifyAdmin, getBatchLabels);

export default router;
