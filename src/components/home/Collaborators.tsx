import Image from 'next/image'

type Logo = { name: string; logo: string }

type Props = {
  title: string
  logos: Logo[]
}

export default function Collaborators({ title, logos }: Props) {
  if (!logos.length) return null
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-black mb-10 text-center">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {logos.map((l) => (
            <div
              key={l.name}
              className="bg-gray-50 rounded-xl flex items-center justify-center h-32 px-6"
            >
              <Image
                src={l.logo}
                alt={l.name}
                width={200}
                height={80}
                className="object-contain max-h-12 opacity-80"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
