# AI auto-fill

Endpoint: `POST /api/ai/generate` (`src/app/api/ai/generate/route.ts`)

Reads provider + key from Site Settings → AI tab. Supports:
- **Google Gemini** (default model `gemini-1.5-flash`)
- **OpenAI** (default `gpt-4o-mini`, uses JSON mode)
- **Anthropic** (default `claude-haiku-4-5-20251001`)

## Request

```json
{
  "topic": "Modern dark wood chair",
  "context": "Solid oak frame, fabric upholstery, 80cm height",
  "tone": "warm, premium, concise",
  "locales": ["en", "tr", "ar"],
  "fields": ["description", "metaTitle", "metaDescription", "tags"]
}
```

## Response

```json
{
  "ok": true,
  "provider": "gemini",
  "model": "gemini-1.5-flash",
  "result": {
    "en": { "description": "...", "metaTitle": "...", "metaDescription": "...", "tags": "chair, wood, modern" },
    "tr": { "description": "...", ... },
    "ar": { "description": "...", ... }
  }
}
```

## Calling from the admin
For now, call manually via `fetch` in browser console while logged in to the admin, or wire a custom Payload field component (`src/components/admin/`) with a "Generate with AI" button that posts to this endpoint and patches the form.

## Adding a new provider
Add a `callXxx` function in `src/app/api/ai/generate/route.ts` and a switch branch in `POST`. Add the provider option to `SiteSettings` → AI → `aiProvider` select.
