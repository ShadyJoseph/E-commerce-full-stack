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
  rating?: number | null;
  discount: number;
  season?: string;
  gender?: 'men' | 'women' | 'unisex';
  colors: IColor[];
  createdAt: Date;
  updatedAt: Date;
  reduceStock(color: string, size: string, quantity: number): Promise<void>;
  increaseStock(color: string, size: string, quantity: number): Promise<void>;
  checkStockAvailability(color: string, size: string, quantity: number): boolean;
}

// Define the product schema
const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: [100, 'Name is too long'] },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: [500, 'Description is too long'] },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price must be a positive number'] },
    imageUrls: { type: [String], required: true },
    category: { type: String, enum: Object.values(ProductCategory), required: true, trim: true },
    rating: { type: Number, default: null, min: [0, 'Rating cannot be negative'], max: [5, 'Rating cannot exceed 5'] },
    discount: { 
      type: Number, 
      default: 0, 
      min: [0, 'Discount cannot be negative'], 
      max: [100, 'Discount cannot exceed 100%'], 
      validate: {
        validator: (value: number) => value <= 100,
        message: 'Discount cannot exceed 100%'
      }
    },
    season: { type: String },
    gender: { type: String, enum: ['men', 'women', 'unisex'], default: 'unisex' },
    colors: [
      {
        color: { type: String, required: true, trim: true },
        availableSizes: [
          {
            size: { type: String, required: true },
            stock: { type: Number, required: true, min: [0, 'Stock cannot be negative'] },
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

// Indexes for faster search on category and name
productSchema.index({ category: 1 });
productSchema.index({ name: 1 });

// Pre-save hook to validate discount
productSchema.pre('save', function (next) {
  if (this.discount > 100) {
    throw new Error('Discount cannot exceed 100%');
  }
  next();
});

// Virtual property to calculate total stock across all colors and sizes
productSchema.virtual('totalStock').get(function (this: IProduct) {
  return this.colors.reduce((total, colorObj) => {
    return total + colorObj.availableSizes.reduce((sizeTotal, size) => sizeTotal + size.stock, 0);
  }, 0);
});

// Method to reduce stock for a specific color and size
productSchema.methods.reduceStock = async function (color: string, size: string, quantity: number): Promise<void> {
  if (!this.checkStockAvailability(color, size, quantity)) {
    throw new Error('Insufficient stock');
  }

  const colorIndex = this.colors.findIndex((c: IColor) => c.color === color);
  const sizeIndex = this.colors[colorIndex].availableSizes.findIndex((s: ISize) => s.size === size);

  this.colors[colorIndex].availableSizes[sizeIndex].stock -= quantity;
  await this.save();
};

// Method to increase stock for a specific color and size
productSchema.methods.increaseStock = async function (color: string, size: string, quantity: number): Promise<void> {
  const colorIndex = this.colors.findIndex((c: IColor) => c.color === color);
  const sizeIndex = this.colors[colorIndex].availableSizes.findIndex((s: ISize) => s.size === size);

  this.colors[colorIndex].availableSizes[sizeIndex].stock += quantity;
  await this.save();
};

// Helper method to check stock availability
productSchema.methods.checkStockAvailability = function (color: string, size: string, quantity: number): boolean {
  const colorObj = this.colors.find((c: IColor) => c.color === color);
  if (!colorObj) return false;

  const sizeObj = colorObj.availableSizes.find((s: ISize) => s.size === size);
  return sizeObj && sizeObj.stock >= quantity;
};

// Virtual property to calculate discounted price
productSchema.virtual('discountedPrice').get(function (this: IProduct) {
  return this.price * (1 - this.discount / 100);
});


// Create the Product model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
