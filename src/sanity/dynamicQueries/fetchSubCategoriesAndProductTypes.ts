import { sanityFetch } from "../lib/client";
import { ProductTypes, SubCategories } from "../types";

type fetchSubCategoriesAndProductTypesProps = {
  parentCategorySlug: string;
};

type fetchSubCategoriesAndProductTypesReturnType = Array<
  Pick<SubCategories, "_id" | "name" | "slug"> & {
    productTypes: Array<Pick<ProductTypes, "_id" | "name" | "slug" | "image">>;
  }
>;

export default async function fetchSubCategoriesAndProductTypes({
  parentCategorySlug,
}: fetchSubCategoriesAndProductTypesProps): Promise<fetchSubCategoriesAndProductTypesReturnType> {
  const query = `
  *[_type == "subCategories" && references(*[_type == "categories" && slug.current == "${parentCategorySlug}"]._id)]{
        _id, name, slug, 
        "productTypes": *[_type == "productTypes" && references(^._id)]{
          _id, name, slug, image
      }
    }
  `;

  return sanityFetch({
    query,
  });
}
