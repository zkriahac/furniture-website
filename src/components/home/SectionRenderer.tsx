import HeroSlider from './HeroSlider'
import CategoryCircles from './CategoryCircles'
import PromoBanners from './PromoBanners'
import FeaturedProducts from './FeaturedProducts'
import BrandShowcase from './BrandShowcase'
import Testimonials from './Testimonials'
import Collaborators from './Collaborators'
import Newsletter from './Newsletter'
import NewsSection from './NewsSection'
import ContactCta from './ContactCta'
import { getPayload } from '@/lib/getPayload'
import { getContactInfo } from '@/lib/getGlobals'
import { getImageUrl } from '@/lib/utils'

type Locale = 'tr' | 'en' | 'ar'

type Section = {
  blockType: string
  [key: string]: unknown
}

type Props = {
  sections: Section[]
  locale: Locale
}

export default async function SectionRenderer({ sections, locale }: Props) {
  const payload = await getPayload()

  const rendered = await Promise.all(
    sections.map(async (section, idx) => {
      const key = `${section.blockType}-${idx}`

      switch (section.blockType) {
        case 'heroSlides': {
          const slides = ((section.slides as unknown[]) || []).map((raw) => {
            const s = raw as {
              title?: string
              subtitle?: string
              ctaLabel?: string
              ctaHref?: string
              image?: unknown
            }
            return {
              title: s.title || '',
              subtitle: s.subtitle || '',
              ctaLabel: s.ctaLabel || '',
              ctaHref: s.ctaHref || `/${locale}/products`,
              imageSrc: getImageUrl(s.image) || '',
              imageAlt: s.title || '',
            }
          })
          return <HeroSlider key={key} slides={slides} />
        }

        case 'categoryGrid': {
          const limit = (section.limit as number) || 8
          const manualIds = ((section.categories as unknown[]) || [])
            .map((c) => (typeof c === 'object' && c && 'id' in c ? (c as { id: string | number }).id : c))
            .filter(Boolean)

          const result = manualIds.length
            ? await payload.find({
                collection: 'categories',
                locale,
                where: { id: { in: manualIds as (string | number)[] } },
                limit: manualIds.length,
                depth: 1,
              })
            : await payload.find({ collection: 'categories', locale, limit, depth: 1 })

          const categories = result.docs.map((cat) => ({
            id: String(cat.id),
            name: cat.name || '',
            slug: cat.slug || '',
            image: cat.image,
            productCount: undefined,
          }))
          return <CategoryCircles key={key} categories={categories} />
        }

        case 'promoBanners': {
          const banners = ((section.banners as unknown[]) || []).map((raw) => {
            const b = raw as {
              eyebrow?: string
              title?: string
              image?: unknown
              background?: string
              href?: string
            }
            return {
              eyebrow: b.eyebrow || '',
              title: b.title || '',
              image: getImageUrl(b.image),
              background: (b.background as 'amber' | 'teal' | 'gray') || 'amber',
              href: b.href || `/${locale}/products`,
            }
          })
          return <PromoBanners key={key} banners={banners} />
        }

        case 'featuredProducts': {
          const limit = (section.limit as number) || 8
          const mode = (section.mode as string) || 'featured'
          let result
          if (mode === 'manual') {
            const manualIds = ((section.products as unknown[]) || [])
              .map((p) => (typeof p === 'object' && p && 'id' in p ? (p as { id: string | number }).id : p))
              .filter(Boolean) as (string | number)[]
            result = manualIds.length
              ? await payload.find({
                  collection: 'products',
                  locale,
                  where: { id: { in: manualIds } },
                  limit: manualIds.length,
                  depth: 2,
                })
              : { docs: [] }
          } else if (mode === 'newest') {
            result = await payload.find({
              collection: 'products',
              locale,
              sort: '-createdAt',
              limit,
              depth: 2,
            })
          } else {
            result = await payload.find({
              collection: 'products',
              locale,
              where: { featured: { equals: true } },
              limit,
              depth: 2,
            })
          }

          const products = result.docs.map((p) => ({
            id: String(p.id),
            title: p.title || '',
            slug: p.slug || '',
            price: p.price ?? null,
            salePrice: p.salePrice ?? null,
            isNew: p.isNew ?? false,
            images: (p.images as { image: unknown }[] | undefined) ?? [],
          }))
          return <FeaturedProducts key={key} products={products} />
        }

        case 'brandShowcase': {
          const brands = ((section.brands as unknown[]) || [])
            .map((raw) => {
              const b = raw as { name?: string; image?: unknown; logo?: unknown }
              return {
                name: b.name || '',
                image: getImageUrl(b.image) || '',
                logo: getImageUrl(b.logo),
              }
            })
            .filter((b) => b.image)
          return (
            <BrandShowcase
              key={key}
              title={(section.heading as string) || ''}
              brands={brands}
            />
          )
        }

        case 'testimonials': {
          const items = ((section.items as unknown[]) || []).map((raw) => {
            const t = raw as {
              name?: string
              role?: string
              text?: string
              stars?: number
              avatar?: unknown
            }
            return {
              name: t.name || '',
              role: t.role || '',
              text: t.text || '',
              stars: t.stars ?? 5,
              avatar: getImageUrl(t.avatar),
            }
          })
          return <Testimonials key={key} items={items} />
        }

        case 'collaborators': {
          const logos = ((section.logos as unknown[]) || [])
            .map((raw) => {
              const c = raw as { name?: string; logo?: unknown }
              return { name: c.name || '', logo: getImageUrl(c.logo) || '' }
            })
            .filter((c) => c.logo)
          return (
            <Collaborators
              key={key}
              title={(section.heading as string) || ''}
              logos={logos}
            />
          )
        }

        case 'newsletter':
          return (
            <Newsletter
              key={key}
              heading={(section.heading as string) || ''}
              placeholder={(section.placeholder as string) || ''}
              buttonLabel={(section.buttonLabel as string) || ''}
            />
          )

        case 'latestPosts': {
          const limit = (section.limit as number) || 3
          const result = await payload
            .find({
              collection: 'posts',
              locale,
              sort: '-publishedAt',
              limit,
              depth: 1,
            })
            .catch(() => ({ docs: [] as Array<Record<string, unknown>> }))

          const posts = result.docs.map((p: Record<string, unknown>) => ({
            id: String(p.id),
            title: (p.title as string) || '',
            slug: (p.slug as string) || '',
            cover: getImageUrl(p.cover),
            category: (p.category as string) || '',
            author: (p.author as string) || '',
            publishedAt: p.publishedAt as string | undefined,
          }))
          return <NewsSection key={key} posts={posts} locale={locale} />
        }

        case 'contactCta': {
          const contact = await getContactInfo(locale)
          return (
            <ContactCta
              key={key}
              title={(section.title as string) || ''}
              subtitle={(section.subtitle as string) || ''}
              phone={contact?.phone || ''}
              locale={locale}
            />
          )
        }

        case 'richText':
          return (
            <RichTextSection
              key={key}
              heading={(section.heading as string) || ''}
              content={section.content}
              align={(section.align as 'left' | 'center') || 'center'}
            />
          )

        case 'imageBanner':
          return (
            <ImageBannerSection
              key={key}
              src={getImageUrl(section.image) || ''}
              alt={(section.alt as string) || ''}
              caption={(section.caption as string) || ''}
              href={(section.href as string) || ''}
              height={(section.height as 'small' | 'medium' | 'large') || 'medium'}
            />
          )

        case 'cta':
          return (
            <CtaSection
              key={key}
              title={(section.title as string) || ''}
              subtitle={(section.subtitle as string) || ''}
              buttonLabel={(section.buttonLabel as string) || ''}
              buttonHref={(section.buttonHref as string) || '#'}
              background={(section.background as 'amber' | 'teal' | 'gray' | 'white') || 'amber'}
            />
          )

        default:
          return null
      }
    }),
  )

  return <>{rendered}</>
}

function RichTextSection({
  heading,
  content,
  align,
}: {
  heading: string
  content: unknown
  align: 'left' | 'center'
}) {
  const text = extractRichText(content)
  return (
    <section className="py-16 px-4">
      <div
        className={`max-w-4xl mx-auto ${align === 'center' ? 'text-center' : 'text-left'}`}
      >
        {heading && <h2 className="text-3xl font-bold mb-6">{heading}</h2>}
        {text && <div className="prose prose-lg mx-auto">{text}</div>}
      </div>
    </section>
  )
}

function extractRichText(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''
  const walk = (nodes: unknown[]): string =>
    nodes
      .map((n) => {
        const node = n as { text?: string; children?: unknown[] }
        if (typeof node.text === 'string') return node.text
        if (Array.isArray(node.children)) return walk(node.children)
        return ''
      })
      .join(' ')
  return walk(root.children)
}

function ImageBannerSection({
  src,
  alt,
  caption,
  href,
  height,
}: {
  src: string
  alt: string
  caption: string
  href: string
  height: 'small' | 'medium' | 'large'
}) {
  if (!src) return null
  const heights = { small: 'h-48', medium: 'h-80', large: 'h-[28rem]' }
  const inner = (
    <div className={`relative w-full ${heights[height]} overflow-hidden rounded-lg`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-4 text-center">
          {caption}
        </div>
      )}
    </div>
  )
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {href ? (
          <a href={href} className="block">
            {inner}
          </a>
        ) : (
          inner
        )}
      </div>
    </section>
  )
}

function CtaSection({
  title,
  subtitle,
  buttonLabel,
  buttonHref,
  background,
}: {
  title: string
  subtitle: string
  buttonLabel: string
  buttonHref: string
  background: 'amber' | 'teal' | 'gray' | 'white'
}) {
  const bg = {
    amber: 'bg-amber-700 text-white',
    teal: 'bg-teal-600 text-white',
    gray: 'bg-gray-100 text-gray-900',
    white: 'bg-white text-gray-900 border border-gray-200',
  }[background]

  return (
    <section className="py-16 px-4">
      <div className={`max-w-5xl mx-auto rounded-2xl p-12 text-center ${bg}`}>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
        {subtitle && <p className="text-lg mb-6 opacity-90">{subtitle}</p>}
        <a
          href={buttonHref}
          className="inline-block px-8 py-3 rounded-full bg-white text-gray-900 font-medium hover:opacity-90 transition"
        >
          {buttonLabel}
        </a>
      </div>
    </section>
  )
}
