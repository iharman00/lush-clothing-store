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
  addItem: (wishlistItem: Omit<WishlistItem, "quantity">) => void;
  removeItem: (
    wishlistItem: Pick<
      WishlistItem,
      "productId" | "variantId" | "variantSizeId"
    >
  ) => void;
  setItemCount: (
    wishlistItem: Pick<
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

          // If wishlistItem exists increase quantity
          if (existingItem) {
            updatedItems[key].quantity = existingItem.quantity + 1;
          } else {
            // else add the wishlistItem to the state
            updatedItems[key] = {
              ...newItem,
              quantity: 1,
            };
          }

          return {
            items: updatedItems,
          };
        }),
      removeItem: (wishlistItem) =>
        set((state) => {
          const key = `${wishlistItem.productId}-${wishlistItem.variantId}-${wishlistItem.variantSizeId}`;
          const existingItem = state.items[key];
          let updatedItems = { ...state.items };

          // If wishlistItem doesn't exist, return existing state
          if (!existingItem) {
            return state;
          }

          // Else remove the wishlistItem
          delete updatedItems[key];
          return {
            items: updatedItems,
          };
        }),
      setItemCount: (wishlistItem) =>
        set((state) => {
          const key = `${wishlistItem.productId}-${wishlistItem.variantId}-${wishlistItem.variantSizeId}`;
          const existingItem = state.items[key];
          let updatedItems = { ...state.items };

          // If wishlistItem doesn't exist, return existing state
          if (!existingItem) {
            return state;
          }

          // if quantity is less than or equal to 0, remove the wishlistItem
          if (wishlistItem.quantity <= 0) {
            delete updatedItems[key];
          } else {
            // else update the quantity
            updatedItems[key].quantity = wishlistItem.quantity;
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

        for (const [key, wishlistItem] of items) {
          fetchPromises.push(
            fetchProductVariant({
              productId: wishlistItem.productId,
              variantId: wishlistItem.variantId,
              sizeId: wishlistItem.variantSizeId,
            }).then((item) => {
              const variant = item.variants && item.variants[0];
              const sizeStock =
                variant?.sizeAndStock && variant.sizeAndStock[0];
              const image = variant?.images && variant.images[0];

              if (!variant || !sizeStock || !image) {
                // Skip this item if required data is missing
                return;
              }

              newCartItems[key] = {
                productId: item._id,
                variantId: variant._key,
                variantSizeId: sizeStock.size._id,
                name: item.name,
                color: variant.color?.name || "Unknown",
                size: sizeStock.size?.name || "Unknown",
                image: {
                  _id: image._key!,
                  url: urlFor(image).url(),
                  alt: image.alt || "Product image",
                },
                price: item.price,
                quantity: wishlistItem.quantity,
                url: wishlistItem.url,
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
