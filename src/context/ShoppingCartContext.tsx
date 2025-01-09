"use client";

import { createContext, ReactNode, useCallback, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ShoppingCartProviderProps {
  children: ReactNode;
}

interface CartItem {
  id: string;
  quantity: number;
}

interface ShoppingCartContext {
  getItem: (id: CartItem["id"]) => CartItem | null;
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  cartQuantity: number;
  cartItems: CartItem[];
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error(
      "useShoppingCart must be used within <ShoppingCartProvider>"
    );
  }
  return context;
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  function getItem(id: string) {
    return cartItems.find((item) => item.id === id) || null;
  }

  const addItem = useCallback(
    (item: CartItem) => {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (cartItem) => cartItem.id === item.id
        );

        // If item does not exist
        if (!existingItem) {
          return [...prevItems, item];
        }

        // Update quantity if item exists
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      });
    },
    [setCartItems]
  );

  const removeItem = useCallback(
    (item: CartItem) => {
      setCartItems((prevItems) => {
        const itemIndex = prevItems.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        // If item does not exist
        if (itemIndex === -1) return prevItems;

        // If item does exist, update that item
        const updatedItems = prevItems.map((cartItem) => {
          if (cartItem.id === item.id) {
            if (cartItem.quantity <= item.quantity) {
              return null; // Remove item from cart
            } else {
              return {
                ...cartItem,
                quantity: cartItem.quantity - item.quantity, // Update quantity
              };
            }
          }
          return cartItem;
        });

        // Filter out null values safely
        return updatedItems.filter(
          (cartItem): cartItem is CartItem => cartItem !== null
        );
      });
    },
    [setCartItems]
  );

  return (
    <ShoppingCartContext.Provider
      value={{
        getItem,
        addItem,
        removeItem,
        cartQuantity,
        cartItems,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
