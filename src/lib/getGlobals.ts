import { getPayload } from './getPayload'
import type { Locale } from '@/i18n/routing'

type GlobalLocale = Extract<Locale, 'tr' | 'en' | 'ar'>

export async function getHomepage(locale: string) {
  const payload = await getPayload()
  return payload.findGlobal({
    slug: 'homepage',
    locale: locale as GlobalLocale,
    depth: 2,
  })
}

export async function getContactInfo(locale: string) {
  const payload = await getPayload()
  return payload.findGlobal({
    slug: 'contact-info',
    locale: locale as GlobalLocale,
    depth: 1,
  })
}

export async function getSiteSettings(locale: string) {
  const payload = await getPayload()
  return payload.findGlobal({
    slug: 'site-settings',
    locale: locale as GlobalLocale,
    depth: 1,
  })
}
