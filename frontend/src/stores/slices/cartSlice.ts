import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

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

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

// Fetch cart items
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const response = await api.get('users/cart');
    return response.data.cart;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { productId, size, quantity }: { productId: string; size: string; quantity: number },
    thunkAPI
  ) => {
    try {
      const response = await api.post('users/cart', { productId, size, quantity });
      return response.data.cart;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (
    { productId, size }: { productId: string; size: string },
    thunkAPI
  ) => {
    try {
      const response = await api.delete(`users/cart/${productId}/${size}`);
      return response.data.cart;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

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
      .addCase(fetchCart.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
