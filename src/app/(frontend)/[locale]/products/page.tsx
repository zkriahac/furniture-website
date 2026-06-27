import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { unstable_cache } from 'next/cache'
import { routing } from '@/i18n/routing'
import { getPayload } from '@/lib/getPayload'
import { getSiteSettings } from '@/lib/getGlobals'
import ProductGrid from '@/components/products/ProductGrid'
import { Suspense } from 'react'

const CACHE_OPTS = { revalidate: 3600, tags: ['products'] }

// Counts per category — cached 1h, avoids full table scan on every request
const getCachedProductCounts = unstable_cache(
  async () => {
    const payload = await getPayload()
    const result = await payload.find({ collection: 'products', limit: 2000, depth: 1 })
    const counts: Record<string, number> = {}
    for (const p of result.docs) {
      const cat = p.category as { slug?: string } | null
      if (!cat?.slug) continue
      counts[cat.slug] = (counts[cat.slug] ?? 0) + 1
    }
    return { counts, total: result.totalDocs }
  },
  ['product-category-counts'],
  CACHE_OPTS,
)

// Product listing per locale+category — cached 1h (searchParams makes this page dynamic)
const getCachedProducts = unstable_cache(
  async (locale: string, category?: string) => {
    const payload = await getPayload()
    return payload.find({
      collection: 'products',
      locale: locale as 'tr' | 'en' | 'ar',
      where: category ? { 'category.slug': { equals: category } } : {},
      limit: 100,
      depth: 1,
    })
  },
  ['products-listing'],
  CACHE_OPTS,
)

// Category list per locale — cached 1h
const getCachedCategories = unstable_cache(
  async (locale: string) => {
    const payload = await getPayload()
    return payload.find({ collection: 'categories', locale: locale as 'tr' | 'en' | 'ar', limit: 20 })
  },
  ['categories-list'],
  { revalidate: 3600, tags: ['categories'] },
)

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export const revalidate = 2592000 // 30 days

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('products')

  const [productsResult, categoriesResult, { counts: countByCategorySlug, total: totalCount }, settings] =
    await Promise.all([
      getCachedProducts(locale, category),
      getCachedCategories(locale),
      getCachedProductCounts(),
      getSiteSettings(locale).catch(() => null),
    ])

  const showPrices = settings?.showPrices !== false

  const products = productsResult.docs.map((p) => ({
    id: String(p.id),
    title: p.title || '',
    slug: p.slug || '',
    price: p.price ?? null,
    salePrice: p.salePrice ?? null,
    isNew: p.isNew ?? false,
    images: (p.images as { image: unknown }[] | undefined) ?? [],
  }))

  const categories = categoriesResult.docs.map((c) => ({
    slug: c.slug || '',
    name: c.name || '',
    count: countByCategorySlug[c.slug || ''] ?? 0,
  }))

  return (
    <>
      {/* Hero banner with breadcrumbs */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-black mb-3">
            {t('breadcrumbShop')}
          </h1>
          <nav className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
            <Link href={`/${locale}`} className="hover:text-black">{t('breadcrumbHome')}</Link>
            <ChevronRight size={14} className="rtl:rotate-180" />
            <span className="text-black">{t('breadcrumbShop')}</span>
          </nav>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          {/* Sidebar */}
          <aside>
            <h2 className="font-semibold text-sm uppercase tracking-wider text-black mb-4">
              {t('categories')}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/products`}
                  className={`flex items-center justify-between hover:text-black transition-colors ${
                    !category ? 'text-black font-medium' : 'text-gray-600'
                  }`}
                >
                  <span>{t('all')}</span>
                  <span className="text-gray-400 text-xs">({totalCount})</span>
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${locale}/products?category=${cat.slug}`}
                    className={`flex items-center justify-between hover:text-black transition-colors ${
                      category === cat.slug ? 'text-black font-medium' : 'text-gray-600'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-gray-400 text-xs">({cat.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Grid */}
          <Suspense>
            <ProductGrid products={products} showPrices={showPrices} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
