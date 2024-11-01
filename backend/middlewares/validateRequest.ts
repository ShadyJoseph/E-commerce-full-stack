import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import logger from '../utils/logger';

/**
 * Middleware to handle validation errors for any request.
 * Logs validation errors and returns a structured error response if any are found.
 * Applies to all routes that require validation.
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(err => {
      // Type checking for ValidationError vs AlternativeValidationError properties
      const field = 'param' in err ? err.param : 'unknown';
      const message = 'msg' in err ? err.msg : 'Validation error';
      const value = 'value' in err ? err.value : 'unknown';

      return { field, message, value };
    });

    logger.warn(`Validation failed for ${req.method} ${req.originalUrl}:`, errorDetails);

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errorDetails,
    });
  }

  next();
};

export default validateRequest