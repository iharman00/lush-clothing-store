import { sanityFetch } from "../lib/client";
import {
  ProductColors,
  Products,
  ProductSizes,
  ProductVariants,
} from "../types";

type fetchProductVariantProps = {
  productId: string;
  variantId: string;
  sizeId: string;
};

export type fetchProductVariantReturnType = Array<
  Pick<ProductVariants, "_id" | "images"> & {
    color: Pick<ProductColors, "_id" | "name" | "slug">;
    sizeAndStock: {
      size: Pick<ProductSizes, "_id" | "name">;
      stock: NonNullable<ProductVariants["sizeAndStock"]>[number]["stock"];
    }[];
    parentProduct: NonNullable<
      Pick<Products, "_id" | "name" | "slug" | "price">
    >;
  }
>;

export default async function fetchProductVariant({
  productId,
  variantId,
  sizeId,
}: fetchProductVariantProps): Promise<fetchProductVariantReturnType> {
  const query = `
*[_type == "productVariants" && _id == "${variantId}"]{
    _id,
    images,
    color->{_id, name, slug},
    sizeAndStock[defined(size._ref) && size._ref == "${sizeId}"]{
        size-> {_id, name},
        stock
    },
    "parentProduct": *[_type == "products" && _id == "${productId}" && defined(slug.current)][0] {
        _id,
        name,
        slug,
        price,
    }
}`;

  return sanityFetch({
    query,
  });
}
