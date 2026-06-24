# Caching & revalidation

## Strategy
- Public pages set `export const revalidate = 2592000` (30 days) — pages are statically generated and cached aggressively
- Mutations in Payload trigger `revalidatePath` via collection/global hooks (see `src/lib/revalidate.ts`)
- All locales are revalidated on every change (`revalidateAllLocalesPath`)

## Hook map
| Source | Triggers |
|---|---|
| `Products` afterChange / afterDelete | `revalidateProducts()` → `/`, `/products` for all locales |
| `Categories` afterChange / afterDelete | `revalidateProducts()` |
| `Posts` afterChange / afterDelete | `revalidateBlog()` → `/blog` for all locales |
| `Homepage` / `ContactInfo` / `SiteSettings` afterChange | `revalidateGlobals()` → layout for all locales |

## Adding a new revalidation path
Edit `src/lib/revalidate.ts` and either add a new helper or extend an existing one. Hooks live in the collection/global file under `hooks.afterChange`.
