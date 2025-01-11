import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  variantSizeId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  itemsCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  deleteItem: (itemId: CartItem["variantId"]) => void;
  getItem: (item: Omit<CartItem, "quantity">) => CartItem | null;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemsCount: 0, // Initialize as 0
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.variantId === newItem.variantId
          );

          let updatedItems;
          if (existingItem) {
            // If the item exists, update its quantity
            updatedItems = state.items.map((cartItem) =>
              cartItem.variantId === existingItem.variantId
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
            itemsCount: updatedItems.reduce(
              (total, item) => total + item.quantity,
              0
            ), // Recalculate total count
          };
        }),
      removeItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.variantId === item.variantId
          );

          if (existingItem) {
            let updatedItems;
            if (existingItem.quantity > item.quantity) {
              // Reduce quantity if more than the item to remove
              updatedItems = state.items.map((cartItem) =>
                cartItem.variantId === existingItem.variantId
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity - item.quantity,
                    }
                  : cartItem
              );
            } else {
              // Remove item completely if quantity is less or equal
              updatedItems = state.items.filter(
                (cartItem) => cartItem.variantId !== item.variantId
              );
            }

            return {
              items: updatedItems,
              itemsCount: updatedItems.reduce(
                (total, item) => total + item.quantity,
                0
              ), // Recalculate total count
            };
          }

          return state;
        }),
      deleteItem: (itemId) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (cartItem) => cartItem.variantId !== itemId
          );

          return {
            items: updatedItems,
            itemsCount: updatedItems.reduce(
              (total, item) => total + item.quantity,
              0
            ), // Recalculate total count
          };
        }),
      getItem: (item) => {
        const items = get().items;
        for (const cartItem of items) {
          if (
            cartItem.variantId === item.variantId &&
            cartItem.variantSizeId === item.variantSizeId
          )
            return cartItem;
        }
        return null;
      },
      clearCart: () =>
        set(() => ({
          items: [],
          itemsCount: 0, // Reset to 0
        })),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
