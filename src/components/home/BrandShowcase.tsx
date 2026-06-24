'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Brand = {
  name: string
  image: string
  logo: string | null
}

type Props = {
  title: string
  brands: Brand[]
}

export default function BrandShowcase({ title, brands }: Props) {
  const [start, setStart] = useState(0)
  if (!brands.length) return null

  const visible = 3
  const max = Math.max(0, brands.length - visible)

  const slice = brands.slice(start, start + visible)

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-black mb-8">{title}</h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => setStart((s) => Math.max(0, s - 1))}
            disabled={start === 0}
            aria-label="Previous"
            className="absolute -start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center disabled:opacity-30 z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slice.map((b) => (
              <div key={b.name} className="rounded-2xl overflow-hidden bg-white border border-gray-100">
                <div className="relative aspect-[16/10]">
                  <Image src={b.image} alt={b.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                {b.logo ? (
                  <div className="relative h-24 flex items-center justify-center bg-white">
                    <Image src={b.logo} alt={`${b.name} logo`} width={200} height={64} className="object-contain max-h-16" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStart((s) => Math.min(max, s + 1))}
            disabled={start >= max}
            aria-label="Next"
            className="absolute -end-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center disabled:opacity-30 z-10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
