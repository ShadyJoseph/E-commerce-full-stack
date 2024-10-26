import { Router } from 'express';
import {
  googleCallback,
  logout,
  userLogin,
  userSignUp,
} from '../controllers/authController';
import { googleAuth } from '../utils/findOrCreateGoogleUser';
import {
  isAuthenticated
} from '../middlewares/authValidation';
import {
  validateUserSignUp,
  validateUserLogin,
  validateRequest,
} from '../middlewares/authValidation'; 

const router = Router();

// Google Auth Routes
router.get('/auth/google', googleAuth);//signup using google
router.get('/auth/google/callback', googleCallback);

// User-based Sign-up and Login Routes
router.post('/auth/signup', validateUserSignUp, validateRequest, userSignUp);
router.post('/auth/login', validateUserLogin, validateRequest, userLogin);
router.post('/auth/logout', isAuthenticated, logout);


// Protected Dashboard Route
router.get('/dashboard', isAuthenticated, (req, res) => {
  const username = req.user?.displayName || req.user?.email;
  res.json({ message: `Welcome ${username}` });
});

export default router;
