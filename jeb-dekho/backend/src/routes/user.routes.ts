import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validateUpdateProfile, validateAddress } from '../utils/validators';
import { validate } from '../middleware/validate';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', validateUpdateProfile(), validate, updateProfile);
router.delete('/profile', deleteProfile);

// Address routes
router.get('/addresses', getAddresses);
router.post('/addresses', validateAddress(), validate, addAddress);
router.put('/addresses/:id', validateAddress(), validate, updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;