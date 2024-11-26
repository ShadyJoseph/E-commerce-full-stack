import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import { extractErrorMessage } from '../../utils/errorHandler';
export interface Product {
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

export interface ProductState {
  categories: string[];
  products: Product[];
  loading: boolean;
  error: string | null;
}
// Initial State
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
      const { data } = await api.get('/products/categories');
      return data.categories || []; // Fallback if no categories are returned
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch categories.'));
    }
  }
);

export const fetchAllProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products');
      return data.products || []; // Fallback if no products are returned
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch products.'));
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk<Product[], string, { rejectValue: string }>(
  'products/fetchProductsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products?category=${encodeURIComponent(category)}`);
      return data.products || []; // Fallback if no products are returned
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, `Failed to fetch products for category: ${category}.`));
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Optional: Add reducers for managing local state (e.g., filter management)
    clearProductState(state) {
      state.products = [];
      state.error = null;
      state.loading = false;
    },
  },
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
        state.error = action.payload || 'An error occurred while fetching categories.';
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
        state.error = action.payload || 'An error occurred while fetching products.';
        state.loading = false;
      })

      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.error = action.payload || 'An error occurred while fetching products by category.';
        state.loading = false;
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
