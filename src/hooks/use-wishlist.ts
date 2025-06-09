import fetchProductVariant from "@/sanity/dynamicQueries/fetchProductVariant";
import { urlFor } from "@/sanity/lib/image";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface WishlistItem {
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

interface WishlistStore {
  items: {
    [key: string]: WishlistItem;
  };
  addItem: (item: Omit<WishlistItem, "quantity">) => void;
  removeItem: (
    item: Pick<WishlistItem, "productId" | "variantId" | "variantSizeId">
  ) => void;
  setItemCount: (
    item: Pick<
      WishlistItem,
      "productId" | "variantId" | "variantSizeId" | "quantity"
    >
  ) => void;
  clearWishlist: () => void;
  refreshWishlistItems: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (newItem) =>
        set((state) => {
          const key = `${newItem.productId}-${newItem.variantId}-${newItem.variantSizeId}`;
          const existingItem = state.items[key];
          let updatedItems = { ...state.items };

          // If item exists increase quantity
          if (existingItem) {
            updatedItems[key].quantity = existingItem.quantity + 1;
          } else {
            // else add the item to the state
            updatedItems[key] = {
              ...newItem,
              quantity: 1,
            };
          }

          return {
            items: updatedItems,
          };
        }),
      removeItem: (item) =>
        set((state) => {
          const key = `${item.productId}-${item.variantId}-${item.variantSizeId}`;
          const existingItem = state.items[key];
          let updatedItems = { ...state.items };

          // If item doesn't exist, return existing state
          if (!existingItem) {
            return state;
          }

          // Else remove the item
          delete updatedItems[key];
          return {
            items: updatedItems,
          };
        }),
      setItemCount: (item) =>
        set((state) => {
          const key = `${item.productId}-${item.variantId}-${item.variantSizeId}`;
          const existingItem = state.items[key];
          let updatedItems = { ...state.items };

          // If item doesn't exist, return existing state
          if (!existingItem) {
            return state;
          }

          // if quantity is less than or equal to 0, remove the item
          if (item.quantity <= 0) {
            delete updatedItems[key];
          } else {
            // else update the quantity
            updatedItems[key].quantity = item.quantity;
          }

          return {
            items: updatedItems,
          };
        }),
      clearWishlist: () =>
        set(() => ({
          items: {},
        })),
      refreshWishlistItems: async () => {
        const items = Object.entries(get().items);

        // If there are no items in local storage set items to be empty
        if (items.length === 0)
          return {
            items: {},
          };

        const newCartItems: WishlistStore["items"] = {};
        const fetchPromises = [];

        for (const [key, item] of items) {
          fetchPromises.push(
            fetchProductVariant({
              productId: item.productId,
              variantId: item.variantId,
              sizeId: item.variantSizeId,
            }).then(([variant]) => {
              newCartItems[key] = {
                productId: variant.parentProduct._id,
                variantId: variant._id,
                variantSizeId: variant.sizeAndStock[0].size._id,
                name: variant.parentProduct.name!,
                color: variant.color.name!,
                size: variant.sizeAndStock[0].size.name!,
                image: {
                  _id: variant.images![0]._key!,
                  url: urlFor(variant.images![0]).url(),
                  alt: variant.images![0].alt!,
                },
                price: item.price,
                quantity: item.quantity,
                url: item.url,
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
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Refresh products on app start to avoid using stale product data
useWishlist.getState().refreshWishlistItems();
