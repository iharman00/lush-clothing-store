import { sanityFetch } from "../lib/client";
import { Categories } from "../types";

type fetchProductTypesProps = {
  productTypeSlug: string;
};

export type fetchProductTypesReturnType = Array<
  Pick<Categories, "_id" | "name" | "slug">
>;

export default async function fetchProductTypes({
  productTypeSlug,
}: fetchProductTypesProps): Promise<fetchProductTypesReturnType> {
  const query = `
  *[_type == "productTypes" && slug.current == "${productTypeSlug}"]{
    _id, name, slug
    }
  `;

  return sanityFetch({
    query,
  });
}
