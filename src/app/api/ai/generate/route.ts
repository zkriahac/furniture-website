import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/getPayload'

type Body = {
  topic: string
  context?: string
  tone?: string
  locales?: ('en' | 'tr' | 'ar')[]
  fields?: ('description' | 'excerpt' | 'metaTitle' | 'metaDescription' | 'tags')[]
  productId?: string | number
}

type Generated = {
  description?: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  tags?: string
}

const DEFAULT_MODELS: Record<string, string> = {
  gemini: 'gemini-1.5-flash',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-haiku-4-5-20251001',
}

function buildPrompt(body: Body, locale: string): string {
  const fields = body.fields ?? ['description', 'excerpt', 'metaTitle', 'metaDescription', 'tags']
  const langName = { en: 'English', tr: 'Turkish', ar: 'Arabic' }[locale] || locale
  return `You are a furniture e-commerce copywriter. Write content in ${langName}.

Product topic: ${body.topic}
${body.context ? `Extra context: ${body.context}` : ''}
${body.tone ? `Tone: ${body.tone}` : 'Tone: warm, premium, concise'}

Return STRICT JSON with these keys (only the ones requested): ${fields.join(', ')}.

Field rules:
- excerpt: 1–2 sentences, max 30 words, plain text — used as a teaser under the price
- description: rich HTML using <p>, <h3>, <ul>, <li>, <strong> only. 3–5 short paragraphs or sections. Highlight materials, craftsmanship, use cases, and care. No <html>, <body>, <head>, <script>, <style>, no inline styles, no class attributes.
- metaTitle: max 60 characters, plain text
- metaDescription: max 155 characters, plain text
- tags: 3–6 short comma-separated tags

Output ONLY the raw JSON object, no markdown code fences, no commentary.`
}

async function callGemini(apiKey: string, model: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  })
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function callOpenAI(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

async function callAnthropic(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.content?.[0]?.text ?? ''
}

function parseJson(raw: string): Generated {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return {}
      }
    }
    return {}
  }
}

const ALLOWED_TAGS = ['p', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'br']

function sanitizeHtml(html: string): string {
  if (!html) return ''
  // strip unsupported tags entirely
  return html
    .replace(/<\/?([a-z][a-z0-9]*)\s*[^>]*>/gi, (match, tag) => {
      const t = String(tag).toLowerCase()
      if (!ALLOWED_TAGS.includes(t)) return ''
      // re-emit just <tag> or </tag> with no attributes
      return match.startsWith('</') ? `</${t}>` : `<${t}>`
    })
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .trim()
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body
  if (!body.topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  const payload = await getPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const provider = (settings?.aiProvider as string) || 'gemini'
  const apiKey = (settings?.aiApiKey as string) || ''
  const model = (settings?.aiModel as string) || DEFAULT_MODELS[provider] || 'gemini-1.5-flash'

  if (!apiKey) {
    return NextResponse.json(
      { error: 'No AI API key configured in Site Settings → AI tab' },
      { status: 400 },
    )
  }

  const locales = body.locales ?? ['en']
  const result: Record<string, Generated> = {}

  for (const loc of locales) {
    const prompt = buildPrompt(body, loc)
    let raw = ''
    try {
      if (provider === 'openai') raw = await callOpenAI(apiKey, model, prompt)
      else if (provider === 'anthropic') raw = await callAnthropic(apiKey, model, prompt)
      else raw = await callGemini(apiKey, model, prompt)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'AI call failed' },
        { status: 500 },
      )
    }
    const parsed = parseJson(raw)
    if (parsed.description) parsed.description = sanitizeHtml(parsed.description)
    result[loc] = parsed
  }

  return NextResponse.json({ ok: true, provider, model, result })
}
