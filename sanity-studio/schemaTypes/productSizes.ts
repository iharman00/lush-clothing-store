import {defineField, defineType} from 'sanity'

export const productSizes = defineType({
  name: 'productSizes',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
