import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import { extractErrorMessage } from '../../utils/errorHandler';

// Define CartItem and CartState interfaces
interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrls: string[];
    category: string;
  };
  size: string;
  quantity: number;
  _id: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

// Initial State
const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};


// Async Thunks
// Fetch Cart Items
export const fetchCart = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('users/cart');
      return response.data.cart;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch cart'));
    }
  }
);

// Add to Cart
export const addToCart = createAsyncThunk<
  CartItem[],
  { productId: string; size: string; quantity: number },
  { rejectValue: string }
>('cart/addToCart', async ({ productId, size, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.post('users/cart', { productId, size, quantity });
    return response.data.cart;
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to add item to cart'));
  }
});

// Remove from Cart
export const removeFromCart = createAsyncThunk<
  CartItem[],
  { productId: string; size: string },
  { rejectValue: string }
>('cart/removeFromCart', async ({ productId, size }, { rejectWithValue }) => {
  try {
    const response = await api.delete(`users/cart/${productId}/${size}`);
    return response.data.cart;
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to remove item from cart'));
  }
});

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Unexpected error occurred while fetching cart.';
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Unexpected error occurred while adding to cart.';
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Unexpected error occurred while removing from cart.';
      });
  },
});

// Export actions and reducer
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
