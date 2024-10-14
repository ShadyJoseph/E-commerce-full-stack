import { Request, Response } from 'express';
import Product from '../models/product';
import { validationResult } from 'express-validator';
import logger from '../utils/logger';
import ErrorResponse from '../utils/errorResponse';

// Centralized error handler for validation results
const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  return null;
};

// Create a new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  try {
    const newProduct = await Product.create(req.body);
    logger.info(`Product created: ${newProduct.name}`);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    logger.error('Error creating product', { error });
    res.status(500).json(new ErrorResponse('Server error, product could not be created', 500));
  }
};

// Get all products with pagination
export const getAllProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const products = await Product.find().skip(skip).limit(limitNumber).lean();
    const totalProducts = await Product.countDocuments();

    logger.info(`Fetched ${products.length} products (Page ${pageNumber})`);
    res.json({
      success: true,
      total: totalProducts,
      page: pageNumber,
      limit: limitNumber,
      products,
    });
  } catch (error) {
    logger.error('Error fetching products', { error });
    res.status(500).json(new ErrorResponse('Server error, unable to fetch products', 500));
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      logger.warn(`Product not found with ID: ${req.params.id}`);
      return res.status(404).json(new ErrorResponse('Product not found', 404));
    }
    res.json({ success: true, product });
  } catch (error) {
    logger.error(`Error fetching product by ID ${req.params.id}`, { error });
    res.status(500).json(new ErrorResponse('Server error, unable to fetch product', 500));
  }
};

// Update a product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    
    if (!updatedProduct) {
      logger.warn(`Product not found for update with ID: ${req.params.id}`);
      return res.status(404).json(new ErrorResponse('Product not found', 404));
    }

    logger.info(`Product updated: ${updatedProduct.name}`);
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    logger.error(`Error updating product ID ${req.params.id}`, { error });
    res.status(500).json(new ErrorResponse('Server error, unable to update product', 500));
  }
};

// Delete a product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      logger.warn(`Product not found for deletion with ID: ${req.params.id}`);
      return res.status(404).json(new ErrorResponse('Product not found', 404));
    }

    logger.info(`Product deleted: ${deletedProduct.name}`);
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting product ID ${req.params.id}`, { error });
    res.status(500).json(new ErrorResponse('Server error, unable to delete product', 500));
  }
};
