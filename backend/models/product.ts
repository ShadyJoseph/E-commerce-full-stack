import mongoose, { Document, Schema } from 'mongoose';

// Define an enum for product categories
export enum ProductCategory {
  Kids = 'kids',
  Denim = 'denim',        
  Hoodies = 'hoodies',     
  TShirts = 't-shirts',    
  Shorts = 'shorts',       
  Jackets = 'jackets' 
}

// Define an interface for size and color segments
interface ISize {
  size: string;
  stock: number;
}

interface IColor {
  color: string;
  availableSizes: ISize[];
}

// Define an interface for the Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: ProductCategory;
  rating?: number | null; // Allow null
  discount: number;        // Must be a number
  season?: string; 
  gender?: 'men' | 'women' | 'unisex'; // 'unisex' is the default
  colors: IColor[];
  totalStock: number;
  createdAt: Date;
  updatedAt: Date;
  reduceStock(color: string, size: string, quantity: number): Promise<void>;
}

// Define the product schema
const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    imageUrls: { type: [String], required: true },
    category: { type: String, enum: Object.values(ProductCategory), required: true, trim: true },
    rating: { type: Number, default: null },
    discount: { type: Number, default: 0, min: 0, max: 100 }, 
    season: { type: String },
    gender: { type: String, enum: ['men', 'women', 'unisex'], default: 'unisex' }, 
    colors: [
      {
        color: { type: String, required: true, trim: true },
        availableSizes: [
          {
            size: { type: String, required: true },
            stock: { type: Number, required: true, min: 0 },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to calculate total stock across all colors and sizes
productSchema.virtual('totalStock').get(function (this: IProduct) {
  return this.colors.reduce((total, colorObj) => {
    return total + colorObj.availableSizes.reduce((sizeTotal, size) => sizeTotal + size.stock, 0);
  }, 0);
});

// Method to reduce stock for a specific color and size
productSchema.methods.reduceStock = async function (color: string, size: string, quantity: number): Promise<void> {
  const colorIndex = this.colors.findIndex((c: IColor) => c.color === color); 
  if (colorIndex === -1) {
    throw new Error('Invalid color');
  }

  const sizeIndex = this.colors[colorIndex].availableSizes.findIndex((s: ISize) => s.size === size); 
  if (sizeIndex === -1) {
    throw new Error('Invalid size');
  }

  if (this.colors[colorIndex].availableSizes[sizeIndex].stock < quantity) {
    throw new Error('Insufficient stock');
  }

  this.colors[colorIndex].availableSizes[sizeIndex].stock -= quantity;
  await this.save();
};

// Create the Product model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
