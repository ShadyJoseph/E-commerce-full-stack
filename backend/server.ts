import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middlewares/error';
import connectDB from './config/db';
import passport from './config/passportSetup';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sessionConfig from './config/sessionConfig';

// Load environment variables
dotenv.config();

// Check for critical environment variables
if (!process.env.SESSION_SECRET || !process.env.MONGO_URI || !process.env.JWT_SECRET) {
  throw new Error("Critical environment variables are missing.");
}

// Initialize Express
const app = express();

// Middleware for security
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for brute-force protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  skipSuccessfulRequests: true,
});
app.use(limiter);

// Connect to MongoDB
connectDB();
app.use(sessionConfig(process.env.MONGO_URI!, process.env.SESSION_SECRET!));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS Setup
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourproductiondomain.com' 
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Default Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, welcome to the app!');
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
