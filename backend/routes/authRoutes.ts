import { Router } from 'express';
import {
  googleAuth,
  googleCallback,
  logout,
  userLogin,
  userSignUp,
} from '../controllers/authController';
import {
  isAuthenticated
} from '../middlewares/authValidation';
import {
  validateUserSignUp,
  validateUserLogin,
  validateRequest,
} from '../middlewares/authValidation'; // Adjust the path as necessary

const router = Router();

// Google Auth Routes
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback);

// User-based Sign-up and Login Routes
router.post('/auth/signup', validateUserSignUp, validateRequest, userSignUp);
router.post('/auth/login', validateUserLogin, validateRequest, userLogin);

// Logout Route - consider using POST instead of GET for better security
router.post('/auth/logout', isAuthenticated, logout);


// Protected Dashboard Route
router.get('/dashboard', isAuthenticated, (req, res) => {
  const username = req.user?.displayName || req.user?.email;
  res.json({ message: `Welcome ${username}` });
});

export default router;
