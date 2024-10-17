import { Request, Response } from 'express';
import mongoose from 'mongoose'; // Add mongoose import
import User from '../models/user'; // Import User model
import logger from '../utils/logger'; 
import ErrorResponse from '../utils/errorResponse';
import bcrypt from 'bcryptjs';

// Get user profile
export const getProfile = (req: Request, res: Response) => {
  try {
    const userProfile = req.user;
    if (!userProfile) {
      logger.warn(`Profile not found for user ID: ${req.user?._id}`);
      return res.status(404).json(new ErrorResponse('Profile not found', 404));
    }
    
    logger.info(`Profile retrieved for user ID: ${req.user?._id}`);
    res.json({ success: true, user: userProfile });
  } catch (error) {
    logger.error('Error fetching profile', { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};


// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const updatedData = { ...req.body };

    // Check if password is being updated, if so, hash it
    if (updatedData.password) {
      logger.info(`Updating password for user: ${userId}`);
      updatedData.password = await bcrypt.hash(updatedData.password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) {
      logger.warn(`User not found during profile update: ${userId}`);
      return res.status(404).json(new ErrorResponse('User not found', 404));
    }

    logger.info(`User profile updated: ${updatedUser.email}`);
    res.json({ success: true, message: 'Profile updated', user: updatedUser });
  } catch (error) {
    logger.error(`Error updating user profile for ID ${req.user?._id}`, { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};


// View user cart
export const viewCart = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate('cart.product').lean();

    if (!user || !user.cart) {
      logger.warn(`User or cart not found for user ID: ${req.user?._id}`);
      return res.status(404).json(new ErrorResponse('User or cart not found', 404));
    }

    logger.info(`Cart viewed for user ID: ${req.user?._id}`);
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    logger.error(`Error fetching cart for user ID ${req.user?._id}`, { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { product, size, quantity } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      logger.warn(`User not found for adding to cart: ${req.user?._id}`);
      return res.status(404).json(new ErrorResponse('User not found', 404));
    }

    const productId = new mongoose.Types.ObjectId(product); // Convert product to ObjectId

    user.addToCart(productId, size, quantity); // Pass the ObjectId
    await user.save();

    logger.info(`Item added to cart for user ID: ${req.user?._id}`, { product, size, quantity });
    res.json({ success: true, message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    logger.error(`Error adding item to cart for user ID ${req.user?._id}`, { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId, size } = req.params;
    const user = await User.findById(req.user?._id);

    if (!user || !user.cart) {
      logger.warn(`User or cart not found for removal from cart: ${req.user?._id}`);
      return res.status(404).json(new ErrorResponse('User or cart not found', 404));
    }

    const productObjectId = new mongoose.Types.ObjectId(productId); // Convert productId to ObjectId

    user.removeFromCart(productObjectId, size); // Pass the ObjectId
    await user.save();

    logger.info(`Item removed from cart for user ID: ${req.user?._id}`, { productId, size });
    res.json({ success: true, message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    logger.error(`Error removing item from cart for user ID ${req.user?._id}`, { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};

// Add address
export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const address = req.body;

    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User not found for adding address: ${userId}`);
      return res.status(404).json(new ErrorResponse('User not found', 404));
    }

    if (!user.addresses) {
      user.addresses = []; // Ensure addresses is initialized
    }

    user.addresses.push(address);
    await user.save();

    logger.info(`Address added for user ID: ${userId}`, { address });
    res.json({ success: true, message: 'Address added', addresses: user.addresses });
  } catch (error) {
    logger.error(`Error adding address for user ID ${req.user?._id}`, { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};
