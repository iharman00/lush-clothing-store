import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/client";

export {
  fetchNavigationData,
  fetchProductColors,
  fetchProductFits,
  fetchProductSizes,
};

const fetchNavigationData = async () => {
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

const fetchProductColors = async () => {
  const PRODUCT_COLORS_QUERY =
    defineQuery(`*[_type == "productColors" && defined(slug.current)]{
        _id, name, color, slug 
  }
    `);
  return sanityFetch({ query: PRODUCT_COLORS_QUERY });
};

const fetchProductSizes = async () => {
  const PRODUCT_SIZES_QUERY =
    defineQuery(`*[_type == "productSizes" && defined(slug.current)]{
        _id, name, slug 
  }
    `);
  return sanityFetch({ query: PRODUCT_SIZES_QUERY });
};

const fetchProductFits = async () => {
  const PRODUCT_FITS_QUERY =
    defineQuery(`*[_type == "productFits" && defined(slug.current)]{
        _id, name, slug 
  }
    `);
  return sanityFetch({ query: PRODUCT_FITS_QUERY });
};
