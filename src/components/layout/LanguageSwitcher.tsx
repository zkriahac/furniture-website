'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

type LocaleEntry = { code: string; label: string }

type Props = { locales?: LocaleEntry[] }

const ALL: LocaleEntry[] = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
]

export default function LanguageSwitcher({ locales }: Props) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const list = locales && locales.length ? locales : ALL

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  if (list.length < 2) return null

  return (
    <div className="flex items-center gap-1 text-sm">
      {list.map((l, i) => (
        <span key={l.code} className="flex items-center">
          <button
            onClick={() => switchLocale(l.code)}
            className={`px-1 py-0.5 transition-colors ${
              locale === l.code
                ? 'font-semibold text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {l.label}
          </button>
          {i < list.length - 1 && <span className="text-gray-300">|</span>}
        </span>
      ))}
    </div>
  )
}
