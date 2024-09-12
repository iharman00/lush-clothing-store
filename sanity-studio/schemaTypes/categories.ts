import {defineField, defineType} from 'sanity'
import filterDocumentsByReferenceDocument from '../lib/filter'

export const categories = defineType({
  name: 'categories',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCategories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'subCategories'}],
          options: {
            filter: ({document}) => {
              // only show subcategories that are children of this category
              // i.e., refer to this category
              return filterDocumentsByReferenceDocument({
                document,
                referenceDocumentName: 'category',
              })
            },
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
  ],
})
