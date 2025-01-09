import { categories } from "./categories";
import { productColors } from "./productColors";
import { productFits } from "./productFits";
import { productSizes } from "./productSizes";
import { productTypes } from "./productTypes";
import { productVariants } from "./productVariants";
import { products } from "./products";
import { subCategories } from "./subCategories";

const schemas = [
  categories,
  subCategories,
  productTypes,
  products,
  productVariants,
  productColors,
  productSizes,
  productFits,
];

export default schemas;
