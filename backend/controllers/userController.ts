import { Request, Response } from 'express';
import User from '../models/user'; // Import User model
import Product, { IProduct } from '../models/product'; // Import Product model

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
    const user = await User.findById(req.user?._id).populate('cart.product.productId'); // Correct the populate reference

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
    const { product, size, quantity } = req.body; // Change productId to product
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize cart if undefined
    user.cart = user.cart || [];

    const existingItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === product && item.size === size // Use product instead of productId
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product, size, quantity }); // Use product instead of productId
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
    const { product, size } = req.params; // Change productId to product
    const user = await User.findById(req.user?._id);

    if (!user || !user.cart) {
      return res.status(404).json({ message: 'User or cart not found' });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== product || item.size !== size // Use product instead of productId
    );

    await user.save();

    res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Example of another function for adding an address
export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; // Get the user's ID from the request
    const address = req.body; // Assuming the address is sent in the body

    const user = await User.findById(userId); // Find the user by ID

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.addAddress(address); // Call the addAddress method

    res.json({ message: 'Address added', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
