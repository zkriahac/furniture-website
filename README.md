# Mobilyam — Project Reference

A reusable Next.js 15 + Payload CMS starter for furniture/showcase sites with multi-locale (TR/EN/AR + RTL), Furnisy-inspired design, contact-only checkout, and admin-controlled everything.

## Quick start

```bash
npm install
cp .env.example .env.local   # set PAYLOAD_SECRET
npm run dev                  # admin: /admin, site: /tr
curl -X POST http://localhost:3000/api/seed   # seeds demo data
```

Default seeded admin: `zkriahagmohamad@gmail.com` / `changeme123` — change at `/admin/account`.

## Architecture map

| Concern | File / Folder |
|---|---|
| Frontend pages | `src/app/(frontend)/[locale]/...` |
| Payload admin | `src/app/(payload)/admin/[[...segments]]` |
| Payload REST/GraphQL | `src/app/(payload)/api/` |
| Custom seed endpoint | `src/app/api/seed/route.ts` |
| Custom AI endpoint | `src/app/api/ai/generate/route.ts` |
| Collections | `src/collections/` |
| Globals | `src/globals/` |
| i18n routing | `src/i18n/routing.ts`, `src/middleware.ts` |
| Translations | `src/i18n/messages/{tr,en,ar}.json` |
| Components | `src/components/{layout,home,products,contact,admin,ui}` |
| Lib helpers | `src/lib/` |
| Server actions | `src/actions/` |

## Submodule docs

- [Architecture & data model](./docs/architecture.md)
- [Payload admin & globals](./docs/payload.md)
- [Internationalisation (TR/EN/AR + RTL)](./docs/i18n.md)
- [Caching & revalidation](./docs/caching.md)
- [AI auto-fill (Gemini / OpenAI / Anthropic)](./docs/ai.md)
- [Email (Resend) & contact form](./docs/email.md)
- [Cloning for a new project](./docs/reuse.md)
