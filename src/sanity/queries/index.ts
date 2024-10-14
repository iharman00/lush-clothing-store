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

export type fetchCategoriesType = Array<
  Pick<Categories, "_id" | "name" | "slug">
>;

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

export type fetchProductTypesType = Array<
  Pick<Categories, "_id" | "name" | "slug">
>;

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

type NonNullableProductImages = NonNullable<
  NonNullable<Products["colorVariants"]>[number]["images"]
>;

export type fetchProductsType = Array<{
  _id: NonNullable<Products["_id"]>;
  name: NonNullable<Products["name"]>;
  price: NonNullable<Products["price"]>;
  slug: NonNullable<Products["slug"]>;
  colorVariants: Array<{
    images: {
      _key: NonNullable<NonNullableProductImages[number]["_key"]>;
      _type: NonNullable<NonNullableProductImages[number]["_type"]>;
      alt: NonNullable<NonNullableProductImages[number]["alt"]>;
      asset: NonNullable<NonNullableProductImages[number]["asset"]>;
      crop: NonNullable<NonNullableProductImages[number]["crop"]>;
      hotspot: NonNullable<NonNullableProductImages[number]["hotspot"]>;
    }[];
    color: Pick<ProductColors, "_id" | "name" | "slug">;
    sizeAndStock: Array<{
      stock: NonNullable<
        NonNullable<Products["colorVariants"]>[number]["sizeAndStock"]
      >[number]["stock"];
    }>;
  }>;
  fit: Pick<ProductFits, "_id" | "name" | "slug">;
}>;

export const fetchProducts = async ({
  parentCategorySlug,
  parentProductTypeSlug,
  number_of_products_to_fetch = 10,
  id_of_last_product_fetched,
}: {
  parentCategorySlug: string;
  parentProductTypeSlug: string;
  number_of_products_to_fetch?: number;
  id_of_last_product_fetched?: string;
}): Promise<fetchProductsType> =>
  sanityFetch({
    query: `
*[_type == "products" ${id_of_last_product_fetched ? `&& _id > "${id_of_last_product_fetched}"` : ""} &&
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

`,
  });

export type fetchSubCategoriesAndProductTypesType = Array<
  Pick<SubCategories, "_id" | "name" | "slug"> & {
    productTypes: Array<{
      _id: NonNullable<ProductTypes["_id"]>;
      name: NonNullable<ProductTypes["name"]>;
      slug: NonNullable<ProductTypes["slug"]>;
      image: {
        _type: NonNullable<NonNullable<ProductTypes["image"]>["_type"]>;
        alt: NonNullable<NonNullable<ProductTypes["image"]>["alt"]>;
        asset: NonNullable<NonNullable<ProductTypes["image"]>["asset"]>;
        crop: NonNullable<NonNullable<ProductTypes["image"]>["crop"]>;
        hotspot: NonNullable<NonNullable<ProductTypes["image"]>["hotspot"]>;
      };
    }>;
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
