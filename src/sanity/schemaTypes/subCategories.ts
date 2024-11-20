import { defineField, defineType } from "sanity";
import { apiVersion } from "../env";

async function isUniqueAcrossParentCategory(slug: any, context: any) {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: apiVersion });

  // Extract the current document's ID and its product type reference
  const id = document._id.replace(/^drafts\./, "");
  const parentCategoryId = document.parentCategory?._ref;

  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    parentCategoryId,
  };

  // GROQ query to ensure no other product within the same productType has the same slug
  const query = `
    !defined(*[
      !(_id in [$draft, $published]) &&
      slug.current == $slug &&
      parentCategory._ref == $parentCategoryId
    ][0]._id)
  `;

  const result = await client.fetch(query, params);
  return result;
}

export const subCategories = defineType({
  name: "subCategories",
  type: "document",
  fields: [
    defineField({
      name: "parentCategory",
      type: "reference",
      to: [{ type: "categories" }],
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
      description: "The slug must be unique within the parent category",
      options: {
        source: "name",
        isUnique: isUniqueAcrossParentCategory,
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      subCategory: "name",
      parentCategory: "parentCategory.name",
    },
    prepare(selection) {
      const { subCategory, parentCategory } = selection;
      return {
        title: `${subCategory}`,
        subtitle: `${parentCategory}`,
      };
    },
  },
});
