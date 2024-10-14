import { Request, Response } from 'express';
import User from '../models/user'; // Import User model
import logger from '../utils/logger'; 
import ErrorResponse from '../utils/errorResponse';

// Get user profile
export const getProfile = (req: Request, res: Response) => {
  res.json({ user: req.user });
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!updatedUser) {
      logger.warn(`User not found during profile update: ${userId}`);
      return res.status(404).json(new ErrorResponse('User not found', 404));
    }

    logger.info(`User profile updated: ${updatedUser.email}`);
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    logger.error(`Error updating user profile for ID ${req.user?._id}`, { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};

// View user cart
export const viewCart = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate('cart.product'); // Populate cart products

    if (!user || !user.cart) {
      logger.warn(`User or cart not found for user ID: ${req.user?._id}`);
      return res.status(404).json(new ErrorResponse('User or cart not found', 404));
    }

    logger.info(`Cart viewed for user ID: ${req.user?._id}`);
    res.json({ cart: user.cart });
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

    user.addToCart(product, size, quantity); // Utilize schema method for adding to cart
    await user.save();

    logger.info(`Item added to cart for user ID: ${req.user?._id}`, { product, size, quantity });
    res.json({ message: 'Item added to cart', cart: user.cart });
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

    user.removeFromCart(productId, size); // Utilize schema method for removing from cart
    await user.save();

    logger.info(`Item removed from cart for user ID: ${req.user?._id}`, { productId, size });
    res.json({ message: 'Item removed from cart', cart: user.cart });
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
      user.addresses = []; // Ensure addresses is an array
    }

    user.addresses.push(address);
    await user.save();

    logger.info(`Address added for user ID: ${userId}`, { address });
    res.json({ message: 'Address added', addresses: user.addresses });
  } catch (error) {
    logger.error(`Error adding address for user ID ${req.user?._id}`, { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};
