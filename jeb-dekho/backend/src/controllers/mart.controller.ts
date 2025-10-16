import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { ServiceType, UserRole, OrderStatus, PaymentStatus } from '@jeb-dekho/common';

const db = MockDatabase.getInstance();

// Simple in-memory cart storage
const userCarts = new Map<string, any[]>();

export const getStores = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    
    let stores = Array.from(db.users.values()).filter(
      u => u.role === UserRole.VENDOR && u.businessType === ServiceType.MART
    );

    if (search) {
      stores = stores.filter(s => 
        s.businessName.toLowerCase().includes(search.toString().toLowerCase())
      );
    }

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedStores = stores.slice(startIndex, endIndex);

    const formattedStores = paginatedStores.map(s => ({
      id: s.id,
      name: s.businessName,
      address: s.businessAddress,
      rating: s.rating,
      isOpen: true,
      deliveryTime: '45-60 mins',
      minimumOrder: 200,
      categories: ['Grocery', 'Dairy', 'Vegetables']
    }));

    ApiResponse.paginated(res, formattedStores, Number(page), Number(limit), stores.length);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, search, category, brand } = req.query;

    const store = db.users.get(id);
    if (!store || store.role !== UserRole.VENDOR || store.businessType !== ServiceType.MART) {
      throw new ApiError(404, 'Store not found');
    }

    let products = db.getVendorProducts(id);

    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toString().toLowerCase())
      );
    }
    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (brand) {
      products = products.filter(p => p.brand === brand);
    }

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedProducts = products.slice(startIndex, endIndex);

    ApiResponse.paginated(res, paginatedProducts, Number(page), Number(limit), products.length);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user!.id;

    const product = db.products.get(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    let cart = userCarts.get(userId) || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: `cart_${Date.now()}`,
        productId,
        product,
        quantity,
        addedAt: new Date()
      });
    }

    userCarts.set(userId, cart);
    ApiResponse.success(res, cart, 'Product added to cart');
  } catch (error) {
    next(error);
  }
};

export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = userCarts.get(req.user!.id) || [];
    
    const total = cart.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );

    ApiResponse.success(res, { items: cart, total });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user!.id;

    const cart = userCarts.get(userId) || [];
    const item = cart.find(i => i.id === itemId);

    if (!item) {
      throw new ApiError(404, 'Cart item not found');
    }

    if (quantity <= 0) {
      const index = cart.indexOf(item);
      cart.splice(index, 1);
    } else {
      item.quantity = quantity;
    }

    userCarts.set(userId, cart);
    ApiResponse.success(res, cart, 'Cart updated');
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params;
    const userId = req.user!.id;

    let cart = userCarts.get(userId) || [];
    cart = cart.filter(item => item.id !== itemId);
    
    userCarts.set(userId, cart);
    ApiResponse.success(res, null, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};

export const checkout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { deliveryAddress, paymentMethod, deliverySlot } = req.body;
    const userId = req.user!.id;

    const cart = userCarts.get(userId) || [];
    if (cart.length === 0) {
      throw new ApiError(400, 'Cart is empty');
    }

    const totalAmount = cart.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );

    if (totalAmount < 200) {
      throw new ApiError(400, 'Minimum order value is ₹200');
    }

    // Create order
    const order = {
      id: `order_${Date.now()}`,
      orderNumber: `MART${Date.now().toString().slice(-6)}`,
      customerId: userId,
      vendorId: cart[0].product.vendorId,
      serviceType: ServiceType.MART,
      status: OrderStatus.PENDING,
      items: cart.map(item => ({
        id: `order_item_${Date.now()}_${item.productId}`,
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        unit: item.product.unit
      })),
      totalAmount,
      deliveryFee: 40,
      taxes: Math.round(totalAmount * 0.05),
      discount: 0,
      finalAmount: totalAmount + 40 + Math.round(totalAmount * 0.05),
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH' ? PaymentStatus.PENDING : PaymentStatus.PROCESSING,
      deliveryAddress,
      deliverySlot,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.orders.set(order.id, order);
    userCarts.delete(userId); // Clear cart

    ApiResponse.success(res, order, 'Order placed successfully', 201);
  } catch (error) {
    next(error);
  }
};