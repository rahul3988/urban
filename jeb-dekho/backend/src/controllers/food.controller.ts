import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { 
  OrderStatus, 
  PaymentStatus, 
  ServiceType,
  UserRole
} from '@jeb-dekho/common';

const db = MockDatabase.getInstance();

export const getRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    
    // Get all food vendors
    let restaurants = Array.from(db.users.values()).filter(
      u => u.role === UserRole.VENDOR && u.businessType === ServiceType.FOOD
    );

    // Apply filters
    if (search) {
      restaurants = restaurants.filter(r => 
        r.businessName.toLowerCase().includes(search.toString().toLowerCase())
      );
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedRestaurants = restaurants.slice(startIndex, endIndex);

    // Format response
    const formattedRestaurants = paginatedRestaurants.map(r => ({
      id: r.id,
      name: r.businessName,
      address: r.businessAddress,
      rating: r.rating,
      totalReviews: r.totalReviews,
      isOpen: true, // Mock - in production, check operating hours
      deliveryTime: '30-45 mins',
      minimumOrder: 150,
      cuisines: ['North Indian', 'Chinese'], // Mock data
      image: `https://placeholder.com/restaurant/${r.id}`
    }));

    ApiResponse.paginated(
      res,
      formattedRestaurants,
      Number(page),
      Number(limit),
      restaurants.length
    );
  } catch (error) {
    next(error);
  }
};

export const getRestaurantDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const restaurant = db.users.get(id);

    if (!restaurant || restaurant.role !== UserRole.VENDOR || restaurant.businessType !== ServiceType.FOOD) {
      throw new ApiError(404, 'Restaurant not found');
    }

    const details = {
      id: restaurant.id,
      name: restaurant.businessName,
      address: restaurant.businessAddress,
      rating: restaurant.rating,
      totalReviews: restaurant.totalReviews,
      isOpen: true,
      openingHours: {
        monday: '10:00 AM - 11:00 PM',
        tuesday: '10:00 AM - 11:00 PM',
        wednesday: '10:00 AM - 11:00 PM',
        thursday: '10:00 AM - 11:00 PM',
        friday: '10:00 AM - 11:00 PM',
        saturday: '10:00 AM - 11:30 PM',
        sunday: '10:00 AM - 11:30 PM'
      },
      deliveryTime: '30-45 mins',
      minimumOrder: 150,
      cuisines: ['North Indian', 'Chinese', 'Fast Food'],
      features: ['Online Ordering', 'Takeaway', 'Delivery'],
      images: [
        `https://placeholder.com/restaurant/${id}/1`,
        `https://placeholder.com/restaurant/${id}/2`
      ]
    };

    ApiResponse.success(res, details);
  } catch (error) {
    next(error);
  }
};

export const getMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { category, isVeg, search } = req.query;

    // Verify restaurant exists
    const restaurant = db.users.get(id);
    if (!restaurant || restaurant.role !== UserRole.VENDOR || restaurant.businessType !== ServiceType.FOOD) {
      throw new ApiError(404, 'Restaurant not found');
    }

    // Get menu items
    let menuItems = db.getVendorMenuItems(id);

    // Apply filters
    if (category) {
      menuItems = menuItems.filter(item => item.category === category);
    }
    if (isVeg !== undefined) {
      menuItems = menuItems.filter(item => item.isVeg === (isVeg === 'true'));
    }
    if (search) {
      menuItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(search.toString().toLowerCase()) ||
        item.description.toLowerCase().includes(search.toString().toLowerCase())
      );
    }

    // Group by category
    const groupedMenu = menuItems.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    ApiResponse.success(res, {
      restaurant: {
        id: restaurant.id,
        name: restaurant.businessName
      },
      categories: Object.keys(groupedMenu),
      menu: groupedMenu,
      totalItems: menuItems.length
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { vendorId, items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    // Verify vendor
    const vendor = db.users.get(vendorId);
    if (!vendor || vendor.role !== UserRole.VENDOR || vendor.businessType !== ServiceType.FOOD) {
      throw new ApiError(404, 'Restaurant not found');
    }

    // Calculate order total
    let totalAmount = 0;
    const orderItems = items.map((item: any) => {
      const menuItem = db.menuItems.get(item.id);
      if (!menuItem || menuItem.vendorId !== vendorId) {
        throw new ApiError(400, `Invalid menu item: ${item.id}`);
      }
      
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      return {
        id: `order_item_${Date.now()}_${item.id}`,
        menuItemId: item.id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        customizations: item.customizations || []
      };
    });

    // Check minimum order
    if (totalAmount < 150) {
      throw new ApiError(400, 'Minimum order value is ₹150');
    }

    // Calculate charges
    const deliveryFee = 40;
    const taxes = Math.round(totalAmount * 0.05);
    const discount = 0; // Can apply promo codes here
    const finalAmount = totalAmount + deliveryFee + taxes - discount;

    // Create order
    const order = {
      id: `order_${Date.now()}`,
      orderNumber: `FOOD${Date.now().toString().slice(-6)}`,
      customerId: req.user!.id,
      vendorId,
      deliveryPartnerId: null,
      serviceType: ServiceType.FOOD,
      status: OrderStatus.PENDING,
      items: orderItems,
      totalAmount,
      deliveryFee,
      taxes,
      discount,
      finalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH' ? PaymentStatus.PENDING : PaymentStatus.PROCESSING,
      deliveryAddress,
      specialInstructions,
      preparationTime: 30,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.orders.set(order.id, order);

    // Send notification to vendor (mock)
    const notification = {
      id: `notif_${Date.now()}`,
      userId: vendorId,
      title: 'New Order Received',
      message: `You have a new order #${order.orderNumber}`,
      type: 'ORDER_UPDATE',
      data: { orderId: order.id },
      isRead: false,
      createdAt: new Date()
    };
    db.notifications.set(notification.id, notification);

    ApiResponse.success(res, order, 'Order placed successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = db.orders.get(id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Check access
    if (
      order.customerId !== req.user!.id &&
      order.vendorId !== req.user!.id &&
      order.deliveryPartnerId !== req.user!.id
    ) {
      throw new ApiError(403, 'Access denied');
    }

    // Get additional details
    const vendor = db.users.get(order.vendorId);
    const customer = db.users.get(order.customerId);
    const driver = order.deliveryPartnerId ? db.users.get(order.deliveryPartnerId) : null;

    const orderDetails = {
      ...order,
      restaurant: {
        id: vendor.id,
        name: vendor.businessName,
        phone: vendor.phone,
        address: vendor.businessAddress
      },
      customer: {
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        phone: customer.phone
      },
      driver: driver ? {
        id: driver.id,
        name: `${driver.firstName} ${driver.lastName}`,
        phone: driver.phone,
        vehicleNumber: driver.vehicleNumber
      } : null
    };

    ApiResponse.success(res, orderDetails);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = db.orders.get(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Verify permissions
    if (req.user!.role === UserRole.VENDOR && order.vendorId !== req.user!.id) {
      throw new ApiError(403, 'Access denied');
    }
    if (req.user!.role === UserRole.DELIVERY_PARTNER && order.deliveryPartnerId !== req.user!.id) {
      throw new ApiError(403, 'Access denied');
    }

    // Validate status transition
    const validTransitions: Record<string, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED],
      [OrderStatus.ACCEPTED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY],
      [OrderStatus.READY]: [OrderStatus.PICKED_UP],
      [OrderStatus.PICKED_UP]: [OrderStatus.IN_TRANSIT],
      [OrderStatus.IN_TRANSIT]: [OrderStatus.DELIVERED]
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new ApiError(400, 'Invalid status transition');
    }

    // Update status
    order.status = status;
    order.updatedAt = new Date();

    // Update payment status for COD orders
    if (status === OrderStatus.DELIVERED && order.paymentMethod === 'CASH') {
      order.paymentStatus = PaymentStatus.SUCCESS;
    }

    // Assign driver when ready
    if (status === OrderStatus.READY && !order.deliveryPartnerId) {
      const drivers = Array.from(db.users.values()).filter(
        u => u.role === UserRole.DELIVERY_PARTNER && u.isOnline
      );
      if (drivers.length > 0) {
        order.deliveryPartnerId = drivers[0].id;
      }
    }

    db.orders.set(id, order);

    // Send notification
    const notificationTarget = req.user!.role === UserRole.VENDOR ? order.customerId : order.vendorId;
    const notification = {
      id: `notif_${Date.now()}`,
      userId: notificationTarget,
      title: 'Order Updated',
      message: `Order #${order.orderNumber} is now ${status.toLowerCase()}`,
      type: 'ORDER_UPDATE',
      data: { orderId: order.id, status },
      isRead: false,
      createdAt: new Date()
    };
    db.notifications.set(notification.id, notification);

    ApiResponse.success(res, order, 'Order status updated');
  } catch (error) {
    next(error);
  }
};

export const getOrderHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Get user orders
    let orders = db.getUserOrders(req.user!.id);

    // Filter by service type
    orders = orders.filter(o => o.serviceType === ServiceType.FOOD);

    // Filter by status
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    // Sort by date
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedOrders = orders.slice(startIndex, endIndex);

    // Add vendor details
    const ordersWithDetails = paginatedOrders.map(order => {
      const vendor = db.users.get(order.vendorId);
      return {
        ...order,
        restaurant: {
          id: vendor.id,
          name: vendor.businessName
        }
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