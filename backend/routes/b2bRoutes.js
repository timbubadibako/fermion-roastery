import express from 'express';
import multer from 'multer';
import { 
  registerB2B, 
  generateContract, 
  uploadContract,
  testContract
} from '../controllers/b2bController.js';

const router = express.Router();

// Configure multer for memory storage (no saving to disk, directly to Supabase)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.post('/register', registerB2B);
router.get('/contract', generateContract);
router.post('/upload-contract', uploadContract);
router.get('/test-contract', testContract);

export default router;
