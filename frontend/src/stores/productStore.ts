import api from '../api/axiosConfig';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface ProductCategory {
  name: string;
}

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

interface ProductStore {
  categories: string[];
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  fetchAllProducts: () => Promise<void>;
}

// Define persist options to type the middleware correctly
const useProductStore = create<ProductStore, [['zustand/persist', ProductStore]]>(
  persist(
    (set) => ({
      categories: [],
      products: [],
      loading: false,
      error: null,

      // Fetch product categories
      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('products/categories');
          set({ categories: response.data.categories, loading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch categories', loading: false });
        }
      },

      // Fetch all products
      fetchAllProducts: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('/products');
          set({ products: response.data.products, loading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch products', loading: false });
        }
      },
    }),
    {
      name: 'product-store', // Key for localStorage
      storage: {
        getItem: (key) => {
          const storedValue = localStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      }, // Custom storage with serialization/deserialization
    } as PersistOptions<ProductStore>
  )
);

export default useProductStore;
