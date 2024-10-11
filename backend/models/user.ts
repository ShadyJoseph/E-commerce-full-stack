import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator'; // Import validator for email validation

export interface IUser extends Document {
  googleId?: string;
  displayName: string;
  email?: string;
  role: string; // 'user', 'admin', etc.
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
  cart?: Array<{
    productId: mongoose.Schema.Types.ObjectId;
    size: string;
    quantity: number;
  }>;
  wishlist?: mongoose.Schema.Types.ObjectId[]; // List of product IDs
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    googleId: { type: String },
    displayName: { type: String, required: [true, 'Display name is required'] },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'Please enter a valid email',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Enforce specific roles
      default: 'user',
    },
    addresses: [
      {
        street: { type: String, required: [true, 'Street is required'] },
        city: { type: String, required: [true, 'City is required'] },
        state: { type: String, required: [true, 'State is required'] },
        postalCode: { type: String, required: [true, 'Postal code is required'] },
        country: { type: String, required: [true, 'Country is required'] },
      },
    ],
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        size: { type: String, required: true }, // User must choose a size
        quantity: { type: Number, default: 1, min: 1 }, // Enforce minimum quantity
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
