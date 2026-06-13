import express from 'express';
import { 
  registerB2B, 
  generateContract, 
  uploadContract 
} from '../controllers/b2bController.js';

const router = express.Router();

router.post('/register', registerB2B);
router.get('/contract', generateContract);
router.post('/upload-contract', uploadContract);

export default router;
