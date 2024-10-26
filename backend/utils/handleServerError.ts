import logger from '../utils/logger';
import {Response} from 'express';

// Utility for error handling
export const handleServerError = (res: Response, error: Error, message: string) => {
    logger.error(`${message}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Internal server error' });
  };
  