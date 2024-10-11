import { Router } from 'express';
import passport from '../middlewares/authMiddlewares';
import { googleAuth, googleCallback, instagramAuth, instagramCallback, logout } from '../controllers/authController';
import { isAuthenticated, isAdmin } from '../middlewares/authValidation'; // Middleware for authorization

const router = Router();

// Google Auth
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback, (req, res) => {
  res.redirect('/');
});

// Instagram Auth
router.get('/auth/instagram', instagramAuth);
router.get('/auth/instagram/callback', instagramCallback, (req, res) => {
  res.redirect('/');
});

// Logout
router.get('/auth/logout', isAuthenticated, logout);

// User Profile (protected route example)
router.get('/profile', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Admin Only Route (example)
router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.send('Welcome, Admin!');
});

export default router;
