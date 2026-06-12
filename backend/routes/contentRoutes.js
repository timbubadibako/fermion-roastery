import express from 'express';
import { getFaqs, createInquiry, getInquiries, createFaq, updateFaq, deleteFaq } from '../controllers/contentController.js';
import { contactRateLimiter, validateInquiry } from '../lib/security.js';

const router = express.Router();

router.get('/faqs', getFaqs);
router.post('/faqs', createFaq);
router.put('/faqs/:id', updateFaq);
router.delete('/faqs/:id', deleteFaq);

router.post('/contact', validateInquiry, contactRateLimiter, createInquiry);

// Admin route (Should be protected by admin middleware in Task 3/4)
router.get('/inquiries', getInquiries);

export default router;
