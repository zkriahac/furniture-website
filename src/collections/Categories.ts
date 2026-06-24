import type { CollectionConfig } from 'payload'
import { revalidateProducts } from '../lib/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: { read: () => true },
  hooks: {
    afterChange: [() => { revalidateProducts() }],
    afterDelete: [() => { revalidateProducts() }],
  },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
