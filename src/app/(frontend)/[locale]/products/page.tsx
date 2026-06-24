import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { getPayload } from '@/lib/getPayload'
import ProductGrid from '@/components/products/ProductGrid'
import { Suspense } from 'react'

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

  const payload = await getPayload()
  const loc = locale as 'tr' | 'en' | 'ar'

  const [productsResult, categoriesResult, allProductsResult] = await Promise.all([
    payload.find({
      collection: 'products',
      locale: loc,
      where: category ? { 'category.slug': { equals: category } } : {},
      limit: 100,
      depth: 2,
    }),
    payload.find({ collection: 'categories', locale: loc, limit: 20 }),
    payload.find({ collection: 'products', limit: 1000, depth: 1 }),
  ])

  const products = productsResult.docs.map((p) => ({
    id: String(p.id),
    title: p.title || '',
    slug: p.slug || '',
    price: p.price ?? null,
    salePrice: p.salePrice ?? null,
    isNew: p.isNew ?? false,
    images: (p.images as { image: unknown }[] | undefined) ?? [],
  }))

  const countByCategorySlug = new Map<string, number>()
  for (const p of allProductsResult.docs) {
    const cat = p.category as { slug?: string } | null
    if (!cat?.slug) continue
    countByCategorySlug.set(cat.slug, (countByCategorySlug.get(cat.slug) ?? 0) + 1)
  }

  const categories = categoriesResult.docs.map((c) => ({
    slug: c.slug || '',
    name: c.name || '',
    count: countByCategorySlug.get(c.slug || '') ?? 0,
  }))
  const totalCount = allProductsResult.totalDocs

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
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
