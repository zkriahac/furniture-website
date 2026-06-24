import { getTranslations } from 'next-intl/server'
import { Star } from 'lucide-react'

type Testimonial = {
  name: string
  role: string
  text: string
  stars: number
}

type Props = { items: Testimonial[] }

export default async function Testimonials({ items }: Props) {
  const t = await getTranslations()

  if (!items.length) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-black mb-10 text-center">
          {t('home.testimonialsTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.name} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                &quot;{item.text}&quot;
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-black">{item.name}</p>
                    {item.role ? <p className="text-xs text-gray-500">{item.role}</p> : null}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
