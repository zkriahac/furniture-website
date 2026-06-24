import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type Post = {
  id: string
  title: string
  slug: string
  cover: string | null
  category: string
  author: string
  publishedAt?: string
}

type Props = { posts: Post[]; locale: string }

export default async function NewsSection({ posts, locale }: Props) {
  const t = await getTranslations()
  if (!posts.length) return null

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-black">
            {t('blog.newsTitle')}
          </h2>
          <Link
            href={`/${locale}/blog`}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-black underline underline-offset-4 hover:no-underline"
          >
            {t('home.viewAll')} <ArrowUpRight size={14} className="rtl:-scale-x-100" />
          </Link>
        </div>

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
              <h3 className="font-heading text-base font-bold text-black leading-snug mb-3">
                <Link href={`/${locale}/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-full px-3 py-1.5 hover:border-black hover:text-black"
              >
                {t('blog.readFull')} <ArrowUpRight size={12} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
