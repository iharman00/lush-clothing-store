"use client";

import CategoriesCard from "@/components/CategoriesCard";
import { useWishlist } from "@/hooks/use-wishlist";
import Link from "next/link";

export default function Page() {
  const wishlistItems = Object.values(useWishlist((state) => state.items));
  return (
    <div className="container mt-20 mb-28">
      <div className="mb-14 flex items-center gap-2">
        <h1 className="text-4xl md:text-5xl xl:text-7xl font-light tracking-wide uppercase">
          Your Wishlist
        </h1>
      </div>
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-8 gap-1">
          {wishlistItems.map((item) => {
            return (
              <Link
                key={`${item.variantId}-${item.variantSizeId}`}
                href={item.url}
              >
                <CategoriesCard
                  image={{
                    url: item.image.url,
                    alt: item.image.alt,
                  }}
                  title={`${item.name} - ${item.color} ${item.size}`}
                  className="w-full lg:w-full h-full aspect-[3/4] rounded-none text-sm md:text-base"
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-1">
          <p className="text-xl font-semibold">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground">
            Add items to your wishlist to save for later
          </p>
        </div>
      )}
    </div>
  );
}
