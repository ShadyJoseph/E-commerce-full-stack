import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import logger from '../utils/logger';
import ErrorResponse from '../utils/errorResponse';
import { SortOrder } from 'mongoose';
import { ProductCategory } from '../models/product';

// Helper function for async error handling
const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new product (Admin only)
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
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
});

// Get all products with filtering, sorting, and pagination
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = '-createdAt', category, gender } = req.query;
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * limitNumber;

  const query: any = {};
  if (category) query.category = category;
  if (gender) query.gender = gender;

  try {
    const products = await Product.find(query)
      .skip(skip)
      .limit(limitNumber)
      .sort(sort as string | { [key: string]: SortOrder })
      .lean();

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNumber);

    logger.info(`Fetched ${products.length} products (Page ${pageNumber})`);
    res.json({
      success: true,
      total: totalProducts,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
      prevPage: pageNumber > 1 ? pageNumber - 1 : null,
      products,
    });
  } catch (error) {
    logger.error('Error fetching products', { error });
    res.status(500).json(new ErrorResponse('Server error, unable to fetch products', 500));
  }
});

// Get a single product by ID
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
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
});

// Update a product (Admin only)
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();

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
});

// Delete a product (Admin only)
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
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
});

export const getProductCategories = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!ProductCategory) {
      throw new Error('ProductCategory enum is not defined');
    }

    const categories = Object.values(ProductCategory);
    logger.info(`Fetched product categories: ${categories}`);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error'; // Type check for error
    logger.error(`Error fetching product categories: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: 'Server error, unable to fetch product categories',
      error: errorMessage,
    });
  }
});
