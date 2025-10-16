import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { UserRole } from '@jeb-dekho/common';

const db = MockDatabase.getInstance();

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = db.users.get(req.user!.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { password, ...userWithoutPassword } = user;
    ApiResponse.success(res, userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = db.users.get(req.user!.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'profilePicture'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };

    db.users.set(req.user!.id, updatedUser);

    const { password, ...userWithoutPassword } = updatedUser;
    ApiResponse.success(res, userWithoutPassword, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = db.users.get(req.user!.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Soft delete - set status to inactive
    user.status = 'INACTIVE';
    user.updatedAt = new Date();
    db.users.set(req.user!.id, user);

    ApiResponse.success(res, null, 'Account deactivated successfully');
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = db.users.get(req.user!.id);
    if (!user || user.role !== UserRole.CUSTOMER) {
      throw new ApiError(403, 'Only customers can have addresses');
    }

    const addresses = user.addresses || [];
    ApiResponse.success(res, addresses);
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = db.users.get(req.user!.id);
    if (!user || user.role !== UserRole.CUSTOMER) {
      throw new ApiError(403, 'Only customers can have addresses');
    }

    const newAddress = {
      id: `addr_${Date.now()}`,
      ...req.body,
      isDefault: user.addresses?.length === 0 || req.body.isDefault
    };

    // If setting as default, unset other defaults
    if (newAddress.isDefault && user.addresses) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    user.addresses = [...(user.addresses || []), newAddress];
    user.updatedAt = new Date();
    db.users.set(req.user!.id, user);

    ApiResponse.success(res, newAddress, 'Address added successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = db.users.get(req.user!.id);
    
    if (!user || user.role !== UserRole.CUSTOMER) {
      throw new ApiError(403, 'Only customers can have addresses');
    }

    const addressIndex = user.addresses?.findIndex((addr: any) => addr.id === id);
    if (addressIndex === -1 || addressIndex === undefined) {
      throw new ApiError(404, 'Address not found');
    }

    // If setting as default, unset other defaults
    if (req.body.isDefault && user.addresses) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      ...req.body,
      id
    };
    user.updatedAt = new Date();
    db.users.set(req.user!.id, user);

    ApiResponse.success(res, user.addresses[addressIndex], 'Address updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = db.users.get(req.user!.id);
    
    if (!user || user.role !== UserRole.CUSTOMER) {
      throw new ApiError(403, 'Only customers can have addresses');
    }

    user.addresses = user.addresses?.filter((addr: any) => addr.id !== id) || [];
    user.updatedAt = new Date();
    db.users.set(req.user!.id, user);

    ApiResponse.success(res, null, 'Address deleted successfully');
  } catch (error) {
    next(error);
  }
};