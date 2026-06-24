import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { getPayload } from '@/lib/getPayload'
import { getImageUrl } from '@/lib/utils'
import ShareButtons from '@/components/products/ShareButtons'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 2592000

export default async function BlogPost({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'posts',
    locale: locale as 'tr' | 'en' | 'ar',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  if (!result.docs.length) notFound()
  const post = result.docs[0]
  const cover = getImageUrl(post.cover)

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-black">{t('products.breadcrumbHome')}</Link>
        <ChevronRight size={14} className="rtl:rotate-180" />
        <Link href={`/${locale}/blog`} className="hover:text-black">{t('blog.title')}</Link>
        <ChevronRight size={14} className="rtl:rotate-180" />
        <span className="text-black">{post.title as string}</span>
      </nav>

      <div className="text-xs text-gray-500 mb-3 flex items-center gap-3">
        {post.publishedAt ? (
          <time dateTime={post.publishedAt as string}>
            {new Date(post.publishedAt as string).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}
          </time>
        ) : null}
        {post.category ? <span>· {post.category as string}</span> : null}
        {post.author ? <span>· {t('blog.by')} {post.author as string}</span> : null}
      </div>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-black leading-tight mb-6">
        {post.title as string}
      </h1>

      {cover ? (
        <div className="relative aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden mb-8">
          <Image src={cover} alt={post.title as string} fill sizes="100vw" className="object-cover" priority />
        </div>
      ) : null}

      {post.excerpt ? (
        <p className="text-lg text-gray-700 leading-relaxed mb-6">{post.excerpt as string}</p>
      ) : null}

      {post.body ? (
        <div className="prose prose-gray max-w-none whitespace-pre-line text-gray-700 leading-relaxed">
          {post.body as string}
        </div>
      ) : null}

      <div className="border-t border-gray-100 mt-10 pt-6">
        <ShareButtons productName={post.title as string} shareLabel={t('products.share')} />
      </div>
    </article>
  )
}
