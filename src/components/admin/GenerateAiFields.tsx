'use client'

import React, { useState } from 'react'
import { useForm, useFormFields, useLocale } from '@payloadcms/ui'

type FieldEntry = { value?: unknown }

export default function GenerateAiFields() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const { dispatchFields } = useForm()
  const localeObj = useLocale()
  const locale = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'en'

  const formData = useFormFields(([fields]) => ({
    title: ((fields?.title as FieldEntry)?.value as string) || '',
    sku: ((fields?.sku as FieldEntry)?.value as string) || '',
    tags: ((fields?.tags as FieldEntry)?.value as string) || '',
    specs: ((fields?.specs as FieldEntry)?.value as Array<{ label?: string; value?: string }>) || [],
    category: ((fields?.category as FieldEntry)?.value as unknown) || null,
  }))

  const generate = async () => {
    setError(null)
    setDone(false)
    if (!formData.title) {
      setError('Add a title first.')
      return
    }
    setLoading(true)
    try {
      const specsLine = (formData.specs || [])
        .filter((s) => s?.label && s?.value)
        .map((s) => `${s.label}: ${s.value}`)
        .join('; ')
      const contextParts = [
        formData.sku ? `SKU: ${formData.sku}` : '',
        formData.tags ? `Tags: ${formData.tags}` : '',
        specsLine ? `Specs: ${specsLine}` : '',
      ].filter(Boolean)

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.title,
          context: contextParts.join(' | ') || undefined,
          locales: [locale],
          fields: ['description', 'excerpt'],
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Generation failed')
      }
      const out = json.result?.[locale] || {}
      if (out.description) {
        dispatchFields({
          type: 'UPDATE',
          path: 'description',
          value: out.description,
        })
      }
      if (out.excerpt) {
        dispatchFields({
          type: 'UPDATE',
          path: 'excerpt',
          value: out.excerpt,
        })
      }
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        margin: '12px 0',
        padding: 12,
        border: '1px solid var(--theme-elevation-100, #e5e5e5)',
        borderRadius: 4,
        background: 'var(--theme-elevation-50, #fafafa)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: 'black',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 500,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Generating…' : `✨ Generate description with AI (${locale.toUpperCase()})`}
        </button>
        <span style={{ fontSize: 12, color: 'var(--theme-elevation-500, #666)' }}>
          Uses title, SKU, tags & specs as context. Fills excerpt + description for the current locale.
        </span>
      </div>
      {error ? (
        <p style={{ color: '#c00', fontSize: 12, marginTop: 8 }}>{error}</p>
      ) : null}
      {done && !error ? (
        <p style={{ color: '#0a7', fontSize: 12, marginTop: 8 }}>
          ✓ Filled. Don&apos;t forget to save the document.
        </p>
      ) : null}
    </div>
  )
}
