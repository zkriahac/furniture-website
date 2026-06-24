import { getTranslations } from 'next-intl/server'

type Props = { text?: string | null }

export default async function AnnouncementBar({ text }: Props) {
  const t = await getTranslations()
  const message = text || t('announcement')
  if (!message) return null
  return (
    <div className="bg-black text-white text-center text-sm py-2 px-4">
      {message}
    </div>
  )
}
