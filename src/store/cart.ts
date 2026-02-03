import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Medicine } from '@/types';

interface CartState {
  items: CartItem[];
  addToCart: (medicine: Medicine, quantity: number) => void;
  removeFromCart: (medicineId: number) => void;
  updateQuantity: (medicineId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (medicine, quantity) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.medicine.id === medicine.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.medicine.id === medicine.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { medicine, quantity }],
          };
        });
      },

      removeFromCart: (medicineId) => {
        set((state) => ({
          items: state.items.filter((item) => item.medicine.id !== medicineId),
        }));
      },

      updateQuantity: (medicineId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(medicineId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.medicine.id === medicineId ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.medicine.price * item.quantity,
          0,
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
