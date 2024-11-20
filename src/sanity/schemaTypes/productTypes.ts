import { defineField, defineType } from "sanity";
import { apiVersion } from "../env";

async function isUniqueAcrossParentSubCategory(slug: any, context: any) {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: apiVersion });

  // Extract the current document's ID and its product type reference
  const id = document._id.replace(/^drafts\./, "");
  const parentSubCategoryId = document.parentSubCategory?._ref;

  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    parentSubCategoryId,
  };

  // GROQ query to ensure no other product within the same productType has the same slug
  const query = `
    !defined(*[
      !(_id in [$draft, $published]) &&
      slug.current == $slug &&
      parentSubCategory._ref == $parentSubCategoryId
    ][0]._id)
  `;

  const result = await client.fetch(query, params);
  return result;
}

export const productTypes = defineType({
  name: "productTypes",
  type: "document",
  fields: [
    defineField({
      name: "parentSubCategory",
      type: "reference",
      to: [{ type: "subCategories" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "The slug must be unique within the parent sub-category",
      options: {
        source: "name",
        isUnique: isUniqueAcrossParentSubCategory,
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alternative Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required().assetRequired(),
    }),
  ],
  preview: {
    select: {
      productType: "name",
      parentSubCategory: "parentSubCategory.name",
      parentCategory: "parentSubCategory.parentCategory.name",
    },
    prepare(selection) {
      const { productType, parentSubCategory, parentCategory } = selection;
      return {
        title: `${productType}`,
        subtitle: `${parentSubCategory} -> ${parentCategory}`,
      };
    },
  },
});
