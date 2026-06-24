# Cloning for a new project

This template is intentionally kept generic. To spin up a new showcase site:

```bash
cp -R /path/to/furniture /path/to/newsite
cd /path/to/newsite
rm -rf node_modules .next database.db public/media seed-assets
npm install
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
# paste into .env.local PAYLOAD_SECRET
npm run dev
curl -X POST http://localhost:3000/api/seed   # demo data + admin user
```

## What to change per project

| File | Change |
|---|---|
| `package.json` | `name`, version |
| `src/i18n/routing.ts` + `src/payload.config.ts` | `locales`, `defaultLocale` |
| `src/i18n/messages/*.json` | Translations |
| `src/app/api/seed/route.ts` | `CATEGORIES`, `PRODUCTS`, hero/banner copy |
| `seed-assets/` | Replace with the new project's images |
| `src/components/admin/{Logo,Icon}.tsx` | Brand SVG |
| `tailwind.config.ts` | Colour palette, fonts |
| `src/app/(frontend)/[locale]/layout.tsx` | Site title fallback |
| `next.config.mjs` | `images.remotePatterns` if you serve uploads off another domain |

## Things you should NOT need to touch
- Caching/revalidate hooks — automatic
- Mobile drawer menu — driven by `SiteSettings.navMenu`
- Globals plumbing (`src/lib/getGlobals.ts`) — generic
- ProductCard / ProductGrid / ImageGallery — works with any image count
- WhatsApp share link — uses ContactInfo phone
- AI endpoint — switch provider in admin
