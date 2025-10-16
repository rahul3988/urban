import { ApiClient } from '../config/apiClient';

export class PaymentService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getWallet() {
    return this.apiClient.get('/payments/wallet');
  }

  async addMoney(amount: number, method: string) {
    return this.apiClient.post('/payments/wallet/add', { amount, method });
  }

  async getTransactionHistory(params?: { page?: number; limit?: number }) {
    return this.apiClient.get('/payments/transactions', { params });
  }

  async initiatePayment(data: {
    orderId: string;
    amount: number;
    method: string;
  }) {
    return this.apiClient.post('/payments/initiate', data);
  }

  async confirmPayment(data: {
    paymentId: string;
    transactionId: string;
  }) {
    return this.apiClient.post('/payments/confirm', data);
  }
}