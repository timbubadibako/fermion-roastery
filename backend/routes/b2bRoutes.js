import express from 'express';
import multer from 'multer';
import { verifyAuth } from '../middleware/authMiddleware.js';
import {
  registerB2B,
  generateContract,
  uploadContract,
  testContract,
  getPartnerStatus // 🎯 Pastikan ini terimport dari controller
} from '../controllers/b2bController.js';
import { b2bRateLimiter, validateB2BRegistration } from '../lib/security.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public / Semi-public routes
router.post('/register', b2bRateLimiter, validateB2BRegistration, registerB2B);
router.get('/test-contract', testContract);
router.get('/contract', generateContract);

// 🔒 Gembok Auth
router.use(verifyAuth);

router.get('/partner-status', getPartnerStatus);
router.post('/upload-contract', upload.single('contract'), uploadContract);

export default router;
