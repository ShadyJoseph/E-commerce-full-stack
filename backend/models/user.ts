import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import Product from './product';

// Define an enum for user roles
export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

// Define the CartItem interface for cart items
interface CartItem {
  product: mongoose.Types.ObjectId;
  size: string;
  quantity: number;
  price: number;
}

// Define Address Interface
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Define the IUser interface extending mongoose's Document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  googleId?: string;
  provider?: string;
  displayName: string;
  email: string;
  password?: string;
  role: UserRole;
  addresses?: Address[];
  cart?: CartItem[];
  wishlist?: mongoose.Types.ObjectId[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  addAddress(address: Address): Promise<void>;
  addToCart(productId: mongoose.Types.ObjectId, size: string, quantity: number): Promise<void>;
  removeFromCart(productId: mongoose.Types.ObjectId, size: string): Promise<void>;
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    googleId: { type: String },
    provider:{type : String},
    displayName: { type: String, required: [true, 'Display name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: 'Please enter a valid email',
      },
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.googleId; // Password required if not signing up via Google
      },
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.User },
    addresses: {
      type: [
        {
          street: { type: String },
          city: { type: String },
          state: { type: String },
          postalCode: { type: String },
          country: { type: String },
        },
      ],
      default: [],
    },
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }  // New field for discounted price
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Method to compare password with hashed password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password || '');
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
  return await bcrypt.compare(password, this.password || '');
};

// Method to add an address
UserSchema.methods.addAddress = async function (address: Address): Promise<void> {
  this.addresses?.push(address);
  await this.save();
};

UserSchema.methods.addToCart = async function (productId: mongoose.Types.ObjectId, size: string, quantity: number): Promise<void> {
  const product = await Product.findById(productId).lean();
  if (!product) {
    throw new Error('Product not found');
  }

  const discountedPrice = product.price * (1 - product.discount / 100);

  const itemIndex = this.cart?.findIndex(
    (item: CartItem) => item.product.toString() === productId.toString() && item.size === size
  ) ?? -1;

  if (itemIndex > -1) {
    // Update quantity if the item is already in the cart
    this.cart![itemIndex].quantity += quantity;
  } else {
    // Add new item to the cart with the discounted price
    this.cart?.push({
      product: productId,
      size,
      quantity,
      price: discountedPrice, // Add discounted price to the cart item
    });
  }

  // Make sure to save changes to the database
  await this.save();
};

// Method to remove an item from the cart
UserSchema.methods.removeFromCart = async function (productId: mongoose.Types.ObjectId, size: string): Promise<void> {
  this.cart = this.cart?.filter((item: CartItem) => !(item.product.toString() === productId.toString() && item.size === size)) ?? [];
  await this.save();
};

// Export the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
