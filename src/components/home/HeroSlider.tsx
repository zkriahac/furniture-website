'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

type Slide = {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
}

type Props = {
  slides: Slide[]
}

export default function HeroSlider({ slides }: Props) {
  const [active, setActive] = useState(0)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  if (!slides.length) return null
  const slide = slides[active]

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[680px] lg:min-h-[760px] flex items-center bg-background -mt-16 pt-16">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-12 md:py-20">
          <div className="order-2 md:order-1">
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-black leading-[1.05] mb-8 whitespace-pre-line tracking-tight">
              {slide.title}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-lg mb-10 leading-relaxed">
              {slide.subtitle}
            </p>
            <Link
              href={slide.ctaHref}
              className="inline-flex items-center gap-2 bg-black text-white px-10 py-5 rounded-full font-medium text-base hover:bg-gray-800 transition-colors"
            >
              {slide.ctaLabel}
              <ArrowUpRight size={18} className="rtl:-scale-x-100" />
            </Link>
          </div>

          {slide.imageSrc ? (
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative w-full h-[320px] sm:h-[420px] md:h-[560px] lg:h-[640px]">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute end-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full border transition-colors ${
                i === active ? 'bg-black border-black' : 'bg-transparent border-gray-300 hover:border-gray-500'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
