import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

const db = MockDatabase.getInstance();

// Mock wallet balances
const walletBalances = new Map<string, number>();
const transactions = new Map<string, any[]>();

export const getWallet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const balance = walletBalances.get(userId) || 0;

    ApiResponse.success(res, {
      balance,
      currency: 'INR',
      lastUpdated: new Date()
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

    if (amount <= 0) {
      throw new ApiError(400, 'Invalid amount');
    }

    const currentBalance = walletBalances.get(userId) || 0;
    const newBalance = currentBalance + amount;
    walletBalances.set(userId, newBalance);

    // Record transaction
    const transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'CREDIT',
      amount,
      method,
      description: 'Added to wallet',
      balance: newBalance,
      status: 'SUCCESS',
      createdAt: new Date()
    };

    const userTransactions = transactions.get(userId) || [];
    userTransactions.push(transaction);
    transactions.set(userId, userTransactions);

    ApiResponse.success(res, {
      balance: newBalance,
      transaction
    }, 'Money added successfully');
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
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user!.id;

    const userTransactions = transactions.get(userId) || [];
    userTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedTransactions = userTransactions.slice(startIndex, endIndex);

    ApiResponse.paginated(
      res,
      paginatedTransactions,
      Number(page),
      Number(limit),
      userTransactions.length
    );
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