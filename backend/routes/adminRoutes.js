import express from 'express';
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
  updateSettings,
  createManualTransaction
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getAdminStats);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/manual-transaction', createManualTransaction);

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
