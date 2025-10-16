import { Router } from 'express';
import {
  getStores,
  getProducts,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  checkout
} from '../controllers/mart.controller';
import { authenticate } from '../middleware/auth';
import { validatePagination } from '../utils/validators';
import { validate } from '../middleware/validate';

const router = Router();

// Public routes
router.get('/stores', validatePagination(), validate, getStores);
router.get('/stores/:id/products', validatePagination(), validate, getProducts);

// Protected routes
router.use(authenticate);
router.post('/cart', addToCart);
router.get('/cart', getCart);
router.put('/cart/:itemId', updateCartItem);
router.delete('/cart/:itemId', removeFromCart);
router.post('/checkout', checkout);

export default router;