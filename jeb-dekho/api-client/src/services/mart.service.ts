import { ApiClient } from '../config/apiClient';

interface StoreQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

export class MartService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getStores(query?: StoreQuery) {
    return this.apiClient.get('/mart/stores', { params: query });
  }

  async getProducts(storeId: string, query?: ProductQuery) {
    return this.apiClient.get(`/mart/stores/${storeId}/products`, { params: query });
  }

  async addToCart(item: CartItem) {
    return this.apiClient.post('/mart/cart', item);
  }

  async getCart() {
    return this.apiClient.get('/mart/cart');
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.apiClient.put(`/mart/cart/${itemId}`, { quantity });
  }

  async removeFromCart(itemId: string) {
    return this.apiClient.delete(`/mart/cart/${itemId}`);
  }

  async checkout(data: {
    deliveryAddress: any;
    paymentMethod: string;
    deliverySlot?: any;
  }) {
    return this.apiClient.post('/mart/checkout', data);
  }
}