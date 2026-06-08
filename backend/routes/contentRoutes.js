import express from 'express';
import { getSiteConfig } from '../controllers/contentController.js';

const router = express.Router();

router.get('/', getSiteConfig);

export default router;
