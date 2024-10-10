import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import ErrorResponse from '../utils/errorResponse';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error details
  logger.error(`Error: ${err.message}`);

  // Mongoose bad ObjectId error (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with ID: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new ErrorResponse(message, 400);
  }

  // Mongoose document not found error
  if (err.name === 'DocumentNotFoundError') {
    const message = 'Document not found';
    error = new ErrorResponse(message, 404);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
