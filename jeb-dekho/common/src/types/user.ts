export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  DELIVERY_PARTNER = 'DELIVERY_PARTNER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export interface BaseUser {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer extends BaseUser {
  role: UserRole.CUSTOMER;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  addresses: Address[];
}

export interface Vendor extends BaseUser {
  role: UserRole.VENDOR;
  businessName: string;
  businessType: ServiceType;
  businessAddress: Address;
  businessLicense: string;
  rating: number;
  totalReviews: number;
}

export interface DeliveryPartner extends BaseUser {
  role: UserRole.DELIVERY_PARTNER;
  firstName: string;
  lastName: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  drivingLicense: string;
  isOnline: boolean;
  currentLocation?: Location;
  rating: number;
  totalDeliveries: number;
}

export interface Admin extends BaseUser {
  role: UserRole.ADMIN;
  firstName: string;
  lastName: string;
  permissions: string[];
}

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: AddressType;
  isDefault?: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  OTHER = 'OTHER'
}

export enum VehicleType {
  BIKE = 'BIKE',
  CAR = 'CAR',
  AUTO = 'AUTO',
  CYCLE = 'CYCLE'
}

export enum ServiceType {
  TRANSPORT = 'TRANSPORT',
  FOOD = 'FOOD',
  MART = 'MART'
}