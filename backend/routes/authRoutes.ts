import { Router } from 'express';
import {
  googleCallback,
  logout,
  userLogin,
  userSignUp,
} from '../controllers/authController';
import googleAuth from '../utils/googleUtils/googleAuth';
import {
  validateUserSignUp,
  validateUserLogin,
  isAuthenticated
} from '../middlewares/authValidation'; 

import validateRequest from '../middlewares/validateRequest';


const router = Router();

// Google Auth Routes
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback);

// User-based Sign-up and Login Routes
router.post('/auth/signup', validateUserSignUp, validateRequest, userSignUp);
router.post('/auth/login', validateUserLogin, validateRequest, userLogin);
router.post('/auth/logout', isAuthenticated, logout);

export default router;
