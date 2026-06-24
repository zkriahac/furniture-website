import type { CollectionConfig } from 'payload'
import { revalidateProducts } from '../lib/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',
  access: { read: () => true },
  hooks: {
    afterChange: [({ doc, previousDoc }) => {
      revalidateProducts(doc?.slug ?? null)
      if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
        revalidateProducts(previousDoc.slug)
      }
    }],
    afterDelete: [({ doc }) => { revalidateProducts(doc?.slug ?? null) }],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'featured', 'updatedAt'],
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
    {
      name: 'sku',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'text',
      localized: true,
      admin: { description: 'Comma-separated tags (used by AI as context)' },
    },
    {
      name: 'aiGenerate',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/GenerateAiFields#default',
        },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: { description: 'Short teaser shown under the price (1–2 sentences). Plain text.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Full description. HTML allowed (rendered as-is on the product page).',
        rows: 14,
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'price',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'salePrice',
      type: 'number',
      admin: { position: 'sidebar', description: 'Leave empty if no discount' },
    },
    {
      name: 'isNew',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'specs',
      type: 'array',
      localized: true,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}
