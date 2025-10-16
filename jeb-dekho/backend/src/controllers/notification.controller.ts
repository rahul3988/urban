import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

const db = MockDatabase.getInstance();

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const userId = req.user!.id;

    let notifications = Array.from(db.notifications.values()).filter(
      n => n.userId === userId
    );

    if (unread !== undefined) {
      notifications = notifications.filter(n => !n.isRead === (unread === 'true'));
    }

    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedNotifications = notifications.slice(startIndex, endIndex);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    ApiResponse.success(res, {
      notifications: paginatedNotifications,
      unreadCount,
      totalCount: notifications.length
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const notification = db.notifications.get(id);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    if (notification.userId !== req.user!.id) {
      throw new ApiError(403, 'Access denied');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    db.notifications.set(id, notification);

    ApiResponse.success(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const userNotifications = Array.from(db.notifications.values()).filter(
      n => n.userId === userId && !n.isRead
    );

    userNotifications.forEach(notification => {
      notification.isRead = true;
      notification.readAt = new Date();
      db.notifications.set(notification.id, notification);
    });

    ApiResponse.success(res, {
      updated: userNotifications.length
    }, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const notification = db.notifications.get(id);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    if (notification.userId !== req.user!.id) {
      throw new ApiError(403, 'Access denied');
    }

    db.notifications.delete(id);

    ApiResponse.success(res, null, 'Notification deleted');
  } catch (error) {
    next(error);
  }
};