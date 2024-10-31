import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import logger from '../utils/logger';
import ErrorResponse from '../utils/errorResponse';
import hashPassword from '../utils/hashPassword';
import { validateProductStock, validateAndFetchProduct } from '../utils/cartUtils';
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

// Update user profile controller
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { password, ...otherData } = req.body;

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`User not found during profile update: ${userId}`);
      return res.status(404).json(new ErrorResponse('User not found', 404));
    }

    // If password is being updated, hash it
    if (password) {
      logger.info(`Updating password for user: ${userId}`);
      user.password = await hashPassword(password);
    }

    // Update other fields
    for (const [key, value] of Object.entries(otherData)) {
      user.set(key, value);
    }

    // Save changes
    await user.save();

    logger.info(`User profile updated: ${user.email}`);
    res.json({ success: true, message: 'Profile updated', user: user.toObject() });
  } catch (error) {
    logger.error(`Error updating user profile for ID ${req.user?._id}`, { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};

export const viewCart = async (req: Request, res: Response) => {
  try {
    // Find the user and populate the 'cart.product' reference
    const user = await User.findById(req.user?._id).populate('cart.product').lean();

    if (!user || !user.cart) {
      logger.warn(`User or cart not found for user ID: ${req.user?._id}`);
      return res.status(404).json(new ErrorResponse('User or cart not found', 404));
    }

    // Create a simplified version of the cart with only necessary details
    const cart = user.cart.map((cartItem: any) => {
      const product = cartItem.product;
      if (!product) return null;

      // Return relevant product info along with cart details
      return {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrls: product.imageUrls,
          category: product.category,
        },
        size: cartItem.size,
        quantity: cartItem.quantity,
        _id: cartItem._id
      };
    }).filter(item => item !== null); // Remove any null cart items

    logger.info(`Cart viewed for user ID: ${req.user?._id}`);
    res.json({ success: true, cart });
  } catch (error) {
    logger.error(`Error fetching cart for user ID ${req.user?._id}`, { error });
    res.status(500).json(new ErrorResponse('Server error', 500));
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, color, size, quantity } = req.body;

    // Fetch user document
    const user = await User.findById(req.user?._id);
    if (!user) {
      logger.warn(`User not found: ${req.user?._id}`);
      return res.status(404).json(new ErrorResponse('User not found', 404));
    }

    // Validate product and check stock availability
    const product = await validateAndFetchProduct(productId);
    validateProductStock(product, color, size, quantity);

    // Adjust stock on product and add to user's cart
    await product.reduceStock(color, size, quantity);
    await user.addToCart(productId, size, quantity);

    logger.info(`Item added to cart for user: ${req.user?._id}`);
    res.json({ success: true, message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    logger.error(`Error adding to cart: ${req.user?._id}`, { error });
    const status = error instanceof ErrorResponse ? error.statusCode : 500;
    res.status(status).json(error instanceof ErrorResponse ? error : new ErrorResponse('Server error', 500));
  }
};

/// Helper function to validate ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId, size } = req.params;
    let { quantity } = req.body; // Quantity to remove

    // Set default quantity to 1 if not provided
    quantity = quantity ? Number(quantity) : 1;

    // Validate productId and quantity
    if (!isValidObjectId(productId) || quantity <= 0) {
      logger.warn(`Invalid product ID or quantity: ${productId}, quantity: ${quantity}`);
      return res.status(400).json(new ErrorResponse('Invalid product ID or quantity', 400));
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      logger.warn(`User not found: ${req.user?._id}`);
      return res.status(404).json(new ErrorResponse('User not found', 404));
    }

    const removed = await user.removeFromCart(new mongoose.Types.ObjectId(productId), size, quantity);
    if (!removed) {
      logger.warn(`Item not found in cart for removal: ${productId}, size: ${size}`);
      return res.status(404).json(new ErrorResponse('Item not found in cart', 404));
    }

    logger.info(`Item quantity reduced in cart for user ID: ${req.user?._id}`, { productId, size, quantity });
    res.json({ success: true, message: 'Item quantity updated in cart', cart: user.cart });
  } catch (error) {
    logger.error(`Error updating item quantity in cart for user ID ${req.user?._id}`, { error });
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
      user.addresses = [];
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
