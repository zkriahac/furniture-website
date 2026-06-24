import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ArrowUpRight } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { getPayload } from '@/lib/getPayload'
import { getImageUrl } from '@/lib/utils'

type Props = { params: Promise<{ locale: string }> }

export const revalidate = 2592000

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'posts',
    locale: locale as 'tr' | 'en' | 'ar',
    sort: '-publishedAt',
    limit: 100,
    depth: 1,
  })

  const posts = result.docs.map((p) => ({
    id: String(p.id),
    title: p.title || '',
    slug: p.slug || '',
    excerpt: p.excerpt || '',
    cover: getImageUrl(p.cover),
    author: p.author || 'Mobilyam',
    category: p.category || '',
    publishedAt: p.publishedAt as string | undefined,
  }))

  return (
    <>
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-black mb-3">
            {t('blog.title')}
          </h1>
          <nav className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
            <Link href={`/${locale}`} className="hover:text-black">{t('products.breadcrumbHome')}</Link>
            <ChevronRight size={14} className="rtl:rotate-180" />
            <span className="text-black">{t('blog.title')}</span>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-16">{t('blog.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/${locale}/blog/${post.slug}`}>
                  <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                    {post.cover ? (
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : null}
                  </div>
                </Link>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  {post.publishedAt ? (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </time>
                  ) : null}
                  {post.category ? (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{post.category}</span>
                    </>
                  ) : null}
                  {post.author ? (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{t('blog.by')} {post.author}</span>
                    </>
                  ) : null}
                </div>
                <h2 className="font-heading text-lg font-bold text-black leading-snug mb-3">
                  <Link href={`/${locale}/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 border border-gray-200 rounded-full px-4 py-2 hover:border-black hover:text-black"
                >
                  {t('blog.readFull')} <ArrowUpRight size={14} className="rtl:-scale-x-100" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
