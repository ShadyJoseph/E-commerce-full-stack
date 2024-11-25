import api from '../api/axiosConfig';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

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

const customStorage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

const useProductStore = create<ProductStore, [['zustand/persist', ProductStore]]>(
  persist(
    (set) => ({
      categories: [],
      products: [],
      loading: false,
      error: null,

      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('products/categories');
          set({ categories: response.data.categories, loading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch categories', loading: false });
        }
      },

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
      name: 'product-store',
      storage: customStorage, // Use custom storage wrapper
    } as PersistOptions<ProductStore>
  )
);

export default useProductStore;
