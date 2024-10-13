import { Request, Response } from 'express';
import Product from '../models/product';
import expressValidator from 'express-validator'; // Corrected import for express-validator
const { validationResult } = expressValidator; // Extract validationResult
import logger from '../utils/logger'; // Assuming logger utility is used

// Create a new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newProduct = await Product.create(req.body);
    logger.info(`Product created: ${newProduct.name}`);
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    logger.error('Product creation error', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Other methods remain the same...


// Get all products with pagination
export const getAllProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query; // Use pagination
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const products = await Product.find().skip(skip).limit(Number(limit));
    const totalProducts = await Product.countDocuments();

    res.json({ total: totalProducts, page, limit, products });
  } catch (error) {
    logger.error('Error fetching products', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    logger.error(`Error fetching product by ID ${req.params.id}`, error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    logger.info(`Product updated: ${updatedProduct.name}`);
    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    logger.error(`Error updating product ID ${req.params.id}`, error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    logger.info(`Product deleted: ${deletedProduct.name}`);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    logger.error(`Error deleting product ID ${req.params.id}`, error);
    res.status(500).json({ message: 'Server error', error });
  }
};
