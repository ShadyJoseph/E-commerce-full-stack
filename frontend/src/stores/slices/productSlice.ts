import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  rating?: number;
  discount: number;
  season?: string;
  gender?: 'men' | 'women' | 'unisex';
  colors: Array<{
    color: string;
    availableSizes: Array<{ size: string; stock: number }>;
  }>;
}

interface ProductState {
  categories: string[];
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  categories: [],
  products: [],
  loading: false,
  error: null,
};

// Async Thunks for fetching data
export const fetchCategories = createAsyncThunk<string[], void, { rejectValue: string }>(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('products/categories');
      return response.data.categories || []; // Fallback if no categories are returned
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchAllProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return response.data.products || []; // Fallback if no products are returned
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload || 'An unexpected error occurred while fetching categories.';
        state.loading = false;
      })

      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.error = action.payload || 'An unexpected error occurred while fetching products.';
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
