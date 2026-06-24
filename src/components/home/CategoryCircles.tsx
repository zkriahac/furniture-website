import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import { getImageUrl } from '@/lib/utils'

type Category = {
  id: string
  name: string
  slug: string
  image?: unknown
  productCount?: number
}

type Props = {
  categories: Category[]
}

export default async function CategoryCircles({ categories }: Props) {
  const t = await getTranslations()
  const locale = await getLocale()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-black mb-3">
            {t('home.shopByCategory')}
          </h2>
          <p className="text-gray-500 text-sm">{t('home.categorySubtitle')}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((cat) => {
            const imageUrl = getImageUrl(cat.image)
            return (
              <Link
                key={cat.id}
                href={`/${locale}/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gray-100 ring-2 ring-transparent group-hover:ring-black transition-all duration-300">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                      🪑
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm text-black">{cat.name}</p>
                  {cat.productCount !== undefined && (
                    <p className="text-xs text-gray-500">
                      {cat.productCount} {t('home.products')}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
