import { ApiClient } from '../config/apiClient';

export class NotificationService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getNotifications(params?: { page?: number; limit?: number; unread?: boolean }) {
    return this.apiClient.get('/notifications', { params });
  }

  async markAsRead(id: string) {
    return this.apiClient.put(`/notifications/${id}/read`);
  }

  async markAllAsRead() {
    return this.apiClient.put('/notifications/read-all');
  }

  async deleteNotification(id: string) {
    return this.apiClient.delete(`/notifications/${id}`);
  }
}