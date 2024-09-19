import { defineField, defineType } from "sanity";

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
      options: {
        source: "name",
        isUnique: () => true, // it actually makes it so that slug does'nt have to be unique
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
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
