import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { IProduct } from './product'; // Import IProduct here

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
}

// Define the IUser interface extending mongoose's Document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  googleId?: string;
  displayName: string;
  email: string;
  password?: string;
  role: UserRole;
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
  cart?: CartItem[];  // Use CartItem interface
  wishlist?: mongoose.Schema.Types.ObjectId[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  addAddress(address: { street: string; city: string; state: string; postalCode: string; country: string }): Promise<void>;
  addToCart(productId: string, size: string, quantity: number): Promise<void>;
  removeFromCart(productId: string, size: string): Promise<void>;
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    googleId: { type: String },
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
      validate: {
        validator: function (this: IUser, password: string) {
          return this.googleId || validator.isLength(password, { min: 8 });
        },
        message: 'Password should have at least 8 characters',
      },
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
};

// Method to add an address
UserSchema.methods.addAddress = async function (address: { street: string; city: string; state: string; postalCode: string; country: string }): Promise<void> {
  this.addresses?.push(address);
  await this.save();
};

// Method to add an item to the cart
UserSchema.methods.addToCart = async function (productId: string, size: string, quantity: number): Promise<void> {
  const itemIndex = this.cart?.findIndex((item: CartItem) => 
    item.product.toString() === productId && item.size === size
  ) ?? -1; // Use CartItem type for item
  
  if (itemIndex > -1) {
    // Update quantity if the item is already in the cart
    this.cart![itemIndex].quantity += quantity;
  } else {
    // Add new item to the cart
    this.cart?.push({ product: productId, size, quantity });
  }
  
  await this.save();
};

// Method to remove an item from the cart
UserSchema.methods.removeFromCart = async function (productId: string, size: string): Promise<void> {
  this.cart = this.cart?.filter((item: CartItem) => 
    !(item.product.toString() === productId && item.size === size)
  ) ?? []; // Use CartItem type for item
  await this.save();
};

// Export the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
