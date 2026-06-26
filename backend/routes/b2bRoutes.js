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

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public / Semi-public routes
router.post('/register', registerB2B);
router.get('/test-contract', testContract);

// 🔒 Gembok Auth
router.use(verifyAuth);

// 🎯 SEKARANG AMAN: Tinggal panggil fungsi dari controller aja, 
// urusan query database b2b_partners udah dihandle di dalam b2bController.js!
router.get('/partner-status', getPartnerStatus);
router.get('/contract', generateContract);
router.post('/upload-contract', upload.single('contract'), uploadContract);

export default router;