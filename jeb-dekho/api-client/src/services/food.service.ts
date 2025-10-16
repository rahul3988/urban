import { ApiClient } from '../config/apiClient';
import { PaymentMethod } from '@jeb-dekho/common';

interface RestaurantQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

interface MenuQuery {
  category?: string;
  isVeg?: boolean;
  search?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  customizations?: Array<{
    name: string;
    value: string;
    price: number;
  }>;
}

interface CreateOrderRequest {
  vendorId: string;
  items: OrderItem[];
  deliveryAddress: any;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
}

export class FoodService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getRestaurants(query?: RestaurantQuery) {
    return this.apiClient.get('/food/restaurants', { params: query });
  }

  async getRestaurantDetails(id: string) {
    return this.apiClient.get(`/food/restaurants/${id}`);
  }

  async getMenu(restaurantId: string, query?: MenuQuery) {
    return this.apiClient.get(`/food/restaurants/${restaurantId}/menu`, { params: query });
  }

  async createOrder(data: CreateOrderRequest) {
    return this.apiClient.post('/food/orders', data);
  }

  async getOrder(id: string) {
    return this.apiClient.get(`/food/orders/${id}`);
  }

  async getOrderHistory(params?: { page?: number; limit?: number; status?: string }) {
    return this.apiClient.get('/food/orders', { params });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.apiClient.put(`/food/orders/${id}/status`, { status });
  }
}