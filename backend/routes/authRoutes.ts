// routes/authRoutes.ts

import { Router } from 'express';
import { googleAuth, googleCallback, logout } from '../controllers/authController';
import { isAuthenticated, isAdmin } from '../middlewares/authValidation';

const router = Router();

// Google Auth Routes
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback);

// Logout Route
router.get('/auth/logout', isAuthenticated, logout);

// Admin Only Route
router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.send('Welcome, Admin!');
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  const username = req.user?.displayName || req.user?.email || 'User';
  res.send(`Welcome to your dashboard, ${username}!`);
});

export default router;
