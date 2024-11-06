import ProductsFeed from "@/components/ProductsFeed";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchProductColors,
  fetchProductFits,
  fetchProductSizes,
} from "@/sanity/staticQueries";
import fetchProductTypes from "@/sanity/dynamicQueries/fetchProductTypes";
import Link from "next/link";
import fetchCategoryData from "@/sanity/dynamicQueries/fetchCategoryData";
import ProductsFilter from "@/components/ProductsFilter";

const page = async ({
  params,
}: {
  params: { category: string; productType: string };
}) => {
  const categorySlug = params.category.toLowerCase();
  const productTypeSlug = params.productType.toLowerCase();

  // Fetch category, and productType concurrently
  const [[category], [productType]] = await Promise.all([
    fetchCategoryData({ categorySlug }),
    fetchProductTypes({ productTypeSlug }),
  ]);

  if (!category || !productType)
    return (
      <section className="container text-center flex flex-col justify-center items-center gap-2 my-20">
        <h1 className="text-4xl md:text-5xl font-bold">Page not found.</h1>
        <p className="mt-2 text-sm md:text-base">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className={cn(buttonVariants(), "mt-4 w-fit")}>
          Go Back Home
        </Link>
      </section>
    );

  // Fetch product colors, fits, and sizes concurrently
  const [productColors, productSizes, productFits] = await Promise.all([
    fetchProductColors(),
    fetchProductSizes(),
    fetchProductFits(),
  ]);

  return (
    <section className="container my-5 lg:my-14 px-0">
      <h1 className="text-4xl font-semibold px-[1rem] md:px-[2rem]">{`${category.name}'s ${productType.name}`}</h1>
      <ProductsFilter
        filtersData={{
          colors: productColors,
          sizes: productSizes,
          fits: productFits,
        }}
      />
      <ProductsFeed
        parentCategorySlug={categorySlug}
        parentProductTypeSlug={productTypeSlug}
      />
    </section>
  );
};

export default page;
