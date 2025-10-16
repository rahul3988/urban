import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { v4 as uuidv4 } from 'uuid';

const db = MockDatabase.getInstance();

// Mock promo codes storage
const promoCodes = new Map<string, any>();
const userPromoUsage = new Map<string, string[]>(); // userId -> [promoIds]

// Initialize with some promo codes
export const initPromoCodes = () => {
  const promos = [
    {
      id: 'promo1',
      code: 'WELCOME50',
      description: 'Get 50% off on your first order',
      type: 'PERCENTAGE',
      value: 50,
      minOrderValue: 100,
      maxDiscount: 200,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: 1,
      isFirstTimeOnly: true,
      serviceTypes: ['FOOD', 'MART'],
      isActive: true
    },
    {
      id: 'promo2',
      code: 'RIDE100',
      description: 'Flat ₹100 off on transport booking',
      type: 'FIXED_AMOUNT',
      value: 100,
      minOrderValue: 200,
      maxDiscount: 100,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      usageLimit: 3,
      isFirstTimeOnly: false,
      serviceTypes: ['TRANSPORT'],
      isActive: true
    },
    {
      id: 'promo3',
      code: 'FREEDEL',
      description: 'Free delivery on orders above ₹300',
      type: 'FREE_DELIVERY',
      value: 0,
      minOrderValue: 300,
      maxDiscount: 50,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      usageLimit: 5,
      isFirstTimeOnly: false,
      serviceTypes: ['FOOD', 'MART'],
      isActive: true
    }
  ];

  promos.forEach(promo => {
    promoCodes.set(promo.code, promo);
  });
};

// Initialize promo codes
initPromoCodes();

export class PromoService {
  static async validatePromoCode(
    code: string, 
    userId: string, 
    orderValue: number, 
    serviceType: string
  ) {
    const promo = promoCodes.get(code.toUpperCase());
    
    if (!promo) {
      throw new ApiError(400, 'Invalid promo code');
    }

    if (!promo.isActive) {
      throw new ApiError(400, 'Promo code is not active');
    }

    // Check validity period
    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) {
      throw new ApiError(400, 'Promo code has expired');
    }

    // Check service type
    if (!promo.serviceTypes.includes(serviceType)) {
      throw new ApiError(400, 'Promo code not valid for this service');
    }

    // Check minimum order value
    if (orderValue < promo.minOrderValue) {
      throw new ApiError(400, `Minimum order value should be ₹${promo.minOrderValue}`);
    }

    // Check usage limit
    const userUsage = userPromoUsage.get(userId) || [];
    const usageCount = userUsage.filter(id => id === promo.id).length;
    
    if (usageCount >= promo.usageLimit) {
      throw new ApiError(400, 'Promo code usage limit exceeded');
    }

    // Check first time only
    if (promo.isFirstTimeOnly) {
      const orders = db.getUserOrders(userId);
      if (orders.length > 0) {
        throw new ApiError(400, 'Promo code is only for first-time users');
      }
    }

    // Calculate discount
    let discount = 0;
    let freeDelivery = false;

    switch (promo.type) {
      case 'PERCENTAGE':
        discount = Math.round(orderValue * (promo.value / 100));
        if (promo.maxDiscount && discount > promo.maxDiscount) {
          discount = promo.maxDiscount;
        }
        break;
      case 'FIXED_AMOUNT':
        discount = promo.value;
        break;
      case 'FREE_DELIVERY':
        freeDelivery = true;
        break;
    }

    return {
      promoId: promo.id,
      code: promo.code,
      discount,
      freeDelivery,
      description: promo.description
    };
  }

  static async applyPromoCode(userId: string, promoId: string) {
    const userUsage = userPromoUsage.get(userId) || [];
    userUsage.push(promoId);
    userPromoUsage.set(userId, userUsage);
  }

  static async getUserPromoCodes(userId: string) {
    const allPromos = Array.from(promoCodes.values());
    const userUsage = userPromoUsage.get(userId) || [];
    
    return allPromos.map(promo => {
      const usageCount = userUsage.filter(id => id === promo.id).length;
      return {
        ...promo,
        remainingUsage: promo.usageLimit - usageCount,
        canUse: usageCount < promo.usageLimit
      };
    }).filter(promo => promo.isActive);
  }

  static async createPromoCode(data: any) {
    const id = `promo_${Date.now()}`;
    const promo = {
      id,
      ...data,
      code: data.code.toUpperCase(),
      createdAt: new Date()
    };
    
    promoCodes.set(promo.code, promo);
    return promo;
  }
}