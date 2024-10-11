import { Request, Response } from 'express';
import User from '../models/user'; // Import User model

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
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// View user cart
export const viewCart = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate('cart.productId');

    if (!user || !user.cart) {
      return res.status(404).json({ message: 'User or cart not found' });
    }

    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, size, quantity } = req.body; // Ensure size is included
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize cart if undefined
    if (!user.cart) {
      user.cart = [];
    }

    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, size, quantity });
    }

    await user.save();

    res.json({ message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId, size } = req.params;
    const user = await User.findById(req.user?._id);

    if (!user || !user.cart) {
      return res.status(404).json({ message: 'User or cart not found' });
    }

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId || item.size !== size
    );

    await user.save();

    res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
