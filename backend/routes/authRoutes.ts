import { Router } from 'express';
import { googleAuth, googleCallback, logout } from '../controllers/authController';
import { isAuthenticated, isAdmin } from '../middlewares/authValidation';

const router = Router();

// Google Auth Routes
router.get('/auth/google', googleAuth); // Start Google OAuth flow
router.get('/auth/google/callback', googleCallback); // Handle Google OAuth callback

// Logout Route
router.get('/auth/logout', isAuthenticated, logout);

// Admin Only Route
router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.send('Welcome, Admin!');
});

// Dashboard Route (protected)
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Welcome to your dashboard, ${req.user?.email || req.user?.displayName}!`);
});

export default router;
