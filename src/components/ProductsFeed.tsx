"use client";

import fetchProducts, {
  fetchProductsReturnType,
} from "@/sanity/dynamicQueries/fetchProducts";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
  const [products, setProducts] = useState<fetchProductsReturnType>([]);
  const [loadingInitialProducts, setLoadingInitialProducts] = useState(true);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);

  const [colorSlug] = useQueryState("color");
  const [fitSlug] = useQueryState("fit");
  const [sizeSlug] = useQueryState("size");
  const [priceFilter] = useQueryState("price");

  useEffect(() => {
    const getProducts = async () => {
      setLoadingInitialProducts(true);
      const products = await fetchProducts({
        parentCategorySlug: parentCategorySlug,
        parentProductTypeSlug: parentProductTypeSlug,
        filters: {
          colorSlug,
          fitSlug,
          sizeSlug,
          priceFilter,
        },
        number_of_products_to_fetch: 8,
      });
      setProducts(products);
      setLoadingInitialProducts(false);
    };

    getProducts();
  }, [
    parentCategorySlug,
    parentProductTypeSlug,
    colorSlug,
    fitSlug,
    sizeSlug,
    priceFilter,
  ]);

  // Load more products on scroll
  const loadMoreProducts = useCallback(async () => {
    const lastProduct = products[products.length - 1];

    if (!lastProduct || loadingMoreProducts) return;

    setLoadingMoreProducts(true);
    const newProducts = await fetchProducts({
      parentCategorySlug: parentCategorySlug,
      parentProductTypeSlug: parentProductTypeSlug,
      filters: {
        colorSlug,
        fitSlug,
        sizeSlug,
        priceFilter,
      },
      number_of_products_to_fetch: 24,
      id_of_last_product_fetched: lastProduct._id,
    });
    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setLoadingMoreProducts(false);
  }, [
    products,
    loadingMoreProducts,
    parentCategorySlug,
    parentProductTypeSlug,
    colorSlug,
    fitSlug,
    sizeSlug,
    priceFilter,
  ]);

  // Show skeletons while the initial products are loading
  if (loadingInitialProducts)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-y-16 mt-14">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );

  // If there are products to show
  if (products.length > 0)
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-y-16 mt-10 mb-20">
          {products.map((product) => {
            if (
              product.colorVariants[0].sizeAndStock[0].stock &&
              product.colorVariants[0].sizeAndStock[0].stock > 0 &&
              product.colorVariants[0].images &&
              product.colorVariants[0].images[0].alt &&
              product.name &&
              product.price
            ) {
              let productImages: ProductCardProps["images"] = [];

              // Get the images of the first coloVariant
              product.colorVariants[0].images.map((image) => {
                if (image.alt)
                  productImages.push({
                    _id: image._key,
                    url: urlFor(image).url(),
                    alt: image.alt,
                  });
              });

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
            if (inView) loadMoreProducts();
          }}
        >
          {loadingMoreProducts && (
            <div className="flex justify-center my-20">
              <Loader2 className="h-14 w-14 animate-spin" />
            </div>
          )}
        </InView>
      </>
    );

  // If there are no products to show
  if (products.length === 0)
    return (
      <div className="mt-6 px-[1rem] md:px-[2rem]">
        <p className="mt-2 text-sm md:text-base">
          There are no products to show for the selected category!
        </p>
      </div>
    );
};

export default ProductsFeed;
