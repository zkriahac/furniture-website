import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { getHomepage, getContactInfo, getSiteSettings } from '@/lib/getGlobals'
import { getImageUrl } from '@/lib/utils'
import '@/app/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings(locale).catch(() => null)
  const ogImage = getImageUrl(settings?.ogImage)
  const faviconUrl = getImageUrl(settings?.favicon)
  return {
    title: settings?.metaTitle || settings?.siteName || 'Mobilyam',
    description: settings?.metaDescription || undefined,
    keywords: settings?.metaKeywords || undefined,
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
    openGraph: ogImage
      ? { images: [ogImage], title: settings?.metaTitle || settings?.siteName || 'Mobilyam' }
      : undefined,
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  setRequestLocale(locale)

  const [messages, homepage, contact, settings] = await Promise.all([
    getMessages(),
    getHomepage(locale),
    getContactInfo(locale),
    getSiteSettings(locale).catch(() => null),
  ])
  const isRtl = locale === 'ar'
  const logoUrl = getImageUrl(settings?.logo)
  const siteName = settings?.siteName || 'Mobilyam'
  const navMenu = (settings?.navMenu ?? []).map((m: { label?: string; href?: string; children?: { label?: string; href?: string }[] }) => ({
    label: m.label || '',
    href: m.href || '/',
    children: (m.children ?? []).map((c) => ({ label: c.label || '', href: c.href || '/' })),
  }))
  const labels: Record<string, string> = { tr: 'TR', en: 'EN', ar: 'AR' }
  const enabledLocales = (settings?.languages ?? [])
    .filter((l: { enabled?: boolean; code?: string }) => l.enabled !== false && l.code)
    .map((l: { enabled?: boolean; code?: string }) => ({ code: l.code as string, label: labels[l.code as string] || (l.code as string).toUpperCase() }))
  const navLocales = enabledLocales.length ? enabledLocales : undefined
  const gaId = settings?.gaMeasurementId
  const gtmId = settings?.gtmId

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <body>
        {gtmId ? (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        ) : null}
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-script" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        <NextIntlClientProvider messages={messages}>
          <AnnouncementBar text={homepage?.announcement} />
          <Navbar phone={contact?.phone} siteName={siteName} logoUrl={logoUrl} menu={navMenu} locales={navLocales} />
          <main>{children}</main>
          <Footer
            siteName={siteName}
            description={contact?.companyDescription}
            phone={contact?.phone}
            email={contact?.email}
            address={contact?.address}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
