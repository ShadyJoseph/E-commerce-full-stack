import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middlewares/error';
import connectDB from './config/db';
import passport from './middlewares/authMiddlewares';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware for security
app.use(helmet()); // Protect HTTP headers
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
}));

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
app.use('/api', authRoutes); // Mounting the routes under /api

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on PORT:${PORT}`);
});
