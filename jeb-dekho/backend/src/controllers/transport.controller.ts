import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { calculateDistance, calculateFare } from '../utils/helpers';
import { 
  OrderStatus, 
  PaymentStatus, 
  ServiceType,
  UserRole,
  VehicleType 
} from '@jeb-dekho/common';

const db = MockDatabase.getInstance();

export const getEstimate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pickupLat, pickupLng, dropLat, dropLng, vehicleType } = req.body;

    // Calculate distance
    const distance = calculateDistance(pickupLat, pickupLng, dropLat, dropLng);
    
    // Estimate duration (rough estimate: 2 min per km in city)
    const duration = Math.round(distance * 2);

    // Calculate fare for different vehicle types
    const estimates = [
      {
        vehicleType: VehicleType.BIKE,
        fare: calculateFare(distance, duration, VehicleType.BIKE),
        estimatedTime: Math.round(duration * 0.8), // Bikes are faster in traffic
        distance
      },
      {
        vehicleType: VehicleType.AUTO,
        fare: calculateFare(distance, duration, VehicleType.AUTO),
        estimatedTime: duration,
        distance
      },
      {
        vehicleType: VehicleType.CAR,
        fare: calculateFare(distance, duration, VehicleType.CAR),
        estimatedTime: Math.round(duration * 1.1), // Cars might be slower in traffic
        distance
      }
    ];

    // If specific vehicle type requested, return only that
    const result = vehicleType 
      ? estimates.find(e => e.vehicleType === vehicleType)
      : estimates;

    ApiResponse.success(res, result, 'Fare estimate calculated');
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { 
      pickupLocation, 
      dropLocation, 
      vehicleType, 
      paymentMethod,
      scheduledTime 
    } = req.body;

    // Calculate fare
    const distance = calculateDistance(
      pickupLocation.latitude,
      pickupLocation.longitude,
      dropLocation.latitude,
      dropLocation.longitude
    );
    const duration = Math.round(distance * 2);
    const fare = calculateFare(distance, duration, vehicleType);

    // Find available driver (mock - in production, use matching algorithm)
    const drivers = Array.from(db.users.values()).filter(
      u => u.role === UserRole.DELIVERY_PARTNER && 
           u.vehicleType === vehicleType && 
           u.isOnline
    );

    if (drivers.length === 0) {
      throw new ApiError(404, 'No drivers available at the moment');
    }

    const driver = drivers[0]; // Simple assignment for mock

    // Create booking
    const booking = {
      id: `booking_${Date.now()}`,
      orderNumber: `TRN${Date.now().toString().slice(-6)}`,
      customerId: req.user!.id,
      vendorId: null, // No vendor for transport
      deliveryPartnerId: driver.id,
      serviceType: ServiceType.TRANSPORT,
      status: OrderStatus.ACCEPTED,
      pickupLocation,
      dropLocation,
      distance,
      duration,
      vehicleType,
      fare: {
        baseFare: 50,
        distanceCharge: fare - 50,
        timeCharge: 0,
        totalFare: fare
      },
      totalAmount: fare,
      deliveryFee: 0,
      taxes: Math.round(fare * 0.05),
      discount: 0,
      finalAmount: fare + Math.round(fare * 0.05),
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH' ? PaymentStatus.PENDING : PaymentStatus.PROCESSING,
      scheduledTime: scheduledTime || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.orders.set(booking.id, booking);

    ApiResponse.success(res, booking, 'Booking created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const booking = db.orders.get(id);

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Check if user has access to this booking
    if (
      booking.customerId !== req.user!.id &&
      booking.deliveryPartnerId !== req.user!.id
    ) {
      throw new ApiError(403, 'Access denied');
    }

    // Get driver details
    const driver = db.users.get(booking.deliveryPartnerId);
    const driverInfo = driver ? {
      id: driver.id,
      name: `${driver.firstName} ${driver.lastName}`,
      phone: driver.phone,
      vehicleNumber: driver.vehicleNumber,
      rating: driver.rating,
      currentLocation: driver.currentLocation
    } : null;

    ApiResponse.success(res, {
      ...booking,
      driver: driverInfo
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const booking = db.orders.get(id);

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Check if user can cancel
    if (booking.customerId !== req.user!.id) {
      throw new ApiError(403, 'Only customer can cancel booking');
    }

    // Check if booking can be cancelled
    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(booking.status)) {
      throw new ApiError(400, 'Booking cannot be cancelled');
    }

    // Update booking
    booking.status = OrderStatus.CANCELLED;
    booking.cancelReason = reason;
    booking.cancelledAt = new Date();
    booking.updatedAt = new Date();

    // Process refund if payment was made
    if (booking.paymentStatus === PaymentStatus.SUCCESS) {
      booking.paymentStatus = PaymentStatus.REFUNDED;
    }

    db.orders.set(id, booking);

    ApiResponse.success(res, booking, 'Booking cancelled successfully');
  } catch (error) {
    next(error);
  }
};

export const trackBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const booking = db.orders.get(id);

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Check if user has access
    if (
      booking.customerId !== req.user!.id &&
      booking.deliveryPartnerId !== req.user!.id
    ) {
      throw new ApiError(403, 'Access denied');
    }

    // Get driver location
    const driver = db.users.get(booking.deliveryPartnerId);
    
    const tracking = {
      orderId: booking.id,
      currentStatus: booking.status,
      statusHistory: [
        {
          status: OrderStatus.PENDING,
          timestamp: booking.createdAt,
          message: 'Booking created'
        },
        {
          status: OrderStatus.ACCEPTED,
          timestamp: new Date(booking.createdAt.getTime() + 60000),
          message: 'Driver assigned'
        }
      ],
      driverLocation: driver?.currentLocation || null,
      estimatedArrival: new Date(Date.now() + booking.duration * 60000),
      pickupLocation: booking.pickupLocation,
      dropLocation: booking.dropLocation
    };

    ApiResponse.success(res, tracking);
  } catch (error) {
    next(error);
  }
};

export const getNearbyDrivers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { latitude, longitude, vehicleType, radius = 5 } = req.query;

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);

    // Get all online drivers
    const drivers = Array.from(db.users.values()).filter(
      u => u.role === UserRole.DELIVERY_PARTNER && u.isOnline
    );

    // Filter by distance and vehicle type
    const nearbyDrivers = drivers
      .filter(driver => {
        if (vehicleType && driver.vehicleType !== vehicleType) {
          return false;
        }
        
        if (driver.currentLocation) {
          const distance = calculateDistance(
            lat,
            lng,
            driver.currentLocation.latitude,
            driver.currentLocation.longitude
          );
          return distance <= parseFloat(radius as string);
        }
        return false;
      })
      .map(driver => ({
        id: driver.id,
        name: `${driver.firstName} ${driver.lastName}`,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber,
        rating: driver.rating,
        location: driver.currentLocation,
        distance: calculateDistance(
          lat,
          lng,
          driver.currentLocation.latitude,
          driver.currentLocation.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance);

    ApiResponse.success(res, nearbyDrivers);
  } catch (error) {
    next(error);
  }
};