import { getLocale, getTranslations } from 'next-intl/server'
import ProductCard from './ProductCard'
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

type Props = { products: Product[] }

export default async function ProductGrid({ products }: Props) {
  const locale = await getLocale()
  const t = await getTranslations('common')

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        {t('noProducts')}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((p) => {
        const imageUrl = getImageUrl(p.images?.[0]?.image)
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
  )
}
