import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middlewares/error';
import connectDB from './config/db'; 
import passport from './middlewares/authMiddlewares';
import session from 'express-session';
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Routes
app.use("/api",authRoutes);

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
connectDB();  

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
