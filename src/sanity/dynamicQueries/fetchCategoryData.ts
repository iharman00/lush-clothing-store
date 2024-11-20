import { sanityFetch } from "../lib/client";
import { Categories } from "../types";

type fetchCategoryDataProps = {
  categorySlug: string;
};

export type fetchCategoryDataReturnType = Array<
  Pick<Categories, "_id" | "name" | "slug">
>;

export default async function fetchCategoryData({
  categorySlug,
}: fetchCategoryDataProps): Promise<fetchCategoryDataReturnType> {
  const query = `
  *[_type == "categories" && slug.current == "${categorySlug}"]{
        _id, name, slug
    }
  `;

  return sanityFetch({
    query,
  });
}
