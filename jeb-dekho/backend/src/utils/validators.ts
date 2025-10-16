import { body, param, query, ValidationChain } from 'express-validator';

export const validateRegister = (): ValidationChain[] => [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('role').isIn(['CUSTOMER', 'VENDOR', 'DELIVERY_PARTNER']),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim()
];

export const validateLogin = (): ValidationChain[] => [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

export const validateOTP = (): ValidationChain[] => [
  body('phone').matches(/^[6-9]\d{9}$/),
  body('otp').isLength({ min: 6, max: 6 })
];

export const validateUpdateProfile = (): ValidationChain[] => [
  body('firstName').optional().notEmpty().trim(),
  body('lastName').optional().notEmpty().trim(),
  body('phone').optional().matches(/^[6-9]\d{9}$/)
];

export const validateAddress = (): ValidationChain[] => [
  body('line1').notEmpty().trim(),
  body('city').notEmpty().trim(),
  body('state').notEmpty().trim(),
  body('pincode').matches(/^[1-9][0-9]{5}$/),
  body('type').isIn(['HOME', 'WORK', 'OTHER'])
];

export const validatePagination = (): ValidationChain[] => [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

export const validateCoordinates = (): ValidationChain[] => [
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 })
];

export const validateOrderCreate = (): ValidationChain[] => [
  body('vendorId').notEmpty(),
  body('items').isArray({ min: 1 }),
  body('items.*.id').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('paymentMethod').isIn(['CASH', 'CARD', 'UPI', 'WALLET'])
];

export const validateRating = (): ValidationChain[] => [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().isString().trim()
];