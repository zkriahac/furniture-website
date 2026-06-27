import { setRequestLocale, getTranslations } from 'next-intl/server'
import { unstable_cache } from 'next/cache'
import { routing } from '@/i18n/routing'
import { getPayload } from '@/lib/getPayload'
import { getHomepage, getSiteSettings } from '@/lib/getGlobals'
import HeroSlider from '@/components/home/HeroSlider'
import CategoryCircles from '@/components/home/CategoryCircles'
import PromoBanners from '@/components/home/PromoBanners'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BrandShowcase from '@/components/home/BrandShowcase'
import Testimonials from '@/components/home/Testimonials'
import Collaborators from '@/components/home/Collaborators'
import Newsletter from '@/components/home/Newsletter'
import NewsSection from '@/components/home/NewsSection'
import SectionRenderer from '@/components/home/SectionRenderer'
import { getImageUrl } from '@/lib/utils'

const HOME_CACHE = { revalidate: 3600, tags: ['home-data'] }

const getCachedHomeCategories = unstable_cache(
  async (locale: string) => {
    const payload = await getPayload()
    return payload.find({ collection: 'categories', locale: locale as 'tr' | 'en' | 'ar', limit: 8, depth: 1 })
  },
  ['home-categories'],
  HOME_CACHE,
)

const getCachedFeaturedProducts = unstable_cache(
  async (locale: string) => {
    const payload = await getPayload()
    return payload.find({
      collection: 'products',
      locale: locale as 'tr' | 'en' | 'ar',
      where: { featured: { equals: true } },
      limit: 8,
      depth: 1,
    })
  },
  ['home-featured'],
  HOME_CACHE,
)

const getCachedLatestPosts = unstable_cache(
  async (locale: string) => {
    const payload = await getPayload()
    return payload
      .find({ collection: 'posts', locale: locale as 'tr' | 'en' | 'ar', sort: '-publishedAt', limit: 3, depth: 1 })
      .catch(() => ({ docs: [] as Array<Record<string, unknown>> }))
  },
  ['home-posts'],
  HOME_CACHE,
)

type Props = {
  params: Promise<{ locale: string }>
}

export const revalidate = 2592000 // 30 days

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()

  const [categoriesResult, featuredResult, homepage, postsResult, settings] = await Promise.all([
    getCachedHomeCategories(locale),
    getCachedFeaturedProducts(locale),
    getHomepage(locale),
    getCachedLatestPosts(locale),
    getSiteSettings(locale).catch(() => null),
  ])

  const showPrices = settings?.showPrices !== false

  const latestPosts = postsResult.docs.map((p: Record<string, unknown>) => ({
    id: String(p.id),
    title: (p.title as string) || '',
    slug: (p.slug as string) || '',
    cover: getImageUrl(p.cover),
    category: (p.category as string) || '',
    author: (p.author as string) || '',
    publishedAt: p.publishedAt as string | undefined,
  }))

  const categories = categoriesResult.docs.map((cat) => ({
    id: String(cat.id),
    name: cat.name || '',
    slug: cat.slug || '',
    image: cat.image,
    productCount: undefined,
  }))

  const featured = featuredResult.docs.map((p) => ({
    id: String(p.id),
    title: p.title || '',
    slug: p.slug || '',
    price: p.price ?? null,
    salePrice: p.salePrice ?? null,
    isNew: p.isNew ?? false,
    images: (p.images as { image: unknown }[] | undefined) ?? [],
  }))

  const heroSlides =
    (homepage?.heroSlides ?? []).length > 0
      ? homepage!.heroSlides!.map((s) => ({
          title: s.title || t('home.heroTitle'),
          subtitle: s.subtitle || t('home.heroSubtitle'),
          ctaLabel: s.ctaLabel || t('home.heroCta'),
          ctaHref: `/${locale}/products`,
          imageSrc: getImageUrl(s.image) || '',
          imageAlt: s.title || '',
        }))
      : [
          {
            title: t('home.heroTitle'),
            subtitle: t('home.heroSubtitle'),
            ctaLabel: t('home.heroCta'),
            ctaHref: `/${locale}/products`,
            imageSrc: '',
            imageAlt: t('home.heroTitle'),
          },
        ]

  const banners = (homepage?.promoBanners ?? []).map((b) => ({
    eyebrow: b.eyebrow || '',
    title: b.title || '',
    image: getImageUrl(b.image),
    background: (b.background as 'amber' | 'teal' | 'gray') || 'amber',
    href: `/${locale}/products`,
  }))

  const testimonials = (homepage?.testimonials ?? []).map((t) => ({
    name: t.name || '',
    role: t.role || '',
    text: t.text || '',
    stars: t.stars ?? 5,
    avatar: getImageUrl(t.avatar),
  }))

  const brands = (homepage?.brands ?? [])
    .map((b) => ({
      name: b.name || '',
      image: getImageUrl(b.image) || '',
      logo: getImageUrl(b.logo),
    }))
    .filter((b) => b.image)

  const collaborators = (homepage?.collaborators ?? [])
    .map((c) => ({ name: c.name || '', logo: getImageUrl(c.logo) || '' }))
    .filter((c) => c.logo)

  const newsletterHeading = homepage?.newsletter?.heading || t('newsletter.heading')
  const newsletterPlaceholder = homepage?.newsletter?.placeholder || t('newsletter.placeholder')
  const newsletterButton = homepage?.newsletter?.buttonLabel || t('newsletter.button')

  const sections = (homepage?.sections ?? []) as Array<{ blockType: string; [k: string]: unknown }>
  if (sections.length > 0) {
    return <SectionRenderer sections={sections} locale={locale as 'tr' | 'en' | 'ar'} showPrices={showPrices} />
  }

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <CategoryCircles categories={categories} />
      <PromoBanners banners={banners} />
      <FeaturedProducts products={featured} showPrices={showPrices} />
      <BrandShowcase title={t('home.brandsTitle')} brands={brands} />
      <NewsSection posts={latestPosts} locale={locale} />
      <Testimonials items={testimonials} />
      <Collaborators title={t('home.collaboratorsTitle')} logos={collaborators} />
      <Newsletter
        heading={newsletterHeading}
        placeholder={newsletterPlaceholder}
        buttonLabel={newsletterButton}
      />
    </>
  )
}
