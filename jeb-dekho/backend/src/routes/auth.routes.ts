import { Router } from 'express';
import { 
  register, 
  login, 
  sendOTP, 
  verifyOTP,
  refreshToken 
} from '../controllers/auth.controller';
import { 
  validateRegister, 
  validateLogin, 
  validateOTP 
} from '../utils/validators';
import { validate } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// Authentication routes
router.post('/register', validateRegister(), validate, register);
router.post('/login', validateLogin(), validate, login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', validateOTP(), validate, verifyOTP);
router.post('/refresh-token', refreshToken);

export default router;