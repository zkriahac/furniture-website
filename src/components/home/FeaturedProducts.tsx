import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import { ArrowUpRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { getImageUrl } from '@/lib/utils'

type Product = {
  id: string
  title: string
  slug: string
  price?: number | null
  salePrice?: number | null
  isNew?: boolean
  images?: { image: unknown }[]
}

type Props = {
  products: Product[]
}

export default async function FeaturedProducts({ products }: Props) {
  const t = await getTranslations()
  const locale = await getLocale()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-black mb-2">
              {t('home.featuredTitle')}
            </h2>
            <p className="text-gray-500 text-sm">{t('home.featuredSubtitle')}</p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-black underline underline-offset-4 hover:no-underline"
          >
            {t('home.viewAll')} <ArrowUpRight size={14} className="rtl:-scale-x-100" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => {
            const firstImage = p.images?.[0]?.image
            const imageUrl = getImageUrl(firstImage)
            return (
              <ProductCard
                key={p.id}
                title={p.title}
                slug={p.slug}
                price={p.price}
                salePrice={p.salePrice}
                isNew={p.isNew}
                imageUrl={imageUrl}
                locale={locale}
              />
            )
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-1 text-sm font-medium text-black underline underline-offset-4"
          >
            {t('home.viewAll')} <ArrowUpRight size={14} className="rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  )
}
