import express from 'express';
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
router.post('/', createJournalPost);
router.put('/:id', updateJournalPost);
router.delete('/:id', deleteJournalPost);

export default router;
