import { defineField, defineType } from "sanity";

export const products = defineType({
  name: "products",
  type: "document",
  fields: [
    defineField({
      name: "productType",
      type: "reference",
      to: [{ type: "productTypes" }],
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
    defineField({
      name: "description",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "materials",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price in cents",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "colorVariants",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "color",
              type: "reference",
              to: [{ type: "productColors" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "images",
              type: "array",
              of: [
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
              validation: (Rule) => Rule.required().min(1).unique(),
            }),
            defineField({
              name: "sizeAndStock",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "size",
                      type: "reference",
                      to: [{ type: "productSizes" }],
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: "stock",
                      type: "number",
                      validation: (Rule) => Rule.required().min(0),
                    },
                  ],
                  preview: {
                    select: {
                      size: "size.name",
                      stock: "stock",
                    },
                    prepare(selection) {
                      const { size, stock } = selection;
                      return {
                        title: `Size: ${size}`,
                        subtitle: `Stock: ${stock}`,
                      };
                    },
                  },
                },
              ],
              validation: (Rule) => Rule.required().min(1).unique(),
            }),
          ],
          preview: {
            select: {
              color: "color.name",
            },
            prepare(selection) {
              const { color } = selection;
              return {
                title: `${color}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "fit",
      type: "reference",
      to: [{ type: "productFits" }],
    }),
  ],
  preview: {
    select: {
      parentCategory: "productType.parentSubCategory.parentCategory.name",
      name: "name",
    },
    prepare(selection) {
      const { parentCategory, name } = selection;
      return {
        title: `${name}`,
        subtitle: `${parentCategory}`,
      };
    },
  },
});
