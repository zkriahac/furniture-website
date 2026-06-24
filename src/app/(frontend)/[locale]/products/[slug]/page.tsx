import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Phone } from 'lucide-react'
import { getPayload } from '@/lib/getPayload'
import { getContactInfo } from '@/lib/getGlobals'
import ImageGallery from '@/components/products/ImageGallery'
import WhatsAppButton from '@/components/products/WhatsAppButton'
import ShareButtons from '@/components/products/ShareButtons'
import { formatPrice } from '@/lib/utils'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export const revalidate = 2592000 // 30 days

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('products')

  const payload = await getPayload()
  const loc = locale as 'tr' | 'en' | 'ar'

  const [result, contact] = await Promise.all([
    payload.find({
      collection: 'products',
      locale: loc,
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    }),
    getContactInfo(locale),
  ])

  if (!result.docs.length) notFound()

  const product = result.docs[0]

  const images = ((product.images as { image: unknown }[]) ?? [])
    .map((item) => {
      const img = item.image as { url?: string; alt?: string } | null
      if (!img?.url) return null
      return { url: img.url, alt: img.alt || product.title || '' }
    })
    .filter(Boolean) as { url: string; alt: string }[]

  const displayPrice = (product.salePrice as number | null) ?? (product.price as number | null)
  const originalPrice = product.salePrice ? (product.price as number | null) : null

  const category = product.category as { name?: string; slug?: string } | null
  const phone = contact?.phone || ''
  const phoneDigits = phone.replace(/[^+\d]/g, '')

  const tags = typeof product.tags === 'string' ? product.tags.split(',').map((s) => s.trim()).filter(Boolean) : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1.5 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-black">{t('breadcrumbHome')}</Link>
        <ChevronRight size={14} className="rtl:rotate-180" />
        <Link href={`/${locale}/products`} className="hover:text-black">{t('breadcrumbShop')}</Link>
        {category?.name ? (
          <>
            <ChevronRight size={14} className="rtl:rotate-180" />
            <Link href={`/${locale}/products?category=${category.slug}`} className="hover:text-black">
              {category.name}
            </Link>
          </>
        ) : null}
        <ChevronRight size={14} className="rtl:rotate-180" />
        <span className="text-black">{product.title as string}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <ImageGallery images={images} />

        <div className="flex flex-col gap-5">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-black leading-tight">
            {product.title as string}
          </h1>

          <div className="flex items-center gap-3">
            {displayPrice ? (
              <>
                {originalPrice ? (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(originalPrice, '$')}
                  </span>
                ) : null}
                <span className="text-2xl font-bold text-black">
                  {formatPrice(displayPrice, '$')}
                </span>
              </>
            ) : (
              <p className="text-gray-500 italic">{t('contactForPrice')}</p>
            )}
          </div>

          {product.excerpt ? (
            <p className="text-gray-600 leading-relaxed text-sm max-w-md">
              {String(product.excerpt)}
            </p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {phone ? (
              <a
                href={`tel:${phoneDigits}`}
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3.5 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                <Phone size={16} />
                {t('callForOrder')}
              </a>
            ) : null}
            {phone ? (
              <WhatsAppButton
                phone={phoneDigits}
                productName={product.title as string}
                messagePrefix={t('whatsappMessage')}
                label={t('whatsappOrder')}
              />
            ) : null}
          </div>

          <div className="pt-2">
            <ShareButtons productName={product.title as string} shareLabel={t('share')} />
          </div>

          <div className="border-t border-gray-100 pt-5 mt-3 space-y-2 text-sm">
            {product.sku ? (
              <p>
                <span className="text-gray-500">{t('sku')}:</span>{' '}
                <span className="text-black">{product.sku as string}</span>
              </p>
            ) : null}
            {category?.name ? (
              <p>
                <span className="text-gray-500">{t('category')}:</span>{' '}
                <Link href={`/${locale}/products?category=${category.slug}`} className="text-black hover:underline">
                  {category.name}
                </Link>
              </p>
            ) : null}
            {tags.length ? (
              <p>
                <span className="text-gray-500">{t('tag')}:</span>{' '}
                <span className="text-black">{tags.join(', ')}</span>
              </p>
            ) : null}
          </div>

          {Array.isArray(product.specs) && product.specs.length > 0 ? (
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-3">
                {t('specs')}
              </h3>
              <dl className="divide-y divide-gray-100">
                {(product.specs as { label: string; value: string }[]).map((spec) => (
                  <div key={spec.label} className="flex justify-between py-2 text-sm">
                    <dt className="text-gray-500">{spec.label}</dt>
                    <dd className="font-medium text-black">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      {product.description ? (
        <section className="mt-16 pt-12 border-t border-gray-100">
          <div className="max-w-3xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-black mb-6">
              {t('description')}
            </h2>
            <div
              className="prose prose-gray max-w-none text-gray-700 leading-relaxed
                         prose-headings:font-heading prose-headings:text-black
                         prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                         prose-h4:text-base prose-h4:mt-6 prose-h4:mb-2
                         prose-p:my-4 prose-ul:my-4 prose-li:my-1
                         prose-strong:text-black"
              dangerouslySetInnerHTML={{ __html: String(product.description) }}
            />
          </div>
        </section>
      ) : null}
    </div>
  )
}
