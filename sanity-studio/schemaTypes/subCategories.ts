import {defineField, defineType} from 'sanity'
import filterDocumentsByReferenceDocument from '../lib/filter'

export const subCategories = defineType({
  name: 'subCategories',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      type: 'reference',
      to: [{type: 'categories'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'products',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'products'}],
          options: {
            filter: ({document}) => {
              // only show products that are children of this subCategory
              // i.e., refer to this subCategory
              return filterDocumentsByReferenceDocument({
                document,
                referenceDocumentName: 'subCategory',
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
      subCategory: 'name',
      parentCategory: 'category.name',
    },
    prepare(selection) {
      const {subCategory, parentCategory} = selection
      return {
        title: `${parentCategory} - ${subCategory}`,
      }
    },
  },
})
