import { Router } from 'express';
import {
  getDashboard,
  getVendorOrders,
  updateMenuItem,
  updateProduct,
  toggleAvailability
} from '../controllers/vendor.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validatePagination } from '../utils/validators';
import { validate } from '../middleware/validate';
import { UserRole } from '@jeb-dekho/common';

const router = Router();

// All routes require vendor authentication
router.use(authenticate);
router.use(authorize(UserRole.VENDOR));

router.get('/dashboard', getDashboard);
router.get('/orders', validatePagination(), validate, getVendorOrders);
router.put('/menu/:id', updateMenuItem);
router.put('/products/:id', updateProduct);
router.put('/availability', toggleAvailability);

export default router;