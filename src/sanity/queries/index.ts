import { defineQuery } from "next-sanity";
import { sanityClient } from "../lib/client";

export const NAVIGATION_DATA_QUERY =
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

export const fetchCategoryPageData = async (slug: string) =>
  sanityClient.fetch(`*[_type == "categories" && slug.current == "${slug}"]{
    _id, name, slug, image,
    "subCategories": *[_type == "subCategories" && references(^._id)]{
      _id, name, slug, 
      "productTypes": *[_type == "productTypes" && references(^._id)]{
        _id, name, slug, image
      }
    }
  }
      `);
