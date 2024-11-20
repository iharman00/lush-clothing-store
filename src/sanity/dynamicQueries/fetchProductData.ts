import { sanityFetch } from "../lib/client";
import { ProductColors, Products, ProductSizes } from "../types";

type fetchProductDataProps = {
  categorySlug: string;
  productSlug: string;
};

export type fetchProductDataReturnType = Array<
  Pick<
    Products,
    "_id" | "name" | "slug" | "description" | "materials" | "price"
  > & {
    colorVariants: Array<{
      images: NonNullable<Products["colorVariants"]>[number]["images"];
      color: Pick<ProductColors, "_id" | "name" | "slug" | "color">;
      sizeAndStock: Array<{
        stock: NonNullable<
          NonNullable<
            NonNullable<Products["colorVariants"]>[number]["sizeAndStock"]
          >[number]["stock"]
        >;
        size: Pick<ProductSizes, "_id" | "name" | "slug">;
      }>;
    }>;
  }
>;

export default async function afetchProductData({
  categorySlug,
  productSlug,
}: fetchProductDataProps): Promise<fetchProductDataReturnType> {
  const query = `
  *[_type == "products" && slug.current == "${productSlug}"
    && references(*[_type == "productTypes" && defined(slug.current) 
    && references(*[_type == "subCategories" && defined(slug.current) 
    && references(*[_type == "categories" && slug.current == "${categorySlug}"]._id)]._id)]._id)]{
        _id, name, slug, description, materials, price,
        colorVariants[]{
        color->{_id, name, slug, color},
        images,
        sizeAndStock[]{size->{_id, name, slug},stock}
        },
    }
  `;
  return sanityFetch({
    query,
  });
}
