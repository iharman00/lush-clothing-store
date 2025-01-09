import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productVariantId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          // Check if the item already exists in the cart
          const existingItem = state.items.find(
            (cartItem) => cartItem.productVariantId === newItem.productVariantId
          );

          if (existingItem) {
            // If the item exists, update its quantity
            return {
              items: state.items.map((cartItem) =>
                cartItem.productVariantId === existingItem.productVariantId
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + newItem.quantity,
                    }
                  : cartItem
              ),
            };
          }

          // If the item doesn't exist, add it to the cart
          return { items: [...state.items, newItem] };
        }),
      removeItem: (item) =>
        set((state) => ({
          items: state.items.filter(
            (cartItem) => cartItem.productVariantId !== item.productVariantId
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // The key used for persistent storage in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);
