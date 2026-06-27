import { unstable_cache } from 'next/cache'
import { getPayload } from './getPayload'
import type { Locale } from '@/i18n/routing'

type GlobalLocale = Extract<Locale, 'tr' | 'en' | 'ar'>

export const getHomepage = unstable_cache(
  async (locale: string) => {
    const payload = await getPayload()
    return payload.findGlobal({
      slug: 'homepage',
      locale: locale as GlobalLocale,
      depth: 2,
    })
  },
  ['global-homepage'],
  { revalidate: 3600, tags: ['homepage'] },
)

export const getContactInfo = unstable_cache(
  async (locale: string) => {
    const payload = await getPayload()
    return payload.findGlobal({
      slug: 'contact-info',
      locale: locale as GlobalLocale,
      depth: 1,
    })
  },
  ['global-contact'],
  { revalidate: 3600, tags: ['contact-info'] },
)

export const getSiteSettings = unstable_cache(
  async (locale: string) => {
    const payload = await getPayload()
    return payload.findGlobal({
      slug: 'site-settings',
      locale: locale as GlobalLocale,
      depth: 1,
    })
  },
  ['global-settings'],
  { revalidate: 3600, tags: ['site-settings'] },
)
