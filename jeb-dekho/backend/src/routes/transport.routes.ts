import { Router } from 'express';
import {
  getEstimate,
  createBooking,
  getBooking,
  cancelBooking,
  trackBooking,
  getNearbyDrivers
} from '../controllers/transport.controller';
import { authenticate } from '../middleware/auth';
import { validateCoordinates } from '../utils/validators';
import { validate } from '../middleware/validate';
import { UserRole } from '@jeb-dekho/common';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Transport routes
router.post('/estimate', validateCoordinates(), validate, getEstimate);
router.post('/book', createBooking);
router.get('/bookings/:id', getBooking);
router.put('/bookings/:id/cancel', cancelBooking);
router.get('/bookings/:id/track', trackBooking);
router.get('/drivers/nearby', validateCoordinates(), validate, getNearbyDrivers);

export default router;