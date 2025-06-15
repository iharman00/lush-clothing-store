import fetchProductVariant from "@/sanity/dynamicQueries/fetchProductVariant";
import { urlFor } from "@/sanity/lib/image";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  variantId: string;
  variantSizeId: string;
  name: string;
  color: string;
  size: string;
  image: {
    _id: string;
    url: string;
    alt: string;
  };
  price: number;
  quantity: number;
  url: string;
}

interface CartStore {
  items: {
    [key: string]: CartItem;
  };
  addItem: (cartItem: Omit<CartItem, "quantity">) => void;
  removeItem: (
    cartItem: Pick<CartItem, "productId" | "variantId" | "variantSizeId">
  ) => void;
  setItemCount: (
    cartItem: Pick<
      CartItem,
      "productId" | "variantId" | "variantSizeId" | "quantity"
    >
  ) => void;
  clearCart: () => void;
  refreshCartItems: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (newItem) =>
        set((state) => {
          const key = `${newItem.productId}-${newItem.variantId}-${newItem.variantSizeId}`;
          const existingItem = state.items[key];
          let updatedItems = { ...state.items };

          // If cartItem exists increase quantity
          if (existingItem) {
            updatedItems[key].quantity = existingItem.quantity + 1;
          } else {
            // else add the cartItem to the state
            updatedItems[key] = {
              ...newItem,
              quantity: 1,
            };
          }

          return {
            items: updatedItems,
          };
        }),
      removeItem: (cartItem) =>
        set((state) => {
          const key = `${cartItem.productId}-${cartItem.variantId}-${cartItem.variantSizeId}`;
          const existingItem = state.items[key];
          let updatedItems = { ...state.items };

          // If cartItem doesn't exist, return existing state
          if (!existingItem) {
            return state;
          }

          // Else remove the cartItem
          delete updatedItems[key];
          return {
            items: updatedItems,
          };
        }),
      setItemCount: (cartItem) =>
        set((state) => {
          const key = `${cartItem.productId}-${cartItem.variantId}-${cartItem.variantSizeId}`;
          const existingItem = state.items[key];
          let updatedItems = { ...state.items };

          // If cartItem doesn't exist, return existing state
          if (!existingItem) {
            return state;
          }

          // if quantity is less than or equal to 0, remove the cartItem
          if (cartItem.quantity <= 0) {
            delete updatedItems[key];
          } else {
            // else update the quantity
            updatedItems[key].quantity = cartItem.quantity;
          }

          return {
            items: updatedItems,
          };
        }),
      clearCart: () =>
        set(() => ({
          items: {},
        })),
      refreshCartItems: async () => {
        const items = Object.entries(get().items);

        // If there are no items in local storage set items to be empty
        if (items.length === 0)
          return {
            items: {},
          };

        const newCartItems: CartStore["items"] = {};
        const fetchPromises = [];

        for (const [key, cartItem] of items) {
          fetchPromises.push(
            fetchProductVariant({
              productId: cartItem.productId,
              variantId: cartItem.variantId,
              sizeId: cartItem.variantSizeId,
            }).then((item) => {
              if (
                !item?.variant ||
                !item.variant.sizeAndStock?.length ||
                !item.variant.images?.length
              ) {
                console.warn("Invalid cart item fetched:", item);
                return; // skip this item
              }

              const sizeStock = item.variant.sizeAndStock[0];
              const image = item.variant.images[0];

              newCartItems[key] = {
                productId: item._id,
                variantId: item.variant._key,
                variantSizeId: sizeStock.size._id,
                name: item.name,
                color: item.variant.color?.name || "Unknown",
                size: sizeStock.size?.name || "Unknown",
                image: {
                  _id: image._key!,
                  url: urlFor(image).url(),
                  alt: image.alt || "Product image",
                },
                price: cartItem.price,
                quantity: cartItem.quantity,
                url: cartItem.url,
              };
            })
          );
        }

        await Promise.all(fetchPromises);

        set({
          items: newCartItems,
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Refresh products on app start to avoid using stale product data
useCart.getState().refreshCartItems();
