import { Router } from 'express';
import {
  getRestaurants,
  getRestaurantDetails,
  getMenu,
  createOrder,
  getOrder,
  updateOrderStatus,
  getOrderHistory
} from '../controllers/food.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateOrderCreate, validatePagination } from '../utils/validators';
import { validate } from '../middleware/validate';
import { UserRole } from '@jeb-dekho/common';

const router = Router();

// Public routes
router.get('/restaurants', validatePagination(), validate, getRestaurants);
router.get('/restaurants/:id', getRestaurantDetails);
router.get('/restaurants/:id/menu', getMenu);

// Protected routes
router.use(authenticate);
router.post('/orders', validateOrderCreate(), validate, createOrder);
router.get('/orders/:id', getOrder);
router.get('/orders', validatePagination(), validate, getOrderHistory);

// Vendor/Driver routes
router.put(
  '/orders/:id/status',
  authorize(UserRole.VENDOR, UserRole.DELIVERY_PARTNER),
  updateOrderStatus
);

export default router;