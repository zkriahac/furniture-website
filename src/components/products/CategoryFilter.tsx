'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

type Category = { slug: string; name: string }

type Props = {
  categories: Category[]
  activeSlug?: string
}

export default function CategoryFilter({ categories, activeSlug }: Props) {
  const t = useTranslations('products')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setCategory = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const allActive = !activeSlug

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory(null)}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
          allActive ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-black'
        }`}
      >
        {t('allCategories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => setCategory(cat.slug)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            activeSlug === cat.slug
              ? 'bg-black text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-black'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
