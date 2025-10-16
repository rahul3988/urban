import { Request, Response, NextFunction } from 'express';
import { MockDatabase } from '../database/mockDb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  generateOTP 
} from '../utils/helpers';
import { UserRole, UserStatus } from '@jeb-dekho/common';

const db = MockDatabase.getInstance();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, phone, role, firstName, lastName, businessName, vehicleType } = req.body;

    // Check if user already exists
    if (db.findUserByEmail(email)) {
      throw new ApiError(400, 'Email already registered');
    }

    if (db.findUserByPhone(phone)) {
      throw new ApiError(400, 'Phone number already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user based on role
    const userId = `user_${Date.now()}`;
    let newUser: any = {
      id: userId,
      email,
      phone,
      password: hashedPassword,
      role,
      status: UserStatus.PENDING_VERIFICATION,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    switch (role) {
      case UserRole.CUSTOMER:
        newUser = {
          ...newUser,
          firstName,
          lastName,
          addresses: []
        };
        break;
      case UserRole.VENDOR:
        newUser = {
          ...newUser,
          businessName,
          businessType: req.body.businessType,
          businessLicense: '',
          rating: 0,
          totalReviews: 0
        };
        break;
      case UserRole.DELIVERY_PARTNER:
        newUser = {
          ...newUser,
          firstName,
          lastName,
          vehicleType,
          vehicleNumber: '',
          drivingLicense: '',
          isOnline: false,
          rating: 0,
          totalDeliveries: 0
        };
        break;
    }

    // Save user
    db.users.set(userId, newUser);

    // Generate OTP for verification
    const otp = generateOTP();
    db.otps.set(phone, {
      otp,
      expires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    // Generate token
    const token = generateToken({
      id: userId,
      email,
      role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    ApiResponse.success(res, {
      user: userWithoutPassword,
      token,
      message: `OTP sent to ${phone}. Please verify to activate your account.`
    }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = db.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new ApiError(403, 'Account not verified. Please verify your phone number.');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    ApiResponse.success(res, {
      user: userWithoutPassword,
      token
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone } = req.body;

    // Validate phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      throw new ApiError(400, 'Invalid phone number');
    }

    // Generate OTP
    const otp = generateOTP();
    db.otps.set(phone, {
      otp,
      expires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    // In production, send SMS here
    console.log(`OTP for ${phone}: ${otp}`);

    ApiResponse.success(res, {
      message: `OTP sent to ${phone}`,
      // Remove in production
      debugOTP: process.env.NODE_ENV === 'development' ? otp : undefined
    }, 'OTP sent successfully');
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, otp } = req.body;

    // Get stored OTP
    const storedOTP = db.otps.get(phone);
    if (!storedOTP) {
      throw new ApiError(400, 'OTP not found or expired');
    }

    // Check expiry
    if (new Date() > storedOTP.expires) {
      db.otps.delete(phone);
      throw new ApiError(400, 'OTP expired');
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      throw new ApiError(400, 'Invalid OTP');
    }

    // Clear OTP
    db.otps.delete(phone);

    // Find and activate user
    const user = db.findUserByPhone(phone);
    if (user) {
      user.status = UserStatus.ACTIVE;
      db.users.set(user.id, user);

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      const { password: _, ...userWithoutPassword } = user;

      ApiResponse.success(res, {
        user: userWithoutPassword,
        token
      }, 'Phone verified successfully');
    } else {
      ApiResponse.success(res, {
        verified: true
      }, 'OTP verified successfully');
    }
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token required');
    }

    // In production, implement proper refresh token logic
    // For now, just return a new token
    ApiResponse.success(res, {
      token: 'new_access_token',
      refreshToken: 'new_refresh_token'
    }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};