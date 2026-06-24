# Architecture

## Tech stack
- **Next.js 15.3.9** (App Router, RSC) — pinned for Payload peer-dep compatibility
- **Payload 3.x** with `@payloadcms/db-sqlite` (zero-config local DB at `./database.db`)
- **next-intl 4.x** — TR (default) / EN / AR with RTL
- **Tailwind 3.4** (NOT v4 — clashes with Payload admin CSS)
- **sharp** for image resizing

## Plugin order (critical)
`next.config.mjs` must wrap as `withPayload(withNextIntl(nextConfig))`. Payload outermost.

## Middleware
`src/middleware.ts` excludes `/admin` and `/api` so next-intl doesn't intercept admin routes.

## Collections
| Slug | Purpose |
|---|---|
| `products` | Catalog items (title, slug, images[], category, price, salePrice, isNew, featured, sku, tags, specs[], description) |
| `categories` | Product categories (name, slug, image) |
| `media` | Uploads — `public/media/`, sizes thumbnail/card/hero |
| `contact-submissions` | Public-create, admin-read submissions from contact form |
| `posts` | Blog posts (title, slug, cover, excerpt, body, author, category, publishedAt, tags, featured) |
| `users` | Payload built-in admin users |

## Globals
| Slug | Purpose |
|---|---|
| `homepage` | Announcement, hero slides, promo banners, brand showcase, testimonials, collaborators, newsletter, contact CTA |
| `contact-info` | Phone, email, address, hours, company description, social handles |
| `site-settings` | Tabs: Brand · Languages · Menu · SEO · Analytics · AI · Email · Social |

All collections + globals declare `access.read = () => true` so the public site can fetch them; write access defaults to authenticated admin users.

## Routes
- `/` → redirects to `/tr`
- `/[locale]` → home
- `/[locale]/products` → list (sidebar categories with counts, no price/color filters)
- `/[locale]/products/[slug]` → detail (gallery, Phone + WhatsApp CTAs, share buttons, SKU/category/tags)
- `/[locale]/blog` → posts list
- `/[locale]/blog/[slug]` → post detail
- `/[locale]/about`, `/[locale]/contact`
- `/admin` → Payload panel
- `/api/seed` POST → wipes & re-seeds demo data
- `/api/ai/generate` POST → AI copy generation (uses Site Settings → AI tab)
