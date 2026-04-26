import { create } from 'zustand';
import { api } from '@/lib/api';
import { useCartStore } from './useCartStore';

export const useSalesStore = create((set) => ({
  loading: false,
  error: null,

  createSale: async (payment_method) => {
    try {
      set({ loading: true, error: null });
  
      const cart = useCartStore.getState().cart;
  
      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));
  
  
      const data = await api.createSale({
        payment_method,
        items
      });
  
      set({ loading: false });
  
      return data;
  
    } catch (err) {
      console.log("SALE ERROR:", err.message);
  
      set({
        error: err.message,
        loading: false
      });
  
      return { success: false, error: err.message };
    }
  }
}));