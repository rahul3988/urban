import { ServiceType } from './user';

export interface MenuItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number;
  customizations?: MenuCustomization[];
  tags: string[];
}

export interface MenuCustomization {
  id: string;
  name: string;
  type: CustomizationType;
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export enum CustomizationType {
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT'
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand?: string;
  price: number;
  mrp?: number;
  unit: string;
  quantity: number;
  imageUrls: string[];
  isAvailable: boolean;
  tags: string[];
}

export interface TransportService {
  id: string;
  name: string;
  vehicleType: string;
  baseFare: number;
  perKmCharge: number;
  perMinuteCharge: number;
  minFare: number;
  maxSeats?: number;
  features: string[];
  isAvailable: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  serviceType: ServiceType;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
}

export interface VendorMenu {
  vendorId: string;
  categories: MenuCategory[];
  items: MenuItem[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
}