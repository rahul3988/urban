import { ServiceType, Location } from './user';

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  WALLET = 'WALLET',
  NET_BANKING = 'NET_BANKING'
}

export interface BaseOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  deliveryPartnerId?: string;
  serviceType: ServiceType;
  status: OrderStatus;
  totalAmount: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodOrder extends BaseOrder {
  serviceType: ServiceType.FOOD;
  items: FoodOrderItem[];
  preparationTime: number;
  specialInstructions?: string;
}

export interface TransportOrder extends BaseOrder {
  serviceType: ServiceType.TRANSPORT;
  pickupLocation: Location;
  dropLocation: Location;
  distance: number;
  duration: number;
  vehicleType: string;
  fare: FareBreakdown;
}

export interface MartOrder extends BaseOrder {
  serviceType: ServiceType.MART;
  items: MartOrderItem[];
  deliverySlot?: TimeSlot;
}

export interface FoodOrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: ItemCustomization[];
}

export interface MartOrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface ItemCustomization {
  name: string;
  value: string;
  price: number;
}

export interface FareBreakdown {
  baseFare: number;
  distanceCharge: number;
  timeCharge: number;
  surgeMultiplier?: number;
  tollCharges?: number;
  parkingCharges?: number;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

export interface OrderTracking {
  orderId: string;
  currentStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
  deliveryPartnerLocation?: Location;
  estimatedDeliveryTime?: Date;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  message?: string;
}