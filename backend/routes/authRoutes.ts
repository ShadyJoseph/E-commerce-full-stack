import { Router } from 'express';
import {
  googleAuth,
  googleCallback,
  logout,
  userLogin,
  userSignUp,
} from '../controllers/authController';
import {
  isAuthenticated,
  isJWTAuthenticated,
  isAdmin,
} from '../middlewares/authValidation';

const router = Router();

// Google Auth Routes
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback);

// User-based Sign-up and Login Routes
router.post('/auth/signup', userSignUp);
router.post('/auth/login', userLogin);

// Logout Route
router.get('/auth/logout', isAuthenticated, logout);

// Protected Dashboard Route
router.get('/dashboard', isAuthenticated, (req, res) => {
  const username = req.user?.displayName || req.user?.email;
  res.json({ message: `Welcome ${username}` });
});

export default router;
