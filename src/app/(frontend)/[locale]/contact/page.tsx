import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import { getContactInfo } from '@/lib/getGlobals'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  const contact = await getContactInfo(locale)

  const phoneDigits = (contact?.phone || '').replace(/[^+\d]/g, '')

  const info = [
    contact?.address
      ? { icon: MapPin, label: t('address'), value: contact.address }
      : null,
    contact?.phone
      ? { icon: Phone, label: 'Telefon', value: contact.phone, href: `tel:${phoneDigits}` }
      : null,
    contact?.email
      ? { icon: Mail, label: 'E-posta', value: contact.email, href: `mailto:${contact.email}` }
      : null,
    contact?.hoursValue
      ? { icon: Clock, label: t('hours'), value: contact.hoursValue }
      : null,
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string; href?: string }[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-black mb-3">
          {t('title')}
        </h1>
        <p className="text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form — takes 3 of 5 columns */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        {/* Contact info — takes 2 of 5 columns */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-semibold text-base text-black">{t('infoTitle')}</h2>
          <ul className="space-y-5">
            {info.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-black hover:underline">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-black">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
