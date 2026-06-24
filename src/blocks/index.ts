import type { Block } from 'payload'

export const HeroSlidesBlock: Block = {
  slug: 'heroSlides',
  labels: { singular: 'Hero Slider', plural: 'Hero Sliders' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      labels: { singular: 'Slide', plural: 'Slides' },
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true },
        { name: 'ctaLabel', type: 'text', localized: true },
        { name: 'ctaHref', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const CategoryGridBlock: Block = {
  slug: 'categoryGrid',
  labels: { singular: 'Category Grid', plural: 'Category Grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 8,
      min: 1,
      max: 24,
      admin: { description: 'How many categories to show' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'Leave empty to auto-pick the most recent' },
    },
  ],
}

export const PromoBannersBlock: Block = {
  slug: 'promoBanners',
  labels: { singular: 'Promo Banners', plural: 'Promo Banners' },
  fields: [
    {
      name: 'banners',
      type: 'array',
      maxRows: 3,
      minRows: 1,
      labels: { singular: 'Banner', plural: 'Banners' },
      admin: {
        description: 'First banner = tall left; the next two stack on the right.',
      },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text' },
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
  ],
}

export const FeaturedProductsBlock: Block = {
  slug: 'featuredProducts',
  labels: { singular: 'Featured Products', plural: 'Featured Products' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'featured',
      options: [
        { label: 'Featured products', value: 'featured' },
        { label: 'Newest', value: 'newest' },
        { label: 'Manual selection', value: 'manual' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 8,
      min: 1,
      max: 24,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'manual',
      },
    },
  ],
}

export const BrandShowcaseBlock: Block = {
  slug: 'brandShowcase',
  labels: { singular: 'Brand Showcase', plural: 'Brand Showcases' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'brands',
      type: 'array',
      labels: { singular: 'Brand', plural: 'Brands' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true, required: true },
        { name: 'stars', type: 'number', min: 1, max: 5, defaultValue: 5 },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const CollaboratorsBlock: Block = {
  slug: 'collaborators',
  labels: { singular: 'Collaborators', plural: 'Collaborators' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'logos',
      type: 'array',
      labels: { singular: 'Logo', plural: 'Logos' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  labels: { singular: 'Newsletter', plural: 'Newsletters' },
  fields: [
    { name: 'heading', type: 'textarea', localized: true },
    { name: 'placeholder', type: 'text', localized: true },
    { name: 'buttonLabel', type: 'text', localized: true },
  ],
}

export const LatestPostsBlock: Block = {
  slug: 'latestPosts',
  labels: { singular: 'Latest Posts', plural: 'Latest Posts' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12 },
  ],
}

export const ContactCtaBlock: Block = {
  slug: 'contactCta',
  labels: { singular: 'Contact CTA', plural: 'Contact CTAs' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'subtitle', type: 'textarea', localized: true },
    { name: 'buttonLabel', type: 'text', localized: true },
    { name: 'buttonHref', type: 'text' },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
  ],
}

export const ImageBannerBlock: Block = {
  slug: 'imageBanner',
  labels: { singular: 'Image Banner', plural: 'Image Banners' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'alt', type: 'text', localized: true },
    { name: 'caption', type: 'text', localized: true },
    { name: 'href', type: 'text' },
    {
      name: 'height',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'subtitle', type: 'textarea', localized: true },
    { name: 'buttonLabel', type: 'text', localized: true, required: true },
    { name: 'buttonHref', type: 'text', required: true },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'amber',
      options: [
        { label: 'Amber', value: 'amber' },
        { label: 'Teal', value: 'teal' },
        { label: 'Gray', value: 'gray' },
        { label: 'White', value: 'white' },
      ],
    },
  ],
}

export const homepageBlocks: Block[] = [
  HeroSlidesBlock,
  CategoryGridBlock,
  PromoBannersBlock,
  FeaturedProductsBlock,
  BrandShowcaseBlock,
  TestimonialsBlock,
  CollaboratorsBlock,
  NewsletterBlock,
  LatestPostsBlock,
  ContactCtaBlock,
  RichTextBlock,
  ImageBannerBlock,
  CtaBlock,
]
