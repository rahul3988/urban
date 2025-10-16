import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { OrderStatus } from '@jeb-dekho/common';

const db = MockDatabase.getInstance();

export const getDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.user!.id;
    const vendor = db.users.get(vendorId);
    
    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }

    const orders = Array.from(db.orders.values()).filter(o => o.vendorId === vendorId);
    const today = new Date().toDateString();

    const stats = {
      todayOrders: orders.filter(o => 
        new Date(o.createdAt).toDateString() === today
      ).length,
      todayRevenue: orders
        .filter(o => new Date(o.createdAt).toDateString() === today)
        .reduce((sum, o) => sum + o.totalAmount, 0),
      pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING).length,
      activeOrders: orders.filter(o => 
        [OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY].includes(o.status)
      ).length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      rating: vendor.rating,
      totalReviews: vendor.totalReviews,
      businessType: vendor.businessType
    };

    ApiResponse.success(res, stats);
  } catch (error) {
    next(error);
  }
};

export const getVendorOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const vendorId = req.user!.id;

    let orders = Array.from(db.orders.values()).filter(o => o.vendorId === vendorId);

    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedOrders = orders.slice(startIndex, endIndex);

    // Add customer details
    const ordersWithDetails = paginatedOrders.map(order => {
      const customer = db.users.get(order.customerId);
      return {
        ...order,
        customer: customer ? {
          name: `${customer.firstName} ${customer.lastName}`,
          phone: customer.phone
        } : null
      };
    });

    ApiResponse.paginated(
      res,
      ordersWithDetails,
      Number(page),
      Number(limit),
      orders.length
    );
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const vendorId = req.user!.id;

    const menuItem = db.menuItems.get(id);
    if (!menuItem) {
      throw new ApiError(404, 'Menu item not found');
    }

    if (menuItem.vendorId !== vendorId) {
      throw new ApiError(403, 'Access denied');
    }

    const updatedItem = {
      ...menuItem,
      ...updates,
      updatedAt: new Date()
    };

    db.menuItems.set(id, updatedItem);

    ApiResponse.success(res, updatedItem, 'Menu item updated');
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const vendorId = req.user!.id;

    const product = db.products.get(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (product.vendorId !== vendorId) {
      throw new ApiError(403, 'Access denied');
    }

    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date()
    };

    db.products.set(id, updatedProduct);

    ApiResponse.success(res, updatedProduct, 'Product updated');
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isAvailable } = req.body;
    const vendorId = req.user!.id;

    const vendor = db.users.get(vendorId);
    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }

    vendor.isAvailable = isAvailable;
    vendor.updatedAt = new Date();
    db.users.set(vendorId, vendor);

    ApiResponse.success(res, {
      isAvailable: vendor.isAvailable
    }, `Store is now ${isAvailable ? 'open' : 'closed'}`);
  } catch (error) {
    next(error);
  }
};