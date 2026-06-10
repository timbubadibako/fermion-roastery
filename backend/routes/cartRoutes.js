import express from 'express';
import { syncCart, getCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/sync', syncCart);
router.get('/', getCart);

export default router;
