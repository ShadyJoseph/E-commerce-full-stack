import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional
  category: string; // Product category
  availableSizes: { size: string; stock: number }[]; // Sizes with stock quantities
  createdAt: Date; // Creation date
  updatedAt: Date; // Last updated date
}

// Define the product schema
const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }, // Ensure price is non-negative
    imageUrl: { type: String, required: true }, // Make imageUrl required
    category: { type: String, required: true, trim: true }, // Product category
    availableSizes: [
      {
        size: { type: String, required: true }, // Size name (e.g., 'S', 'M', 'L')
        stock: { type: Number, required: true, min: 0 }, // Stock quantity for this size
      },
    ], // New field for available sizes with stock quantities
    createdAt: { type: Date, default: Date.now }, // Set default creation date
    updatedAt: { type: Date, default: Date.now }, // Set default updated date
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the Product model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
