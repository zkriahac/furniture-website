import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'

type Props = {
  siteName?: string
  description?: string | null
  phone?: string
  email?: string
  address?: string | null
}

export default async function Footer({ siteName = 'Mobilyam', description }: Props) {
  const t = await getTranslations()
  const locale = await getLocale()

  const columns = [
    {
      heading: t('footer.homeDecor'),
      links: [
        { label: t('footer.interiorDesigner'), href: `/${locale}/products` },
        { label: t('footer.furnitureAnalytics'), href: `/${locale}/products` },
        { label: t('footer.boutiqueStore'), href: `/${locale}/products` },
      ],
    },
    {
      heading: t('footer.company'),
      links: [
        { label: t('footer.aboutUs'), href: `/${locale}/about` },
        { label: t('footer.joinTeam'), href: `/${locale}/contact` },
        { label: t('footer.getInTouch'), href: `/${locale}/contact` },
      ],
    },
    {
      heading: t('footer.resources'),
      links: [
        { label: t('footer.ourCustomers'), href: `/${locale}/about` },
        { label: t('footer.smartFinance'), href: `/${locale}/contact` },
        { label: t('footer.designGuides'), href: `/${locale}/about` },
      ],
    },
    {
      heading: t('footer.features'),
      links: [
        { label: t('footer.interiorDesigner'), href: `/${locale}/products` },
        { label: t('footer.furnitureAnalytics'), href: `/${locale}/products` },
        { label: t('footer.boutiqueStore'), href: `/${locale}/products` },
      ],
    },
  ]

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <h2 className="font-heading text-2xl font-bold mb-4 text-black">{siteName}</h2>
            {description ? (
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            ) : null}
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-semibold text-sm text-black mb-4">{col.heading}</h3>
              <ul className="space-y-3 text-sm text-gray-500">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-black transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {siteName}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
