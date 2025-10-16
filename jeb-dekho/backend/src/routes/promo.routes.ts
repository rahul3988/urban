import { Router } from 'express';
import {
  validatePromo,
  getUserPromos,
  createPromo,
  updatePromo,
  deletePromo
} from '../controllers/promo.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@jeb-dekho/common';

const router = Router();

// Customer routes
router.use(authenticate);
router.post('/validate', validatePromo);
router.get('/my-promos', getUserPromos);

// Admin routes
router.post(
  '/',
  authorize(UserRole.ADMIN),
  createPromo
);
router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  updatePromo
);
router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  deletePromo
);

export default router;