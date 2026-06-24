'use client'

import { useState } from 'react'
import { Facebook, Twitter, Linkedin, MessageCircle, Link as LinkIcon, Check } from 'lucide-react'

type Props = {
  productName: string
  shareLabel?: string
}

export default function ShareButtons({ productName, shareLabel = 'Share' }: Props) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const text = `${productName} — ${url}`

  const links = [
    {
      name: 'Facebook',
      Icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:text-[#1877F2]',
    },
    {
      name: 'Twitter',
      Icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      color: 'hover:text-black',
    },
    {
      name: 'LinkedIn',
      Icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:text-[#0A66C2]',
    },
    {
      name: 'WhatsApp',
      Icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(text)}`,
      color: 'hover:text-[#25D366]',
    },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may be blocked */
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-gray-500">{shareLabel}:</span>
      {links.map(({ name, Icon, href, color }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${name}`}
          className={`w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-colors ${color}`}
        >
          <Icon size={15} />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black"
      >
        {copied ? <Check size={15} /> : <LinkIcon size={15} />}
      </button>
    </div>
  )
}
