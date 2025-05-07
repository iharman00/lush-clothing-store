import ProductsFeed from "@/components/ProductsFeed";
import {
  fetchProductColors,
  fetchProductFits,
  fetchProductSizes,
} from "@/sanity/staticQueries";
import fetchProductTypes, {
  fetchProductTypesReturnType,
} from "@/sanity/dynamicQueries/fetchProductTypes";
import fetchCategoryData, {
  fetchCategoryDataReturnType,
} from "@/sanity/dynamicQueries/fetchCategoryData";
import ProductsFilter, { FilterOption } from "@/components/ProductsFilter";
import { Color, Slug } from "@/sanity/types";
import { priceFilters } from "@/sanity/dynamicQueries/fetchProducts";
import { notFound } from "next/navigation";

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

  if (!category || !productType) notFound();

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
