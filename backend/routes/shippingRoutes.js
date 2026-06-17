import express from 'express';
import { searchAreas, getRates, getTracking, handleBiteshipWebhook, getBatchLabels } from '../controllers/shippingController.js';

const router = express.Router();

router.get('/areas', searchAreas);
router.get('/trackings/:id', getTracking);
router.post('/rates', getRates);
router.post('/webhook', handleBiteshipWebhook);
router.post('/batch-labels', getBatchLabels);

export default router;
