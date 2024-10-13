import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { IProduct } from './product'; // Import IProduct here

// Define an enum for user roles
export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

// Define the IUser interface extending mongoose's Document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // Explicitly define _id as ObjectId
  googleId?: string;
  displayName: string;
  email: string;
  password?: string;
  role: UserRole; // Use the enum for role
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
  cart?: Array<{
    product: IProduct; // Reference the IProduct type directly
    size: string;
    quantity: number;
  }>;
  wishlist?: mongoose.Schema.Types.ObjectId[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  addAddress(address: { street: string; city: string; state: string; postalCode: string; country: string }): Promise<void>;
  addToCart(productId: string, size: string, quantity: number): Promise<void>; // Method to add to cart
  removeFromCart(productId: string, size: string): Promise<void>; // Method to remove from cart
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
    role: { type: String, enum: Object.values(UserRole), default: UserRole.User }, // Use enum for role
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
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Use IProduct for the product field
        size: { type: String, required: true },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
UserSchema.pre<IUser>('save', async function (next: (err?: CallbackError) => void) {
  if (!this.isModified('password') || !this.password) return next(); // Only hash if modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (error) {
    next(error as CallbackError); // Cast error to CallbackError
  }
});

// Password comparison method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password!);
};

// Method to add an address
UserSchema.methods.addAddress = async function (address: { street: string; city: string; state: string; postalCode: string; country: string }) {
  this.addresses = this.addresses || [];
  this.addresses.push(address);
  await this.save();
};

// Method to add a product to the cart
UserSchema.methods.addToCart = async function (productId: string, size: string, quantity: number) {
  this.cart = this.cart || [];

  const existingItemIndex = this.cart.findIndex((item: { product: mongoose.Types.ObjectId; size: string }) => 
    item.product.toString() === productId && item.size === size
  );

  if (existingItemIndex > -1) {
    this.cart[existingItemIndex].quantity += quantity; // Increment quantity
  } else {
    this.cart.push({ product: new mongoose.Types.ObjectId(productId), size, quantity });
  }

  await this.save();
};

// Method to remove a product from the cart
UserSchema.methods.removeFromCart = async function (productId: string, size: string) {
  this.cart = this.cart?.filter((item: { product: mongoose.Types.ObjectId; size: string }) => 
    !(item.product.toString() === productId && item.size === size)
  );
  
  await this.save();
};

// Create and export the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
