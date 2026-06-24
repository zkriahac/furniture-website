'use client'

import { useState } from 'react'
import Image from 'next/image'

type GalleryImage = { url: string; alt?: string }

type Props = { images: GalleryImage[] }

export default function ImageGallery({ images }: Props) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-square bg-surface rounded-2xl flex items-center justify-center text-8xl text-gray-200">
        🛋️
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-surface rounded-2xl overflow-hidden">
        <Image
          src={images[active].url}
          alt={images[active].alt || 'Product image'}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
