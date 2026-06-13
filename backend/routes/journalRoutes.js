import express from 'express';
import { 
  getJournalPosts, 
  createJournalPost, 
  updateJournalPost, 
  deleteJournalPost 
} from '../controllers/journalController.js';

const router = express.Router();

router.get('/', getJournalPosts);
router.post('/', createJournalPost);
router.put('/:id', updateJournalPost);
router.delete('/:id', deleteJournalPost);

export default router;
