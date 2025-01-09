import { defineField, defineType } from "sanity";

export const productVariants = defineType({
  name: "productVariants",
  type: "document",
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
});
