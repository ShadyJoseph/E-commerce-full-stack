import { Request, Response } from 'express';
import mongoose from 'mongoose'; 
import User from '../models/user'; 
import logger from '../utils/logger'; 
import ErrorResponse from '../utils/errorResponse';
import bcrypt from 'bcryptjs';
import Product from '../models/product';
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
          imageUrls: product.imageUrls, // Display product images
          category: product.category, // Add category if needed
        },
        size: cartItem.size, // The size selected by the user
        quantity: cartItem.quantity, // Quantity added to the cart
        _id: cartItem._id // The cart item ID
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
    const { productId, color, size, quantity } = req.body; // Extract product details from request body
    const user = await User.findById(req.user?._id);

    if (!user) {
      logger.warn(`User not found for adding to cart: ${req.user?._id}`);
      return res.status(404).json(new ErrorResponse('User not found', 404));
    }

    // Ensure the product ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      logger.warn(`Invalid product ID: ${productId}`);
      return res.status(400).json(new ErrorResponse('Invalid product ID', 400));
    }

    // Fetch the product from the database using productId
    const productDoc = await Product.findById(productId);

    if (!productDoc) {
      logger.warn(`Product not found: ${productId}`);
      return res.status(404).json(new ErrorResponse('Product not found', 404));
    }

    // Check if the color exists
    const colorIndex = productDoc.colors.findIndex(c => c.color === color);
    if (colorIndex === -1) {
      logger.warn(`Invalid color: ${color} for product: ${productId}`);
      return res.status(400).json(new ErrorResponse('Invalid color', 400));
    }

    // Check if the size exists within the chosen color
    const sizeIndex = productDoc.colors[colorIndex].availableSizes.findIndex(s => s.size === size);
    if (sizeIndex === -1) {
      logger.warn(`Invalid size: ${size} for product: ${productId}, color: ${color}`);
      return res.status(400).json(new ErrorResponse('Invalid size', 400));
    }

    // Check if there's enough stock for the requested quantity
    const availableStock = productDoc.colors[colorIndex].availableSizes[sizeIndex].stock;
    if (availableStock < quantity) {
      logger.warn(`Insufficient stock for product: ${productId}, color: ${color}, size: ${size}`);
      return res.status(400).json(new ErrorResponse('Insufficient stock', 400));
    }

    // Reduce stock for the product
    await productDoc.reduceStock(color, size, quantity);

    // Add the product to the user's cart
    await user.addToCart(productId, size, quantity); // Ensure the method is awaited
    await user.save();

    logger.info(`Item added to cart for user ID: ${req.user?._id}`, { productId, size, quantity });
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
