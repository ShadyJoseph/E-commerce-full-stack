import mongoose from 'mongoose';
import Product from '../models/product';
import ErrorResponse from '../utils/errorResponse';

// Validate productId and fetch the product document.
export const validateAndFetchProduct = async (productId: string) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ErrorResponse('Invalid product ID', 400);
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ErrorResponse('Product not found', 404);
  }
  return product;
};


// Check if the requested color, size, and stock are available.
export const validateProductStock = (product: any, color: string, size: string, quantity: number) => {
  const colorOption = product.colors.find((c: any) => c.color === color);
  if (!colorOption) {
    throw new ErrorResponse(`Invalid color: ${color}`, 400);
  }
  const sizeOption = colorOption.availableSizes.find((s: any) => s.size === size);
  if (!sizeOption) {
    throw new ErrorResponse(`Invalid size: ${size}`, 400);
  }
  if (sizeOption.stock < quantity) {
    throw new ErrorResponse('Insufficient stock', 400);
  }
  return true;
};
