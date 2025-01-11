import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  variantSizeId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  deleteItem: (item: Pick<CartItem, "variantId" | "variantSizeId">) => void;
  getItem: (
    item: Pick<CartItem, "variantId" | "variantSizeId">
  ) => CartItem | null;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Add an item to the cart
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) =>
              cartItem.variantId === newItem.variantId &&
              cartItem.variantSizeId === newItem.variantSizeId
          );

          let updatedItems;
          if (existingItem) {
            // If the item exists, update its quantity
            updatedItems = state.items.map((cartItem) =>
              cartItem.variantId === existingItem.variantId &&
              cartItem.variantSizeId === existingItem.variantSizeId
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + newItem.quantity,
                  }
                : cartItem
            );
          } else {
            // If the item doesn't exist, add it to the cart
            updatedItems = [...state.items, newItem];
          }

          return {
            items: updatedItems,
          };
        }),

      // Remove some quantity of an item or delete it if the quantity is zero
      removeItem: (item) =>
        set((state) => {
          const updatedItems = state.items
            .map((cartItem) => {
              if (
                cartItem.variantId === item.variantId &&
                cartItem.variantSizeId === item.variantSizeId
              ) {
                const newQuantity = cartItem.quantity - item.quantity;
                if (newQuantity <= 0) {
                  return null; // Mark item for removal
                } else {
                  return { ...cartItem, quantity: newQuantity }; // Update quantity
                }
              }
              return cartItem; // Keep other items unchanged
            })
            .filter((cartItem) => cartItem !== null); // Remove nulls (items that should be deleted)

          return {
            items: updatedItems,
          };
        }),

      // Delete an item from the cart completely
      deleteItem: (item) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (cartItem) =>
              cartItem.variantId !== item.variantId ||
              cartItem.variantSizeId !== item.variantSizeId
          );

          return {
            items: updatedItems,
          };
        }),

      // Get a specific item from the cart
      getItem: (item) => {
        return (
          get().items.find(
            (cartItem) =>
              cartItem.variantId === item.variantId &&
              cartItem.variantSizeId === item.variantSizeId
          ) || null
        );
      },

      // Clear the entire cart
      clearCart: () =>
        set(() => ({
          items: [],
        })),
    }),
    {
      name: "cart-storage", // key for localStorage
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);
