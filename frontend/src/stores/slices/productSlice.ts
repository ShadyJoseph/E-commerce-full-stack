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
  currentProduct: Product | null; // Added currentProduct
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: ProductState = {
  categories: [],
  products: [],
  currentProduct: null, // Initialize currentProduct as null
  loading: false,
  error: null,
};

// Async Thunks for Fetching Data
export const fetchCategories = createAsyncThunk<string[], void, { rejectValue: string }>(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products/categories');
      return data.categories || [];
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch categories.'));
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk<Product[], string, { rejectValue: string }>(
  'products/fetchProductsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products?category=${encodeURIComponent(category)}`);
      return data.products || [];
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, `Failed to fetch products for category: ${category}.`)
      );
    }
  }
);

export const fetchAllProducts = createAsyncThunk<
  Product[],
  { page?: number; limit?: number; sort?: string; category?: string; gender?: 'men' | 'women' | 'unisex' },
  { rejectValue: string }
>(
  'products/fetchAllProducts',
  async ({ page = 1, limit = 10, sort = '-createdAt', category, gender }, { rejectWithValue }) => {
    try {
      const queryParams: Record<string, any> = { page, limit, sort, category, gender };

      // Remove undefined properties
      Object.keys(queryParams).forEach((key) => queryParams[key] === undefined && delete queryParams[key]);

      const { data } = await api.get('/products', { params: queryParams });
      return data.products || [];
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch products.'));
    }
  }
);

export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.product; // Ensure `data.product` is returned by the backend
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, `Failed to fetch product with ID: ${id}.`));
    }
  }
);

// Product Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductState(state) {
      state.products = [];
      state.currentProduct = null;
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
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProduct = null; // Reset currentProduct during loading
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.currentProduct = action.payload; // Store the fetched product
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.payload || 'An error occurred while fetching the product.';
        state.loading = false;
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
