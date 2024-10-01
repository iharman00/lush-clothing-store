import React from "react";
import { defineField, defineType } from "sanity";

export const productColors = defineType({
  name: "productColors",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      type: "color",
      options: { disableAlpha: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      color: "color.hex", // Selects the hex value of the color from the custom color component
    },
    prepare({ title, color }) {
      return {
        title: title,
        // Displays color as the thumbnail
        media: React.createElement("div", {
          style: {
            backgroundColor: color,
            width: "100%",
            height: "100%",
          },
        }),
      };
    },
  },
});
