import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middlewares/error';
import connectDB from './config/db';  // Assuming the MongoDB connection logic is in 'config/db'

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Error handling middleware (must come after routes)
app.use(errorHandler);

// MongoDB connection
//connectDB();  // Initiates MongoDB connection using the connectDB function from 'config/db'

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
