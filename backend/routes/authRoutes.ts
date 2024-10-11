import { Router } from 'express';
import {
  googleAuth,
  googleCallback,
  logout,
} from '../controllers/authController';
import { isAuthenticated, isAdmin } from '../middlewares/authValidation';

const router = Router();

// Google Auth Routes
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback);

// Logout Route
router.get('/auth/logout', isAuthenticated, logout);

// User Profile Route (protected)
router.get('/profile', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Admin Only Route
router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.send('Welcome, Admin!');
});

// Dashboard Route (protected)
router.get('/dashboard', isAuthenticated, (req, res) => {
  if (!req.user) {
    return res.redirect('/api/auth/login'); // Redirect if no user is in session
  }
  res.send(`Welcome to your dashboard, ${req.user?.email || req.user?.displayName}!`);
});

export default router;
