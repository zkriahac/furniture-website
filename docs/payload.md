# Payload admin & globals

## Custom branding
Logo + Icon defined in `src/components/admin/{Logo,Icon}.tsx` and registered in `payload.config.ts → admin.components.graphics`. Replace the SVG inside those files (or swap to `<img src="..." />`) for a custom brand. Title/description/favicon configured under `admin.meta`.

## Site Settings tabs
At `/admin/globals/site-settings`:
1. **Brand** — siteName, tagline, logo, favicon
2. **Languages** — toggle which locales appear in the public switcher
3. **Menu** — top-nav items, each can have children for sub-menus
4. **SEO** — metaTitle, metaDescription, metaKeywords, ogImage (drives `generateMetadata`)
5. **Analytics** — gaMeasurementId (G-XXXX), gtmId (GTM-XXXX), facebookPixelId
6. **AI** — provider (gemini/openai/anthropic), apiKey, optional model override
7. **Email (Resend)** — apiKey, fromName, fromEmail, notificationEmail (where contact submissions are sent)
8. **Social** — instagram, facebook, twitter, linkedin, youtube

## Localised content
- Locales: `tr`, `en`, `ar` (config in `payload.config.ts → localization`)
- Localised fields are marked `localized: true` per field
- Fall back to default (`tr`) when a locale is missing (`localization.fallback: true`)

## Globals — saving localised arrays
Payload v3 needs stable IDs across locale updates. Pattern in [`src/app/api/seed/route.ts`](../src/app/api/seed/route.ts):

1. `updateGlobal({locale: 'en', data: ...})` — Payload allocates IDs
2. `findGlobal({locale: 'en', depth: 0})` — extract array IDs
3. `updateGlobal({locale: 'tr', data: {...arrayWithSameIds}})`
4. Same for `ar`

Without IDs, each locale creates a fresh array and previous localised data is lost.

## Schema migrations
SQLite + drizzle-kit auto-pushes schema on dev start. New columns are added silently. **Renaming or removing fields triggers an interactive prompt that hangs the server**. To recover:
```bash
rm database.db && rm -rf .next && npm run dev
curl -X POST http://localhost:3000/api/seed
```
For production, run drizzle-kit migrations explicitly.
