import { defineField, defineType } from "sanity";

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
