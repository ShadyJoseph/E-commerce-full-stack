import { Request, Response } from 'express';
import Product from '../models/product';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
