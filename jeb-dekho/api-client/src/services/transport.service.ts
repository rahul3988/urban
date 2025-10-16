import { ApiClient } from '../config/apiClient';
import { Location, VehicleType, PaymentMethod } from '@jeb-dekho/common';

interface EstimateRequest {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  vehicleType?: VehicleType;
}

interface BookingRequest {
  pickupLocation: Location;
  dropLocation: Location;
  vehicleType: VehicleType;
  paymentMethod: PaymentMethod;
  scheduledTime?: Date;
}

export class TransportService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getEstimate(data: EstimateRequest) {
    return this.apiClient.post('/transport/estimate', data);
  }

  async createBooking(data: BookingRequest) {
    return this.apiClient.post('/transport/book', data);
  }

  async getBooking(id: string) {
    return this.apiClient.get(`/transport/bookings/${id}`);
  }

  async cancelBooking(id: string, reason: string) {
    return this.apiClient.put(`/transport/bookings/${id}/cancel`, { reason });
  }

  async trackBooking(id: string) {
    return this.apiClient.get(`/transport/bookings/${id}/track`);
  }

  async getNearbyDrivers(params: {
    latitude: number;
    longitude: number;
    vehicleType?: VehicleType;
    radius?: number;
  }) {
    return this.apiClient.get('/transport/drivers/nearby', { params });
  }
}