import express from 'express';
import { getSiteConfig, getLatestBatches } from '../controllers/contentController.js';

const router = express.Router();

router.get('/config', getSiteConfig);
router.get('/batches', getLatestBatches);

export default router;
