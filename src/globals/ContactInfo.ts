import type { GlobalConfig } from 'payload'
import { revalidateGlobals } from '../lib/revalidate'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [() => { revalidateGlobals() }],
  },
  fields: [
    {
      name: 'companyDescription',
      type: 'textarea',
      localized: true,
      admin: { description: 'Short company blurb shown in the footer' },
    },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'address', type: 'textarea', localized: true },
    { name: 'hoursValue', type: 'text', localized: true },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'whatsapp', type: 'text' },
      ],
    },
  ],
}
