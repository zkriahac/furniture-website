'use server'

import { getPayload } from '@/lib/getPayload'
import { getSiteSettings } from '@/lib/getGlobals'

type ContactData = {
  name: string
  email: string
  phone?: string
  message: string
}

type Result = { success: true } | { success: false; error: string }

async function sendResendEmail(opts: {
  apiKey: string
  from: string
  to: string
  replyTo: string
  subject: string
  html: string
}) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      reply_to: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    console.error('Resend API error:', res.status, body)
  }
}

export async function submitContact(data: ContactData): Promise<Result> {
  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
      },
    })

    const settings = await getSiteSettings('en').catch(() => null)
    const apiKey = settings?.resendApiKey
    const fromEmail = settings?.fromEmail
    const fromName = settings?.fromName || 'Mobilyam'
    const notify = settings?.notificationEmail
    if (apiKey && fromEmail && notify) {
      const html = `
        <h2>New contact submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || '-'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br/>')}</p>
      `
      await sendResendEmail({
        apiKey,
        from: `${fromName} <${fromEmail}>`,
        to: notify,
        replyTo: data.email,
        subject: `New contact from ${data.name}`,
        html,
      }).catch((e) => console.error('Email notify failed:', e))
    }

    return { success: true }
  } catch (err) {
    console.error('Contact submission error:', err)
    return { success: false, error: 'Submission failed. Please try again.' }
  }
}
