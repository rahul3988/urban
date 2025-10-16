import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { UserRole, OrderStatus } from '@jeb-dekho/common';

const db = MockDatabase.getInstance();

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = Array.from(db.users.values());
    const orders = Array.from(db.orders.values());

    const stats = {
      users: {
        total: users.length,
        customers: users.filter(u => u.role === UserRole.CUSTOMER).length,
        vendors: users.filter(u => u.role === UserRole.VENDOR).length,
        drivers: users.filter(u => u.role === UserRole.DELIVERY_PARTNER).length,
        activeToday: users.filter(u => 
          new Date(u.updatedAt).toDateString() === new Date().toDateString()
        ).length
      },
      orders: {
        total: orders.length,
        pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
        inProgress: orders.filter(o => 
          [OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.IN_TRANSIT].includes(o.status)
        ).length,
        completed: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
        cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
        todayTotal: orders.filter(o => 
          new Date(o.createdAt).toDateString() === new Date().toDateString()
        ).length
      },
      revenue: {
        total: orders.reduce((sum, o) => sum + o.finalAmount, 0),
        today: orders
          .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
          .reduce((sum, o) => sum + o.finalAmount, 0),
        thisMonth: orders
          .filter(o => {
            const orderDate = new Date(o.createdAt);
            const now = new Date();
            return orderDate.getMonth() === now.getMonth() && 
                   orderDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum, o) => sum + o.finalAmount, 0)
      },
      services: {
        transport: orders.filter(o => o.serviceType === 'TRANSPORT').length,
        food: orders.filter(o => o.serviceType === 'FOOD').length,
        mart: orders.filter(o => o.serviceType === 'MART').length
      }
    };

    ApiResponse.success(res, stats);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;

    let users = Array.from(db.users.values());

    if (role) {
      users = users.filter(u => u.role === role);
    }
    if (status) {
      users = users.filter(u => u.status === status);
    }
    if (search) {
      const searchLower = search.toString().toLowerCase();
      users = users.filter(u => 
        u.email.toLowerCase().includes(searchLower) ||
        u.phone.includes(searchLower) ||
        (u.firstName && u.firstName.toLowerCase().includes(searchLower)) ||
        (u.businessName && u.businessName.toLowerCase().includes(searchLower))
      );
    }

    users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);

    // Remove passwords
    const usersWithoutPassword = paginatedUsers.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    ApiResponse.paginated(
      res,
      usersWithoutPassword,
      Number(page),
      Number(limit),
      users.length
    );
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = db.users.get(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.status = status;
    user.updatedAt = new Date();
    db.users.set(id, user);

    const { password, ...userWithoutPassword } = user;
    ApiResponse.success(res, userWithoutPassword, 'User status updated');
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 20, status, serviceType, startDate, endDate } = req.query;

    let orders = Array.from(db.orders.values());

    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    if (serviceType) {
      orders = orders.filter(o => o.serviceType === serviceType);
    }
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      orders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }

    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedOrders = orders.slice(startIndex, endIndex);

    ApiResponse.paginated(
      res,
      paginatedOrders,
      Number(page),
      Number(limit),
      orders.length
    );
  } catch (error) {
    next(error);
  }
};

export const getRevenue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { period = 'month' } = req.query;
    const orders = Array.from(db.orders.values()).filter(
      o => o.status === OrderStatus.DELIVERED
    );

    const now = new Date();
    let filteredOrders = orders;

    switch (period) {
      case 'day':
        filteredOrders = orders.filter(o => 
          new Date(o.createdAt).toDateString() === now.toDateString()
        );
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredOrders = orders.filter(o => 
          new Date(o.createdAt) >= weekAgo
        );
        break;
      case 'month':
        filteredOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate.getMonth() === now.getMonth() && 
                 orderDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'year':
        filteredOrders = orders.filter(o => 
          new Date(o.createdAt).getFullYear() === now.getFullYear()
        );
        break;
    }

    const revenue = {
      total: filteredOrders.reduce((sum, o) => sum + o.finalAmount, 0),
      orders: filteredOrders.length,
      byService: {
        transport: filteredOrders
          .filter(o => o.serviceType === 'TRANSPORT')
          .reduce((sum, o) => sum + o.finalAmount, 0),
        food: filteredOrders
          .filter(o => o.serviceType === 'FOOD')
          .reduce((sum, o) => sum + o.finalAmount, 0),
        mart: filteredOrders
          .filter(o => o.serviceType === 'MART')
          .reduce((sum, o) => sum + o.finalAmount, 0)
      },
      average: filteredOrders.length > 0 
        ? filteredOrders.reduce((sum, o) => sum + o.finalAmount, 0) / filteredOrders.length
        : 0
    };

    ApiResponse.success(res, revenue);
  } catch (error) {
    next(error);
  }
};