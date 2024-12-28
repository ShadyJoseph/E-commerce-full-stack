import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import { extractErrorMessage } from '../../utils/errorHandler';

export interface Product {
  _id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  rating?: number;
  discount: number;
  season?: string;
  gender?: 'men' | 'women' | 'unisex';
  colors: { color: string; availableSizes: { size: string; stock: number }[] }[];
}

export interface ProductState {
  categories: string[];
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: ProductState = {
  categories: [],
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

// Helper function to handle async thunk states
const handlePending = (state: ProductState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: ProductState, action: any) => {
  state.loading = false;
  state.error = action.payload || 'An error occurred.';
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

// Thunk for Fetching Product by ID
export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      // API call to fetch product by ID
      const { data } = await api.get(`/products/${id}`);
      if (!data.product) {
        throw new Error('No product data returned from the server.');
      }
      return data.product; // Return the product for the fulfilled case
    } catch (error) {
      console.error(`Error fetching product by ID: ${id}`, error); // Add debug info
      return rejectWithValue(
        extractErrorMessage(
          error,
          `Failed to fetch product with ID: ${id}. Please try again later.`
        )
      );
    }
  }
);


// Product Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductState(state) {
      state.categories = [];
      state.products = [];
      state.currentProduct = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, handlePending)
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, handleRejected)

      // Fetch All Products
      .addCase(fetchAllProducts.pending, handlePending)
      .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProducts.rejected, handleRejected)

      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, handlePending)
      .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, handleRejected)

      // Slice Reducer for Fetch Product by ID
      .addCase(fetchProductById.pending, handlePending)
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.currentProduct = action.payload; // Assign the fetched product
        state.loading = false; // Clear loading state
        state.error = null; // Clear previous errors, if any
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false; // Stop loading
        state.error = action.payload || 'An unexpected error occurred while fetching the product.'; // Handle rejection
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
