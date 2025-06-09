import { sanityFetch } from "../lib/client";
import {
  ProductColors,
  Products,
  ProductSizes,
  ProductVariants,
  Slug,
} from "../types";

type fetchProductDataProps = {
  categorySlug: string;
  productSlug: string;
};

export type fetchProductDataReturnType = Array<
  Pick<
    Products,
    "_id" | "name" | "slug" | "description" | "materials" | "price"
  > & {
    variants: {
      _id: ProductVariants["_id"];
      images: ProductVariants["images"];
      color: Pick<ProductColors, "_id" | "name" | "slug" | "color">;
      sizeAndStock: {
        stock: NonNullable<ProductVariants["sizeAndStock"]>[number]["stock"];
        size: Pick<ProductSizes, "_id" | "name" | "slug">;
      }[];
    }[];
    productType: {
      _id: string;
      name: string;
      slug: Slug;
      subCategory: {
        _id: string;
        name: string;
        slug: Slug;
        category: {
          _id: string;
          name: string;
          slug: Slug;
        };
      };
    };
  }
>;

export default async function fetchProductData({
  categorySlug,
  productSlug,
}: fetchProductDataProps): Promise<fetchProductDataReturnType> {
  const query = `
  *[_type == "products" && slug.current == "${productSlug}"
    && references(*[_type == "productTypes" && defined(slug.current) 
    && references(*[_type == "subCategories" && defined(slug.current) 
    && references(*[_type == "categories" && slug.current == "${categorySlug}"]._id)]._id)]._id)]{
        _id, name, slug, description, materials, price,
        variants[]->{
          _id,
          color->{_id, name, slug, color},
          images,
          sizeAndStock[]{size->{_id, name, slug},stock}
        },
         "productType": productType->{
          _id, name, slug,
          "subCategory": parentSubCategory->{
            _id, name, slug,
            "category": parentCategory->{
              _id, name, slug
        }
      }
    }
    }
  `;
  return sanityFetch({
    query,
  });
}
