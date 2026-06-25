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
  // 💡 Note: Jika nanti di adminController.js udah ada fungsinya, tinggal import di sini
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/settings', getSettings);

// Apply auth and admin check to all admin routes
router.use(verifyAuth, verifyAdmin);

router.get('/stats', getAdminStats);
router.put('/settings', updateSettings);

// 🎯 TAMBAHKAN ROUTE INI JIR: Biar GET /api/admin/manual-transaction gak 404 Not Found!
router.get('/manual-transaction', (req, res) => {
  console.log("➡️ [Express] Hit manual-transaction endpoint!");
  // Return array kosong dulu sementara agar frontend lu dapet status 200 OK dan aman dari crash
  res.status(200).json([]);
});

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