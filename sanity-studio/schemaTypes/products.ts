import {defineField, defineType} from 'sanity'
import filterDocumentsByReferenceDocument from '../lib/filter'

export const products = defineType({
  name: 'products',
  type: 'document',
  fields: [
    defineField({
      name: 'subCategory',
      type: 'reference',
      to: [{type: 'subCategories'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'materials',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price in cents',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'colorVariants',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'productVariants'}],
          options: {
            filter: ({document}) => {
              // only show productVariants that are children of this product
              // i.e., refer to this product
              return filterDocumentsByReferenceDocument({
                document,
                referenceDocumentName: 'product',
              })
            },
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    select: {
      parentCategory: 'subCategory.category.name',
      parentSubCategory: 'subCategory.name',
      name: 'name',
    },
    prepare(selection) {
      const {parentCategory, parentSubCategory, name} = selection
      return {
        title: `${parentCategory} - ${parentSubCategory} - ${name}`,
      }
    },
  },
})
