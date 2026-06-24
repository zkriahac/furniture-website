'use client'

import { useState } from 'react'

type Props = {
  heading: string
  placeholder: string
  buttonLabel: string
}

export default function Newsletter({ heading, placeholder, buttonLabel }: Props) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed whitespace-pre-line">{heading}</p>
        {done ? (
          <p className="text-sm text-green-700">✓ Done</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDone(true)
            }}
            className="flex items-center bg-white border border-gray-200 rounded-full p-1.5 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 bg-transparent text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800"
            >
              {buttonLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
