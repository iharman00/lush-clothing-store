import {defineField, defineType} from 'sanity'
import filterDocumentsByReferenceDocument from '../lib/filter'

export const productVariants = defineType({
  name: 'productVariants',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      type: 'reference',
      to: [{type: 'products'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'color',
      type: 'reference',
      to: [{type: 'productColors'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [{type: 'image'}],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'sizesWithStock',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'productSizeWithStock'}],
          options: {
            filter: ({document}) => {
              // only show productSizeWithStock that are children of this productVariant
              // i.e., refer to this productVariants
              return filterDocumentsByReferenceDocument({
                document,
                referenceDocumentName: 'productVariant',
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
      parentCategory: 'product.subCategory.category.name',
      parentSubCategory: 'product.subCategory.name',
      parentProduct: 'product.name',
      color: 'color.name',
    },
    prepare(selection) {
      const {parentCategory, parentSubCategory, parentProduct, color} = selection
      return {
        title: `${parentCategory} - ${parentSubCategory} - ${parentProduct} - ${color}`,
      }
    },
  },
})
