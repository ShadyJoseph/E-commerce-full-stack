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
    const user = await User.findById(req.user?._id).populate('cart.product'); // Populate cart products

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
    const { product, size, quantity } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addToCart(product, size, quantity); // Utilize schema method for adding to cart

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

    user.removeFromCart(productId, size); // Utilize schema method for removing from cart

    await user.save();
    res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add address
export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const address = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addresses.push(address);
    await user.save();

    res.json({ message: 'Address added', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
