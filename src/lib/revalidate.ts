import { revalidatePath, revalidateTag } from 'next/cache'

const LOCALES = ['tr', 'en', 'ar'] as const

export function revalidateAllLocalesPath(path: string) {
  for (const loc of LOCALES) {
    revalidatePath(`/${loc}${path === '/' ? '' : path}`)
  }
}

export function revalidateProducts(slug?: string | null) {
  revalidateAllLocalesPath('/')
  revalidateAllLocalesPath('/products')
  if (slug) revalidateAllLocalesPath(`/products/${slug}`)
  revalidateTag('products')
}

export function revalidateBlog(slug?: string | null) {
  revalidateAllLocalesPath('/')
  revalidateAllLocalesPath('/blog')
  if (slug) revalidateAllLocalesPath(`/blog/${slug}`)
  revalidateTag('blog')
}

export function revalidateGlobals() {
  for (const loc of LOCALES) {
    revalidatePath(`/${loc}`, 'layout')
  }
  revalidateTag('globals')
}
