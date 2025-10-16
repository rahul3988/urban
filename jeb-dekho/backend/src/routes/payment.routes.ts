import { Router } from 'express';
import {
  getWallet,
  addMoney,
  getTransactionHistory,
  initiatePayment,
  confirmPayment
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { validatePagination } from '../utils/validators';
import { validate } from '../middleware/validate';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/wallet', getWallet);
router.post('/wallet/add', addMoney);
router.get('/transactions', validatePagination(), validate, getTransactionHistory);
router.post('/initiate', initiatePayment);
router.post('/confirm', confirmPayment);

export default router;