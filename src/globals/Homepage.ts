import type { GlobalConfig } from 'payload'
import { revalidateGlobals } from '../lib/revalidate'
import { homepageBlocks } from '../blocks'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [() => { revalidateGlobals() }],
  },
  fields: [
    {
      name: 'announcement',
      type: 'text',
      localized: true,
      admin: { description: 'Top announcement bar text' },
    },
    {
      name: 'sections',
      type: 'blocks',
      labels: { singular: 'Section', plural: 'Sections' },
      blocks: homepageBlocks,
      admin: {
        description:
          'Build your homepage by adding any sections in any order. When at least one section is added here, the legacy fixed fields below are ignored.',
      },
    },
    {
      type: 'collapsible',
      label: 'Legacy fields (used only when no Sections are added above)',
      admin: { initCollapsed: true },
      fields: [
    {
      name: 'heroSlides',
      type: 'array',
      labels: { singular: 'Hero Slide', plural: 'Hero Slides' },
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true },
        { name: 'ctaLabel', type: 'text', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'promoBanners',
      type: 'array',
      maxRows: 3,
      labels: { singular: 'Banner', plural: 'Banners' },
      admin: {
        description: 'First banner shows tall on the left; the next two stack on the right.',
      },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'background',
          type: 'select',
          defaultValue: 'amber',
          options: [
            { label: 'Amber (dark)', value: 'amber' },
            { label: 'Teal (light)', value: 'teal' },
            { label: 'Gray (light)', value: 'gray' },
          ],
        },
      ],
    },
    {
      name: 'brands',
      type: 'array',
      labels: { singular: 'Brand', plural: 'Brands' },
      admin: { description: 'Showcase rooms with brand logos overlay' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true, required: true },
        {
          name: 'stars',
          type: 'number',
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'collaborators',
      type: 'array',
      labels: { singular: 'Collaborator Logo', plural: 'Collaborator Logos' },
      admin: { description: 'Trusted partner / collaborator logos' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'heading', type: 'textarea', localized: true },
        { name: 'placeholder', type: 'text', localized: true },
        { name: 'buttonLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'contactCta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'subtitle', type: 'textarea', localized: true },
      ],
    },
      ],
    },
  ],
}
