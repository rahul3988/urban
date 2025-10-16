import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

const db = MockDatabase.getInstance();

export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, rating, comment, images } = req.body;
    const userId = req.user!.id;

    const order = db.orders.get(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (order.customerId !== userId) {
      throw new ApiError(403, 'You can only review your own orders');
    }

    const review = {
      id: `review_${Date.now()}`,
      orderId,
      customerId: userId,
      vendorId: order.vendorId,
      deliveryPartnerId: order.deliveryPartnerId,
      rating,
      comment,
      images: images || [],
      createdAt: new Date()
    };

    db.reviews.set(review.id, review);

    // Update vendor rating
    const vendor = db.users.get(order.vendorId);
    if (vendor) {
      const vendorReviews = Array.from(db.reviews.values()).filter(r => r.vendorId === vendor.id);
      const totalRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0);
      vendor.rating = totalRating / vendorReviews.length;
      vendor.totalReviews = vendorReviews.length;
      db.users.set(vendor.id, vendor);
    }

    ApiResponse.success(res, review, 'Review created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { vendorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const vendor = db.users.get(vendorId);
    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }

    let reviews = Array.from(db.reviews.values()).filter(r => r.vendorId === vendorId);
    reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedReviews = reviews.slice(startIndex, endIndex);

    // Add customer info to reviews
    const reviewsWithCustomer = paginatedReviews.map(review => {
      const customer = db.users.get(review.customerId);
      return {
        ...review,
        customer: customer ? {
          name: `${customer.firstName} ${customer.lastName}`,
          profilePicture: customer.profilePicture
        } : null
      };
    });

    ApiResponse.paginated(
      res,
      reviewsWithCustomer,
      Number(page),
      Number(limit),
      reviews.length
    );
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = db.reviews.get(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (review.customerId !== req.user!.id) {
      throw new ApiError(403, 'You can only update your own reviews');
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.updatedAt = new Date();

    db.reviews.set(id, review);

    ApiResponse.success(res, review, 'Review updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const review = db.reviews.get(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (review.customerId !== req.user!.id) {
      throw new ApiError(403, 'You can only delete your own reviews');
    }

    db.reviews.delete(id);

    ApiResponse.success(res, null, 'Review deleted successfully');
  } catch (error) {
    next(error);
  }
};