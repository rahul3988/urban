import { ApiClient } from '../config/apiClient';
import { Address } from '@jeb-dekho/common';

export class UserService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getProfile() {
    return this.apiClient.get('/users/profile');
  }

  async updateProfile(data: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    profilePicture: string;
  }>) {
    return this.apiClient.put('/users/profile', data);
  }

  async deleteProfile() {
    return this.apiClient.delete('/users/profile');
  }

  async getAddresses() {
    return this.apiClient.get<Address[]>('/users/addresses');
  }

  async addAddress(address: Omit<Address, 'id'>) {
    return this.apiClient.post<Address>('/users/addresses', address);
  }

  async updateAddress(id: string, address: Partial<Address>) {
    return this.apiClient.put<Address>(`/users/addresses/${id}`, address);
  }

  async deleteAddress(id: string) {
    return this.apiClient.delete(`/users/addresses/${id}`);
  }
}