'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, ChevronDown, ChevronRight } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

type MenuItem = { label: string; href: string; children?: { label: string; href: string }[] }
type LocaleEntry = { code: string; label: string }

type Props = {
  phone?: string
  siteName?: string
  logoUrl?: string | null
  menu?: MenuItem[]
  locales?: LocaleEntry[]
}

export default function Navbar({ phone, siteName = 'Mobilyam', logoUrl, menu, locales }: Props) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const transparent = isHome && !scrolled

  const fallbackLinks: MenuItem[] = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  const prefix = (href: string) =>
    href.startsWith('http') ? href : `/${locale}${href.startsWith('/') ? href : `/${href}`}`

  const links: MenuItem[] =
    menu && menu.length
      ? menu.map((m) => ({
          label: m.label,
          href: prefix(m.href),
          children: m.children?.map((c) => ({ label: c.label, href: prefix(c.href) })),
        }))
      : fallbackLinks

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white border-b border-gray-100 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            className="p-2 -ms-2 text-gray-600 hover:text-black md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                >
                  {link.label}
                  {link.children?.length ? <ChevronDown size={14} className="opacity-60" /> : null}
                </Link>
                {link.children?.length ? (
                  <div className="absolute top-full start-0 mt-2 min-w-[180px] bg-white border border-gray-100 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <Link
            href={`/${locale}`}
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            {logoUrl ? (
              <Image src={logoUrl} alt={siteName} width={120} height={32} className="h-8 w-auto object-contain" />
            ) : (
              <span className="font-heading text-2xl font-bold tracking-tight text-black">{siteName}</span>
            )}
          </Link>

          <div className="flex items-center gap-4">
            {phone ? (
              <a
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-black"
              >
                <Phone size={14} />
                <span dir="ltr">{phone}</span>
              </a>
            ) : null}
            <LanguageSwitcher locales={locales} />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed top-0 start-0 h-full w-[85%] max-w-sm bg-white z-50 md:hidden shadow-xl flex flex-col">
            <div className="flex items-center justify-end p-4">
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-6 pb-8">
              {links.map((link, i) => (
                <div key={link.href} className="border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={() => !link.children?.length && setDrawerOpen(false)}
                      className="flex-1 py-4 text-xl font-medium text-black"
                    >
                      {link.label}
                    </Link>
                    {link.children?.length ? (
                      <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        aria-label="Toggle submenu"
                        className="p-2"
                      >
                        <ChevronRight
                          size={18}
                          className={`text-gray-400 transition-transform rtl:rotate-180 ${
                            openIndex === i ? 'rotate-90 rtl:rotate-90' : ''
                          }`}
                        />
                      </button>
                    ) : null}
                  </div>
                  {link.children?.length && openIndex === i ? (
                    <div className="ps-4 pb-3 flex flex-col gap-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setDrawerOpen(false)}
                          className="text-base text-gray-600 hover:text-black"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
          </aside>
        </>
      ) : null}
    </header>
  )
}
