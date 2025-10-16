import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getOrders,
  getRevenue
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validatePagination } from '../utils/validators';
import { validate } from '../middleware/validate';
import { UserRole } from '@jeb-dekho/common';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.get('/dashboard', getDashboardStats);
router.get('/users', validatePagination(), validate, getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/orders', validatePagination(), validate, getOrders);
router.get('/revenue', getRevenue);

export default router;