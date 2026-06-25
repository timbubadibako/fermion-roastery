import express from 'express';
import { verifyAuth, verifyAdmin } from '../middleware/authMiddleware.js';
import { 
  getAdminStats, 
  getB2bPartners, 
  updatePartnerStatus, 
  deletePartner,
  getOrders, 
  updateOrder, 
  createContract, 
  getMaintenanceSchedule, 
  getChurnAlerts,
  getSettings,
  updateSettings
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/settings', getSettings);

// Apply auth and admin check to all admin routes
router.use(verifyAuth, verifyAdmin);

router.get('/stats', getAdminStats);
router.put('/settings', updateSettings);

// In a real app, these routes should be protected by an isAdmin middleware
router.get('/partners', getB2bPartners);
router.put('/partners/:id', updatePartnerStatus);
router.delete('/partners/:id', deletePartner);
router.post('/contracts', createContract);
router.get('/maintenance', getMaintenanceSchedule);
router.get('/churn', getChurnAlerts);

// Order Management
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrder);

export default router;
