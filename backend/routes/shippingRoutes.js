import express from 'express';
import { searchAreas, getRates, getTracking, handleBiteshipWebhook } from '../controllers/shippingController.js';

const router = express.Router();

router.get('/areas', searchAreas);
router.get('/trackings/:id', getTracking);
router.post('/rates', getRates);
router.post('/webhook', handleBiteshipWebhook);

export default router;
