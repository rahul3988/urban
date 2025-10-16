import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { WalletService } from '../services/wallet.service';

const db = MockDatabase.getInstance();

export const getWallet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const wallet = await WalletService.getOrCreateWallet(userId);
    const stats = await WalletService.getWalletStats(userId);

    ApiResponse.success(res, {
      ...wallet,
      stats
    });
  } catch (error) {
    next(error);
  }
};

export const addMoney = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, method } = req.body;
    const userId = req.user!.id;

    const result = await WalletService.addMoney(userId, amount, method);

    ApiResponse.success(res, result, 'Money added successfully');
  } catch (error) {
    next(error);
  }
};

export const getTransactionHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user!.id;

    const offset = (Number(page) - 1) * Number(limit);
    const history = await WalletService.getTransactionHistory(
      userId, 
      Number(limit), 
      offset
    );

    ApiResponse.success(res, history);
  } catch (error) {
    next(error);
  }
};

export const initiatePayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, amount, method } = req.body;

    // Mock payment initiation
    const paymentId = `pay_${Date.now()}`;
    
    ApiResponse.success(res, {
      paymentId,
      amount,
      currency: 'INR',
      status: 'PENDING',
      gatewayUrl: `https://payment-gateway.com/pay/${paymentId}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    }, 'Payment initiated');
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId, transactionId } = req.body;

    // Mock payment confirmation
    const transaction = {
      id: transactionId,
      paymentId,
      status: 'SUCCESS',
      confirmedAt: new Date()
    };

    ApiResponse.success(res, transaction, 'Payment confirmed');
  } catch (error) {
    next(error);
  }
};