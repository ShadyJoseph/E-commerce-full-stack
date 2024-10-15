import mongoose, { Document, Schema } from 'mongoose';

// Define an enum for product categories
export enum ProductCategory {
  Swimwear = 'swimwear',
  Accessories = 'accessories',
  Men = 'men',
  Women = 'women',
  Kids = 'kids',
}

// Define an interface for the Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: ProductCategory;
  availableSizes: { size: string; stock: number }[];
  totalStock: number;
  createdAt: Date;
  updatedAt: Date;
  reduceStock(size: string, quantity: number): Promise<void>;
}

// Define the product schema
const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    imageUrls: { type: [String], required: true },
    category: { type: String, enum: Object.values(ProductCategory), required: true, trim: true },
    availableSizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual property to calculate total stock
productSchema.virtual('totalStock').get(function (this: IProduct) {
  return this.availableSizes.reduce((total, size) => total + size.stock, 0);
});

// Method to reduce stock
productSchema.methods.reduceStock = async function (size: string, quantity: number): Promise<void> {
  const sizeIndex = this.availableSizes.findIndex((s:any) => s.size === size);
  if (sizeIndex === -1) {
    throw new Error('Invalid size');
  }

  if (this.availableSizes[sizeIndex].stock < quantity) {
    throw new Error('Insufficient stock');
  }

  this.availableSizes[sizeIndex].stock -= quantity;
  await this.save();
};

// Create the Product model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
