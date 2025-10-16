import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.stack);
  }

  const response = {
    success: false,
    error: {
      code: (error as ApiError).statusCode,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  };

  res.status((error as ApiError).statusCode).json(response);
};