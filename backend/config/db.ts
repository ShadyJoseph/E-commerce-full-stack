import mongoose from 'mongoose';
import logger from '../utils/logger';
import ErrorResponse from '../utils/errorResponse';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new ErrorResponse('MongoDB connection string is missing', 500);
    }

    await mongoose.connect(mongoURI);
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error(`Database connection error: ${(error as Error).message}`);
    throw new ErrorResponse('Failed to connect to the database', 500);
  }
};

export default connectDB;
