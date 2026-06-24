import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number | undefined | null, currency = '₺'): string {
  if (price == null) return ''
  return `${currency}${price.toLocaleString('tr-TR')}`
}

export function getImageUrl(image: unknown): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  if (typeof image === 'object' && image !== null && 'url' in image) {
    return (image as { url: string }).url
  }
  return null
}
