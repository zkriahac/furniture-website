import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Phone, ArrowUpRight } from 'lucide-react'

type Props = {
  title: string
  subtitle: string
  phone: string
  locale: string
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

export default async function ContactCta({ title, subtitle, phone, locale }: Props) {
  const t = await getTranslations()

  return (
    <section className="py-16 bg-black text-white text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">{title}</h2>
        <p className="text-gray-400 mb-8">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {phone ? (
            <a
              href={telHref(phone)}
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-3 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              <Phone size={16} />
              {t('home.callUs')}
            </a>
          ) : null}
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center gap-2 border border-white text-white px-7 py-3 rounded-full font-medium text-sm hover:bg-white/10 transition-colors"
          >
            {t('home.contactButton')}
            <ArrowUpRight size={16} className="rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  )
}
