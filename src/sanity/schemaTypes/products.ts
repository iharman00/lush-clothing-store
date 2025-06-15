import { defineField, defineType } from "sanity";
import { apiVersion } from "../env";
import {
  Bullet,
  H1,
  H2,
  H3,
  Normal,
} from "../components/SanityEditorPortableTextComponents";

// Sanity block text editor styles
const blockStyles = [
  { title: "Heading 1", value: "h1", component: H1 },
  { title: "Heading 2", value: "h2", component: H2 },
  { title: "Heading 3", value: "h3", component: H3 },
  { title: "Normal", value: "normal", component: Normal },
];

// Sanity block text editor list styles
const listStyles = [
  { title: "Bullet", value: "bullet", component: Bullet },
  { title: "Numbered", value: "number", component: Number },
];

// Checks if the product slug is unique
async function isUniqueAcrossParentProductType(slug: any, context: any) {
  const { document, getClient } = context;
  const client = await getClient({ apiVersion: apiVersion });

  // Extract the current document's ID and its product type reference
  const id = document._id.replace(/^drafts\./, "");
  const productTypeId = document.productType?._ref;

  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    productTypeId,
  };

  // GROQ query to ensure no other product within the same productType has the same slug
  const query = `
    !defined(*[
      !(_id in [$draft, $published]) &&
      slug.current == $slug &&
      productType._ref == $productTypeId
    ][0]._id)
  `;

  const result = await client.fetch(query, params);
  return result;
}

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
      description: "The slug must be unique within the parent productType",
      options: {
        source: "name",
        isUnique: isUniqueAcrossParentProductType,
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "array",
      of: [
        {
          type: "block",
          styles: blockStyles,
          lists: listStyles,
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "materials",
      type: "array",
      of: [
        {
          type: "block",
          styles: blockStyles,
          lists: listStyles,
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price in US Dollars",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variants",
      type: "array",
      of: [
        {
          type: "document",
          name: "productVariants",
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
      validation: (Rule) => Rule.required().min(1).unique(),
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
