import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white py-20 text-center px-4">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-gray-700 text-lg leading-relaxed">{t('story')}</p>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-4xl sm:text-5xl font-bold text-black mb-2">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
