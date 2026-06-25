import express from 'express';
import { verifyAuth, verifyAdmin } from '../middleware/authMiddleware.js';
import { 
  getJournalPosts, 
  getJournalPostById,
  createJournalPost, 
  updateJournalPost, 
  deleteJournalPost 
} from '../controllers/journalController.js';

const router = express.Router();

router.get('/', getJournalPosts);
router.get('/:id', getJournalPostById);
router.post('/', verifyAuth, verifyAdmin, createJournalPost);
router.put('/:id', verifyAuth, verifyAdmin, updateJournalPost);
router.delete('/:id', verifyAuth, verifyAdmin, deleteJournalPost);

export default router;
