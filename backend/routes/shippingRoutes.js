import express from 'express';
import { searchAreas, getRates, handleBiteshipWebhook } from '../controllers/shippingController.js';

const router = express.Router();

router.get('/areas', searchAreas);
router.post('/rates', getRates);
router.post('/webhook', handleBiteshipWebhook);

export default router;
