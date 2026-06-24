# Email & contact form

## Resend
Configure in Site Settings → Email (Resend):
- `resendApiKey` — from https://resend.com/api-keys
- `fromName` (e.g. `Mobilyam`)
- `fromEmail` — must be on a verified domain in Resend
- `notificationEmail` — recipient for new submissions

## Flow
1. User submits the contact form (`src/components/contact/ContactForm.tsx`)
2. Server action [`submitContact`](../src/actions/submitContact.ts) creates a `contact-submissions` record
3. If Resend keys are configured, an email is sent to `notificationEmail` with `replyTo: <user email>`
4. If keys are missing, submission is still saved silently — admin can review at `/admin/collections/contact-submissions`

## Failure modes
- Resend errors are logged to server stdout, never raised to the user
- Submission persistence is what matters — email is best-effort
