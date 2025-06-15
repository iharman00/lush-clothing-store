"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import fetchProducts from "@/sanity/dynamicQueries/fetchProducts";
import { Loader2 } from "lucide-react";
import { InView } from "react-intersection-observer";
import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import { urlFor } from "@/sanity/lib/image";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useQueryState } from "nuqs";

interface ProductsFeedProps {
  parentCategorySlug: string;
  parentProductTypeSlug: string;
}

const ProductsFeed = ({
  parentCategorySlug,
  parentProductTypeSlug,
}: ProductsFeedProps) => {
  // Query state with defaults
  const [colorSlug] = useQueryState("color");
  const [fitSlug] = useQueryState("fit");
  const [sizeSlug] = useQueryState("size");
  const [priceFilter] = useQueryState("price");

  const limit = 12;

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [
        "products",
        parentCategorySlug,
        parentProductTypeSlug,
        colorSlug,
        fitSlug,
        sizeSlug,
        priceFilter,
      ],
      queryFn: ({ pageParam }) => {
        return fetchProducts({
          parentCategorySlug,
          parentProductTypeSlug,
          filters: { colorSlug, fitSlug, sizeSlug, priceFilter },
          id_of_last_product_fetched: pageParam,
          limit,
        });
      },
      initialPageParam: "",
      getNextPageParam: (lastPage) => {
        const lastPageLength = lastPage.length;
        const lastElement = lastPage[lastPageLength - 1];

        const lastElementId = lastElement?._id;

        // last query returns less items than requested means there are no more items to fetch, we return null in this case
        return lastPageLength >= limit ? lastElementId : null;
      },
    });

  // Flatten the pages into a single array
  const products = data?.pages.flat() || [];

  // Loading state for initial data
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-y-16 mt-14">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // No products found
  if (products.length === 0) {
    return (
      <div className="mt-8 px-[1rem] md:px-[2rem]">
        <p className="mt-2 text-xl font-bold text-muted-foreground">
          Sorry, We couldn&apos;t find any results :&#40;
        </p>
      </div>
    );
  }

  // Render products
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-y-16 mt-10 mb-20">
        {products.map((product) => {
          if (
            product.variants[0].sizeAndStock[0].stock &&
            product.variants[0].sizeAndStock[0].stock > 0 &&
            product.variants[0].images &&
            product.variants[0].images[0].alt &&
            product.name &&
            product.price
          ) {
            const productImages: ProductCardProps["images"] =
              product.variants[0].images.map((image) => ({
                _id: image._key,
                url: urlFor(image).url(),
                alt: image.alt!,
              }));

            return (
              <ProductCard
                key={product._id}
                _id={product._id}
                name={product.name}
                price={product.price}
                images={productImages}
                url={`/${parentCategorySlug}/${parentProductTypeSlug}/${product.slug?.current}`}
              />
            );
          }
        })}
      </div>
      <InView
        onChange={(inView) => {
          if (inView && hasNextPage) fetchNextPage();
        }}
      >
        {isFetchingNextPage && (
          <div className="flex justify-center my-20">
            <Loader2 className="h-14 w-14 animate-spin" />
          </div>
        )}
      </InView>
    </>
  );
};

export default ProductsFeed;
