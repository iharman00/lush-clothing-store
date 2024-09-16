import {defineField, defineType} from 'sanity'

export const subCategories = defineType({
  name: 'subCategories',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      type: 'reference',
      to: [{type: 'categories'}],
    }),
    defineField({
      name: 'subCategory',
      type: 'reference',
      to: [{type: 'subCategories'}],
    }),
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        isUnique: () => true, // it actually makes it so that slug does'nt have to be unique
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      subCategory: 'name',
      parentCategory: 'category.name',
      parentSubCategory: 'subCategory.name',
    },
    prepare(selection) {
      const {subCategory, parentCategory, parentSubCategory} = selection
      return {
        title: `${subCategory}`,
        subtitle: parentCategory ? `${parentCategory}` : `${parentSubCategory}`,
      }
    },
  },
})
