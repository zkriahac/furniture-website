import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type Banner = {
  eyebrow: string
  title: string
  image: string | null
  background: 'amber' | 'teal' | 'gray'
  href: string
}

type Props = { banners: Banner[] }

const styles: Record<Banner['background'], { wrap: string; eyebrow: string; title: string; link: string }> = {
  amber: {
    wrap: 'bg-amber-900',
    eyebrow: 'text-white/70',
    title: 'text-white',
    link: 'text-white',
  },
  teal: {
    wrap: 'bg-teal-100',
    eyebrow: 'text-teal-700/70',
    title: 'text-gray-900',
    link: 'text-gray-800',
  },
  gray: {
    wrap: 'bg-gray-200',
    eyebrow: 'text-gray-500',
    title: 'text-gray-900',
    link: 'text-gray-800',
  },
}

export default async function PromoBanners({ banners }: Props) {
  const t = await getTranslations()

  if (!banners.length) return null

  const [tall, ...rest] = banners

  const renderBanner = (banner: Banner, isTall: boolean) => {
    const s = styles[banner.background]
    return (
      <div
        key={banner.title}
        className={`relative rounded-2xl overflow-hidden ${s.wrap} ${
          isTall ? 'min-h-[420px] flex items-end' : 'min-h-[200px] flex items-center'
        } p-8`}
      >
        {banner.image ? (
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-80"
          />
        ) : null}
        {isTall && banner.image ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        ) : null}
        <div className="relative z-10">
          {banner.eyebrow ? (
            <p className={`${s.eyebrow} text-xs uppercase tracking-widest mb-2`}>{banner.eyebrow}</p>
          ) : null}
          <h3 className={`font-heading ${isTall ? 'text-3xl sm:text-4xl' : 'text-2xl'} font-bold ${s.title} mb-3 whitespace-pre-line`}>
            {banner.title}
          </h3>
          <Link
            href={banner.href}
            className={`inline-flex items-center gap-1 ${s.link} text-sm underline underline-offset-4 hover:no-underline`}
          >
            {t('home.viewAll')} <ArrowUpRight size={14} className="rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderBanner(tall, true)}
        <div className="flex flex-col gap-4">
          {rest.map((b) => renderBanner(b, false))}
        </div>
      </div>
    </section>
  )
}
