import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import transportRoutes from './transport.routes';
import foodRoutes from './food.routes';
import martRoutes from './mart.routes';
import paymentRoutes from './payment.routes';
import reviewRoutes from './review.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import vendorRoutes from './vendor.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transport', transportRoutes);
router.use('/food', foodRoutes);
router.use('/mart', martRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/vendor', vendorRoutes);

export default router;