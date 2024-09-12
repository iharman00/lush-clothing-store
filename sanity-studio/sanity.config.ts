import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'lush-clothing-store',

  projectId: '6d6zqsxz',
  dataset: 'test',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Base')
          .items([
            ...S.documentTypeListItems().filter(
              (ListItem) => ListItem.getId() !== 'productSizeWithStock',
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
