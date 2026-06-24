import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { formatPrice, getImageUrl } from '@/lib/utils'

type Props = {
  title: string
  slug: string
  price?: number | null
  salePrice?: number | null
  isNew?: boolean
  imageUrl?: string | null
  imageAlt?: string
  locale: string
  currency?: string
}

export default function ProductCard({
  title,
  slug,
  price,
  salePrice,
  isNew,
  imageUrl,
  imageAlt,
  locale,
  currency = '₺',
}: Props) {
  const displayPrice = salePrice ?? price

  return (
    <Link href={`/${locale}/products/${slug}`} className="group block">
      <div className="relative bg-surface rounded-2xl overflow-hidden aspect-[4/3] mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-gray-200">
            🛋️
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1">
          {isNew && <Badge variant="new">New</Badge>}
          {salePrice && price && salePrice < price && <Badge variant="sale">Sale</Badge>}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm text-black mb-1 group-hover:underline line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {displayPrice ? (
            <>
              {salePrice && price && salePrice < price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(price, currency)}
                </span>
              )}
              <span className="text-sm font-semibold text-black">
                {formatPrice(displayPrice, currency)}
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-500 italic">Fiyat için iletişime geçin</span>
          )}
        </div>
      </div>
    </Link>
  )
}
