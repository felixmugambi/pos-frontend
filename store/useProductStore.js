import { create } from 'zustand';
import { api } from '@/lib/api';

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  searchProducts: async (query) => {
    try {
      set({ loading: true });

      const data = await api.searchProducts(query);

      set({
        products: data.products,
        loading: false
      });

    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  }
}));