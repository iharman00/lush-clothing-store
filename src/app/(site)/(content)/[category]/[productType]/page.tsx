import ProductsFeed from "@/components/ProductsFeed";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchProductColors,
  fetchProductFits,
  fetchProductSizes,
} from "@/sanity/staticQueries";
import fetchProductTypes, {
  fetchProductTypesReturnType,
} from "@/sanity/dynamicQueries/fetchProductTypes";
import Link from "next/link";
import fetchCategoryData, {
  fetchCategoryDataReturnType,
} from "@/sanity/dynamicQueries/fetchCategoryData";
import ProductsFilter, { FilterOption } from "@/components/ProductsFilter";
import { Color, Slug } from "@/sanity/types";
import { priceFilters } from "@/sanity/dynamicQueries/fetchProducts";

// Helper function to create options array to pass to ProductsFilter
type CreateOptionsType = {
  items: {
    _id: string;
    name: string | null;
    slug: Slug | null;
    color?: Color | null;
  }[];
  includeColor?: boolean;
};

const createOptions = ({
  items,
  includeColor,
}: CreateOptionsType): FilterOption[] =>
  items
    .map((item) => {
      if (item.name && item.slug && item.slug.current) {
        return {
          _id: item._id,
          name: item.name,
          slug: item.slug.current,
          ...(includeColor && item.color ? { color: item.color } : {}),
        };
      }
      return undefined;
    })
    .filter((option): option is FilterOption => option !== undefined);

const page = async ({
  params,
}: {
  params: { category: string; productType: string };
}) => {
  const categorySlug = params.category.toLowerCase();
  const productTypeSlug = params.productType.toLowerCase();

  let categories: fetchCategoryDataReturnType = [];
  let productTypes: fetchProductTypesReturnType = [];

  // Fetch category, and productType concurrently
  try {
    [categories, productTypes] = await Promise.all([
      fetchCategoryData({ categorySlug }),
      fetchProductTypes({ productTypeSlug }),
    ]);
  } catch (error) {}

  const [category] = categories;
  const [productType] = productTypes;

  // Return early if category or productType does'nt exist
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

  // Create arrays required by ProductsFilter
  const colorOptions = createOptions({
    items: productColors,
    includeColor: true,
  });
  const fitOptions = createOptions({ items: productFits });
  const sizeOptions = createOptions({ items: productSizes });
  const priceOptions = priceFilters.map(
    (price): FilterOption => ({
      _id: price.id,
      name: price.displayName,
      slug: price.slug,
    })
  );

  return (
    <section className="container my-5 mb-10 lg:my-14 px-0">
      <h1 className="text-4xl font-semibold px-[1rem] md:px-[2rem]">{`${category.name}'s ${productType.name}`}</h1>
      <ProductsFilter
        filtersData={{
          colorOptions: colorOptions,
          sizeOptions: sizeOptions,
          fitOptions: fitOptions,
          priceOptions: priceOptions,
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
