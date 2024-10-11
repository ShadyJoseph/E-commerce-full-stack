import { Request, Response } from 'express';
import Product from '../models/product'; // Adjust the import path based on your project structure

// Get Product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(`Error fetching product by ID: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search Products
export const searchProducts = async (req: Request, res: Response) => {
  const { query } = req.query; // Assuming query is passed as a URL parameter

  try {
    // Adjust the search logic according to your requirements
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Search by product name (case insensitive)
        { description: { $regex: query, $options: 'i' } }, // Search by product description
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(`Error searching products: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};
