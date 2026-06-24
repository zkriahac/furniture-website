import type { CollectionConfig } from 'payload'
import { revalidateBlog } from '../lib/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: { read: () => true },
  hooks: {
    afterChange: [({ doc, previousDoc }) => {
      revalidateBlog(doc?.slug ?? null)
      if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
        revalidateBlog(previousDoc.slug)
      }
    }],
    afterDelete: [({ doc }) => { revalidateBlog(doc?.slug ?? null) }],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'publishedAt'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'body', type: 'textarea', localized: true, admin: { description: 'Plain or markdown content' } },
    { name: 'author', type: 'text', defaultValue: 'Mobilyam' },
    { name: 'category', type: 'text', localized: true, admin: { description: 'e.g. Office Furniture' } },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      defaultValue: () => new Date(),
    },
    { name: 'tags', type: 'text', localized: true, admin: { description: 'Comma-separated' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
