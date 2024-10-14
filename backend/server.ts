import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middlewares/error';
import connectDB from './config/db';
import passport from './config/passportSetup';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes'; 
import productRoutes from './routes/productRoutes';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import MongoStore from 'connect-mongo';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware for security
app.use(helmet());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  skipSuccessfulRequests: true, // Skip successful requests
});
app.use(limiter);

// Connect to MongoDB
connectDB();

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI!,
      ttl: 2 * 24 * 60 * 60, // 2 days
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    proxy: process.env.NODE_ENV === 'production', // Enable if behind a proxy
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS Setup
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://yourproductiondomain.com' : '*',
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/api', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User management routes
app.use('/api/products', productRoutes); // Product management routes

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
