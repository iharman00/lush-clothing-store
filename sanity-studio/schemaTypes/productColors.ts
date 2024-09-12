import {defineField, defineType} from 'sanity'

export const productColors = defineType({
  name: 'productColors',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
