import { sanityFetch } from "../lib/client";
import { ProductColors, Products, ProductSizes } from "../types";

type fetchProductVariantProps = {
  productId: string;
  variantId: string;
  sizeId: string;
};

export type fetchProductVariantReturnType = {
  _id: string;
  name: string;
  slug: Products["slug"];
  price: number;
  variant: {
    _key: string;
    images: NonNullable<Products["variants"]>[number]["images"];
    color: Pick<ProductColors, "_id" | "name" | "slug">;
    sizeAndStock: {
      size: Pick<ProductSizes, "_id" | "name">;
      stock: number;
    }[];
  };
};

export default async function fetchProductVariant({
  productId,
  variantId,
  sizeId,
}: fetchProductVariantProps): Promise<fetchProductVariantReturnType> {
  const query = `
*[_type == "products" && _id == "${productId}"]{
  _id,
  name,
  slug,
  price,
  "variant": variants[_key == "${variantId}"]{
    _key,
    images,
    color->{_id, name, slug},
    sizeAndStock[defined(size._ref) && size._ref == "${sizeId}"]{
      size->{_id, name},
      stock
    }
  }
}[0]`;

  return sanityFetch({
    query,
  });
}
