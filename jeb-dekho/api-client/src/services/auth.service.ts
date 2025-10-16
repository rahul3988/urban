import { ApiClient } from '../config/apiClient';
import { UserRole } from '@jeb-dekho/common';

interface RegisterData {
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  businessType?: string;
  vehicleType?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface OTPData {
  phone: string;
  otp?: string;
}

export class AuthService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async register(data: RegisterData) {
    const response = await this.apiClient.post('/auth/register', data);
    if (response.data?.token) {
      this.apiClient.setToken(response.data.token);
    }
    return response;
  }

  async login(data: LoginData) {
    const response = await this.apiClient.post('/auth/login', data);
    if (response.data?.token) {
      this.apiClient.setToken(response.data.token);
    }
    return response;
  }

  async sendOTP(phone: string) {
    return this.apiClient.post('/auth/send-otp', { phone });
  }

  async verifyOTP(data: OTPData) {
    const response = await this.apiClient.post('/auth/verify-otp', data);
    if (response.data?.token) {
      this.apiClient.setToken(response.data.token);
    }
    return response;
  }

  async refreshToken(refreshToken: string) {
    return this.apiClient.post('/auth/refresh-token', { refreshToken });
  }

  logout() {
    this.apiClient.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.apiClient.getToken();
  }
}