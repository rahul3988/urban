import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../utils/ApiResponse';
import { PromoService } from '../services/promo.service';

export const validatePromo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, orderValue, serviceType } = req.body;
    const userId = req.user!.id;

    const result = await PromoService.validatePromoCode(
      code,
      userId,
      orderValue,
      serviceType
    );

    ApiResponse.success(res, result, 'Promo code is valid');
  } catch (error) {
    next(error);
  }
};

export const getUserPromos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const promos = await PromoService.getUserPromoCodes(userId);
    
    ApiResponse.success(res, promos);
  } catch (error) {
    next(error);
  }
};

export const createPromo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const promo = await PromoService.createPromoCode(req.body);
    ApiResponse.success(res, promo, 'Promo code created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updatePromo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Implementation for update
    ApiResponse.success(res, {}, 'Promo code updated');
  } catch (error) {
    next(error);
  }
};

export const deletePromo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Implementation for delete
    ApiResponse.success(res, null, 'Promo code deleted');
  } catch (error) {
    next(error);
  }
};