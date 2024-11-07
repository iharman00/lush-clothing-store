import { sanityFetch } from "../lib/client";
import { ProductColors, ProductFits, Products } from "../types";

export const priceFiltersQueryMap = {
  Under$50: { displayName: "Under $50", query: "price < 50" },
  "$50-$100": { displayName: "$50 - $100", query: "price > 50 && price < 100" },
  "$100-$200": {
    displayName: "$100 - $200",
    query: "price > 100 && price < 200",
  },
  Over$200: { displayName: "Over $200", query: "price > 200" },
};

function isValidPriceFilter(
  filter: string
): filter is keyof typeof priceFiltersQueryMap {
  return filter in priceFiltersQueryMap;
}

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
    colorVariants: Array<{
      images: NonNullable<Products["colorVariants"]>[number]["images"];
      color: Pick<ProductColors, "_id" | "name" | "slug">;
      sizeAndStock: Array<{
        stock: NonNullable<
          NonNullable<Products["colorVariants"]>[number]["sizeAndStock"]
        >[number]["stock"];
      }>;
    }>;
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
    filters.priceFilter && isValidPriceFilter(filters.priceFilter)
      ? `&& ${priceFiltersQueryMap[filters.priceFilter].query}`
      : "";

  const query = `
*[_type == "products" ${idFilter} ${colorFilter} ${sizeFilter} ${fitFilter} ${priceFilter} &&
  references(*[_type == "productTypes" && slug.current == "${parentProductTypeSlug}" && 
    references(*[_type == "subCategories" && defined(slug.current) && 
      references(*[_type == "categories" && slug.current == "${parentCategorySlug}"]._id)]._id)]._id)] 
  | order(_id) [0...${number_of_products_to_fetch}] {
    _id, name, slug, price, 
    colorVariants[]{
      color->{_id, name, slug},
      images,
      sizeAndStock[]{stock}
    },
    fit->{_id, name, slug}
  }
`;

  console.log(query);
  return sanityFetch({
    query,
  });
}
