import {defineField, defineType} from 'sanity'

export const productSizeWithStock = defineType({
  name: 'productSizeWithStock',
  type: 'document',
  fields: [
    defineField({
      name: 'productVariant',
      type: 'reference',
      to: [{type: 'productVariants'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Size',
      type: 'reference',
      to: [{type: 'productSizes'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stock',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      size: 'name.name',
      stock: 'stock',
    },
    prepare(selection) {
      const {size, stock} = selection
      return {
        title: `Size: ${size}`,
        subtitle: `Stock: ${stock}`,
      }
    },
  },
})
