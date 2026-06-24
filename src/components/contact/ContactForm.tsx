'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { submitContact } from '@/actions/submitContact'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function ContactForm() {
  const t = useTranslations('contact')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as {
      name: string
      email: string
      phone?: string
      message: string
    }

    startTransition(async () => {
      const result = await submitContact(data)
      if (result.success) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    })
  }

  const fieldClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">{t('name')}</label>
          <input name="name" type="text" required placeholder={t('name')} className={fieldClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">{t('email')}</label>
          <input name="email" type="email" required placeholder={t('email')} className={fieldClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">{t('phone')}</label>
        <input name="phone" type="tel" placeholder={t('phone')} className={fieldClass} />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">{t('message')}</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t('message')}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto self-start inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-gray-800 disabled:opacity-60 transition-colors"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        {t('submit')}
      </button>

      {status === 'success' && (
        <div className="flex items-start gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
          <CheckCircle size={18} className="shrink-0 mt-0.5" />
          <span>{t('success')}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{t('error')}</span>
        </div>
      )}
    </form>
  )
}
