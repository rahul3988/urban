import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { v4 as uuidv4 } from 'uuid';

const db = MockDatabase.getInstance();

// Mock wallet data
const wallets = new Map<string, any>();
const walletTransactions = new Map<string, any[]>();

export class WalletService {
  static async getOrCreateWallet(userId: string) {
    let wallet = wallets.get(userId);
    
    if (!wallet) {
      wallet = {
        id: `wallet_${Date.now()}`,
        userId,
        balance: 0,
        currency: 'INR',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      wallets.set(userId, wallet);
    }
    
    return wallet;
  }

  static async getBalance(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return wallet.balance;
  }

  static async addMoney(userId: string, amount: number, method: string, reference?: string) {
    if (amount <= 0) {
      throw new ApiError(400, 'Invalid amount');
    }

    const wallet = await this.getOrCreateWallet(userId);
    const previousBalance = wallet.balance;
    wallet.balance += amount;
    wallet.updatedAt = new Date();
    wallets.set(userId, wallet);

    // Create transaction record
    const transaction = {
      id: `txn_${Date.now()}`,
      walletId: wallet.id,
      userId,
      type: 'CREDIT',
      amount,
      method,
      reference: reference || `ADD_${Date.now()}`,
      description: `Added to wallet via ${method}`,
      previousBalance,
      currentBalance: wallet.balance,
      status: 'SUCCESS',
      createdAt: new Date()
    };

    const userTransactions = walletTransactions.get(userId) || [];
    userTransactions.push(transaction);
    walletTransactions.set(userId, userTransactions);

    return {
      wallet,
      transaction
    };
  }

  static async deductMoney(userId: string, amount: number, description: string, orderId?: string) {
    if (amount <= 0) {
      throw new ApiError(400, 'Invalid amount');
    }

    const wallet = await this.getOrCreateWallet(userId);
    
    if (wallet.balance < amount) {
      throw new ApiError(400, 'Insufficient wallet balance');
    }

    const previousBalance = wallet.balance;
    wallet.balance -= amount;
    wallet.updatedAt = new Date();
    wallets.set(userId, wallet);

    // Create transaction record
    const transaction = {
      id: `txn_${Date.now()}`,
      walletId: wallet.id,
      userId,
      type: 'DEBIT',
      amount,
      orderId,
      description,
      previousBalance,
      currentBalance: wallet.balance,
      status: 'SUCCESS',
      createdAt: new Date()
    };

    const userTransactions = walletTransactions.get(userId) || [];
    userTransactions.push(transaction);
    walletTransactions.set(userId, userTransactions);

    return {
      wallet,
      transaction
    };
  }

  static async refund(userId: string, amount: number, orderId: string, reason: string) {
    const result = await this.addMoney(
      userId, 
      amount, 
      'REFUND',
      `REFUND_${orderId}`
    );

    // Update transaction description
    result.transaction.description = `Refund for order ${orderId}: ${reason}`;
    result.transaction.orderId = orderId;
    
    return result;
  }

  static async getTransactionHistory(userId: string, limit = 50, offset = 0) {
    const transactions = walletTransactions.get(userId) || [];
    
    // Sort by date descending
    const sorted = transactions.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
    
    return {
      transactions: sorted.slice(offset, offset + limit),
      total: sorted.length,
      hasMore: sorted.length > offset + limit
    };
  }

  static async processWalletPayment(userId: string, amount: number, orderId: string) {
    try {
      const result = await this.deductMoney(
        userId,
        amount,
        `Payment for order ${orderId}`,
        orderId
      );
      
      return {
        success: true,
        transactionId: result.transaction.id,
        remainingBalance: result.wallet.balance
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ApiError ? error.message : 'Payment failed'
      };
    }
  }

  static async getWalletStats(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    const transactions = walletTransactions.get(userId) || [];
    
    const totalAdded = transactions
      .filter(t => t.type === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalSpent = transactions
      .filter(t => t.type === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastTransaction = transactions.length > 0 
      ? transactions[transactions.length - 1] 
      : null;
    
    return {
      balance: wallet.balance,
      totalAdded,
      totalSpent,
      transactionCount: transactions.length,
      lastTransaction,
      walletCreated: wallet.createdAt
    };
  }
}