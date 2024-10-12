import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/client";
import {
  Categories,
  ProductColors,
  ProductFits,
  Products,
  ProductTypes,
  SubCategories,
} from "../types";

export const fetchNavigationData = async () => {
  const NAVIGATION_DATA_QUERY =
    defineQuery(`*[_type == "categories" && defined(slug.current)]{
      _id, name, slug, image,
      "subCategories": *[_type == "subCategories" && references(^._id)]{
        _id, name, slug, 
        "productTypes": *[_type == "productTypes" && references(^._id)]{
          _id, name, slug, 
    }
  }
}
  `);
  return sanityFetch({ query: NAVIGATION_DATA_QUERY });
};

type fetchCategoriesType = Array<Pick<Categories, "_id" | "name" | "slug">>;

export const fetchCategories = async ({
  categorySlug,
}: {
  categorySlug: string;
}): Promise<fetchCategoriesType> =>
  sanityFetch({
    query: `
*[_type == "categories" && slug.current == "${categorySlug}"]{
  _id, name, slug
  }
`,
  });

type fetchProductTypesType = Array<Pick<Categories, "_id" | "name" | "slug">>;

export const fetchProductTypes = async ({
  productTypeSlug,
}: {
  productTypeSlug: string;
}): Promise<fetchProductTypesType> =>
  sanityFetch({
    query: `
*[_type == "productTypes" && slug.current == "${productTypeSlug}"]{
  _id, name, slug
  }
`,
  });

type fetchProductsType = Array<
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

export const fetchProducts = async ({
  parentCategorySlug,
  parentProductTypeSlug,
}: {
  parentCategorySlug: string;
  parentProductTypeSlug: string;
}): Promise<fetchProductsType> =>
  sanityFetch({
    query: `
*[_type == "products" && 
  references(*[_type == "productTypes" && slug.current == "${parentProductTypeSlug}" && 
    references(*[_type == "subCategories" && defined(slug.current) && 
      references(*[_type == "categories" && slug.current == "${parentCategorySlug}"]._id)]._id)]._id)]{
        _id, name, slug, price, 
        colorVariants[]{
          color->{_id, name, slug},
          images,
          sizeAndStock[]{stock}},
        fit->{_id, name, slug,}
  }
`,
  });

type fetchSubCategoriesAndProductTypesType = Array<
  Pick<SubCategories, "_id" | "name" | "slug"> & {
    productTypes: Array<Pick<ProductTypes, "_id" | "name" | "slug" | "image">>;
  }
>;

export const fetchSubCategoriesAndProductTypes = async ({
  parentCategorySlug,
}: {
  parentCategorySlug: string;
}): Promise<fetchSubCategoriesAndProductTypesType> =>
  sanityFetch({
    query: `*[_type == "subCategories" && references(*[_type == "categories" && slug.current == "${parentCategorySlug}"]._id)]{
      _id, name, slug, 
      "productTypes": *[_type == "productTypes" && references(^._id)]{
        _id, name, slug, image
  }
}
        `,
  });
