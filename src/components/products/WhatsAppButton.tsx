'use client'

import { MessageCircle } from 'lucide-react'

type Props = {
  phone: string
  productName: string
  messagePrefix: string
  label: string
}

export default function WhatsAppButton({ phone, productName, messagePrefix, label }: Props) {
  const handleClick = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const message = `${messagePrefix} ${productName}\n${url}`
    const waUrl = `https://wa.me/${phone.replace(/^\+/, '')}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-full font-medium text-sm hover:bg-[#1ebe5a] transition-colors"
    >
      <MessageCircle size={16} />
      {label}
    </button>
  )
}
