import { sanityFetch } from "../lib/client";
import {
  ProductColors,
  ProductFits,
  Products,
  ProductVariants,
} from "../types";

export const priceFilters = [
  {
    id: "1",
    displayName: "Under $50",
    slug: "Under$50",
    sanityQuery: "price < 50",
  },
  {
    id: "2",
    displayName: "$50 - $100",
    slug: "$50-$100",
    sanityQuery: "price > 50 && price < 100",
  },
  {
    id: "3",
    displayName: "$100 - $200",
    slug: "$100-$200",
    sanityQuery: "price > 100 && price < 200",
  },
  {
    id: "4",
    displayName: "Over $200",
    slug: "Over$200",
    sanityQuery: "price > 200",
  },
];

type fetchProductsProps = {
  parentCategorySlug: string;
  parentProductTypeSlug: string;
  filters: {
    colorSlug: string | null;
    sizeSlug: string | null;
    fitSlug: string | null;
    priceFilter: string | null;
  };
  number_of_products_to_fetch?: number;
  id_of_last_product_fetched?: string;
};

export type fetchProductsReturnType = Array<
  Pick<Products, "_id" | "name" | "slug" | "price"> & {
    variants: {
      images: ProductVariants["images"];
      color: Pick<ProductColors, "_id" | "name" | "slug">;
      sizeAndStock: {
        stock: NonNullable<ProductVariants["sizeAndStock"]>[number]["stock"];
      }[];
    }[];
    fit: Pick<ProductFits, "_id" | "name" | "slug">;
  }
>;

export default async function fetchProducts({
  parentCategorySlug,
  parentProductTypeSlug,
  filters,
  number_of_products_to_fetch = 10,
  id_of_last_product_fetched,
}: fetchProductsProps): Promise<fetchProductsReturnType> {
  // Construct filter conditions
  const colorFilter = filters.colorSlug
    ? `&& "${filters.colorSlug}" in colorVariants[].color->slug.current`
    : "";
  const sizeFilter = filters.sizeSlug
    ? `&& "${filters.sizeSlug}" in colorVariants[].sizeAndStock[].size->slug.current`
    : "";
  const fitFilter = filters.fitSlug
    ? `&& fit->slug.current == "${filters.fitSlug}"`
    : "";
  const idFilter = id_of_last_product_fetched
    ? `&& _id > "${id_of_last_product_fetched}"`
    : "";
  const priceFilter =
    filters.priceFilter &&
    priceFilters.filter((pf) => pf.slug === filters.priceFilter).length > 0 // checks if priceFilter actually has a defined query
      ? `&& ${priceFilters.filter((pf) => pf.slug === filters.priceFilter)[0].sanityQuery}`
      : "";

  const query = `
*[_type == "products" ${idFilter} ${colorFilter} ${sizeFilter} ${fitFilter} ${priceFilter} &&
  references(*[_type == "productTypes" && slug.current == "${parentProductTypeSlug}" && 
    references(*[_type == "subCategories" && defined(slug.current) && 
      references(*[_type == "categories" && slug.current == "${parentCategorySlug}"]._id)]._id)]._id)] 
  | order(_id) [0...${number_of_products_to_fetch}] {
    _id, name, slug, price, 
    variants[]->{
      color->{_id, name, slug},
      images,
      sizeAndStock[]{stock}
    },
    fit->{_id, name, slug}
  }
`;

  return sanityFetch({
    query,
  });
}
