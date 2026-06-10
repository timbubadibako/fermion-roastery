import express from 'express';
import { getAblyToken } from '../controllers/chatController.js';

const router = express.Router();

router.get('/auth', getAblyToken);

export default router;
