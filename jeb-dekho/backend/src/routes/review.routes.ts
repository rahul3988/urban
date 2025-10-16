import { Router } from 'express';
import {
  createReview,
  getReviews,
  updateReview,
  deleteReview
} from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';
import { validateRating, validatePagination } from '../utils/validators';
import { validate } from '../middleware/validate';

const router = Router();

// Public routes
router.get('/vendor/:vendorId', validatePagination(), validate, getReviews);

// Protected routes
router.use(authenticate);
router.post('/', validateRating(), validate, createReview);
router.put('/:id', validateRating(), validate, updateReview);
router.delete('/:id', deleteReview);

export default router;