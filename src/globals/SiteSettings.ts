import type { GlobalConfig } from 'payload'
import { revalidateGlobals } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  admin: { group: 'Settings' },
  hooks: {
    afterChange: [() => { revalidateGlobals() }],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'siteName', type: 'text', localized: true, defaultValue: 'Mobilyam' },
            { name: 'tagline', type: 'text', localized: true },
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Header logo (transparent PNG/SVG preferred)' } },
            { name: 'favicon', type: 'upload', relationTo: 'media', admin: { description: 'Browser tab icon' } },
          ],
        },
        {
          label: 'Languages',
          fields: [
            {
              name: 'languages',
              type: 'array',
              labels: { singular: 'Language', plural: 'Languages' },
              admin: {
                description:
                  'Toggle which languages appear in the public language switcher. To add new locales, you must update src/i18n/routing.ts and src/payload.config.ts (a code change is required by Payload).',
              },
              fields: [
                {
                  name: 'code',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Türkçe', value: 'tr' },
                    { label: 'English', value: 'en' },
                    { label: 'العربية', value: 'ar' },
                  ],
                },
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'isDefault', type: 'checkbox', defaultValue: false },
              ],
            },
          ],
        },
        {
          label: 'Menu',
          fields: [
            {
              name: 'navMenu',
              type: 'array',
              labels: { singular: 'Menu Item', plural: 'Menu Items' },
              admin: { description: 'Top navigation links — supports one level of children (sub-menu)' },
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                { name: 'href', type: 'text', required: true, admin: { description: 'Path (e.g. /products) or full URL' } },
                {
                  name: 'children',
                  type: 'array',
                  labels: { singular: 'Sub-item', plural: 'Sub-items' },
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true },
                    { name: 'href', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text', localized: true, admin: { description: 'Default <title> tag' } },
            { name: 'metaDescription', type: 'textarea', localized: true, admin: { description: 'Default meta description' } },
            { name: 'metaKeywords', type: 'text', localized: true, admin: { description: 'Comma-separated keywords' } },
            { name: 'ogImage', type: 'upload', relationTo: 'media', admin: { description: 'Open Graph share image (1200×630)' } },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            { name: 'gaMeasurementId', type: 'text', admin: { description: 'Google Analytics ID, e.g. G-XXXXXXXXXX' } },
            { name: 'gtmId', type: 'text', admin: { description: 'Google Tag Manager ID, e.g. GTM-XXXXXX' } },
            { name: 'facebookPixelId', type: 'text', admin: { description: 'Facebook Pixel ID' } },
          ],
        },
        {
          label: 'AI',
          fields: [
            {
              name: 'aiProvider',
              type: 'select',
              defaultValue: 'gemini',
              options: [
                { label: 'Google Gemini', value: 'gemini' },
                { label: 'OpenAI (GPT)', value: 'openai' },
                { label: 'Anthropic (Claude)', value: 'anthropic' },
              ],
              admin: { description: 'Provider used by /api/ai/generate' },
            },
            { name: 'aiApiKey', type: 'text', admin: { description: 'API key for the selected provider' } },
            {
              name: 'aiModel',
              type: 'text',
              admin: {
                description:
                  'Optional model override. Defaults: gemini-1.5-flash, gpt-4o-mini, claude-haiku-4-5-20251001',
              },
            },
          ],
        },
        {
          label: 'Email (Resend)',
          fields: [
            { name: 'resendApiKey', type: 'text', admin: { description: 'Resend API key (starts with re_)' } },
            { name: 'fromName', type: 'text', defaultValue: 'Mobilyam' },
            { name: 'fromEmail', type: 'email', admin: { description: 'Verified sender e.g. noreply@yourdomain.com' } },
            { name: 'notificationEmail', type: 'email', admin: { description: 'Where contact form submissions are sent' } },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'instagram', type: 'text' },
            { name: 'facebook', type: 'text' },
            { name: 'twitter', type: 'text' },
            { name: 'linkedin', type: 'text' },
            { name: 'youtube', type: 'text' },
          ],
        },
      ],
    },
  ],
}
