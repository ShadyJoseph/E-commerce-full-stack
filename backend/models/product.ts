import mongoose, { Document, Schema } from 'mongoose';

// Define an enum for product categories
enum ProductCategory {
  Swimwear = 'swimwear',
  Accessories = 'accessories',
  Others = 'others',
}

// Define an interface for the Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string; // Make imageUrl required
  category: ProductCategory; // Product category
  availableSizes: { size: string; stock: number }[]; // Sizes with stock quantities
  createdAt: Date; // Creation date
  updatedAt: Date; // Last updated date
  totalStock: number; // Total stock across all sizes
}

// Define the product schema
const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 }, // Max length for name
    description: { type: String, required: true, trim: true, maxlength: 500 }, // Max length for description
    price: { type: Number, required: true, min: 0 }, // Ensure price is non-negative
    imageUrl: { type: String, required: true }, // Make imageUrl required
    category: { type: String, enum: Object.values(ProductCategory), required: true, trim: true }, // Enum for category
    availableSizes: [
      {
        size: { type: String, required: true }, // Size name (e.g., 'S', 'M', 'L')
        stock: { type: Number, required: true, min: 0 }, // Stock quantity for this size
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Virtual property to calculate total stock
productSchema.virtual('totalStock').get(function (this: IProduct) {
  return this.availableSizes.reduce((total: number, size: { stock: number }) => total + size.stock, 0); // Define size type
});

// Create the Product model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
