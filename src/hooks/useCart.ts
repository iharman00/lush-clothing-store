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
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.productVariantId === item.productVariantId
          );

          if (existingItem) {
            if (existingItem.quantity > item.quantity) {
              // If the cart item quantity is greater, reduce the quantity
              return {
                items: state.items.map((cartItem) =>
                  cartItem.productVariantId === existingItem.productVariantId
                    ? {
                        ...cartItem,
                        quantity: cartItem.quantity - item.quantity,
                      }
                    : cartItem
                ),
              };
            } else {
              // If the cart Item quantity is less than or equal, remove the item completely
              return {
                items: state.items.filter(
                  (cartItem) =>
                    cartItem.productVariantId !== item.productVariantId
                ),
              };
            }
          }

          return state; // Return state unchanged if item not found
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // The key used for persistent storage in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);
