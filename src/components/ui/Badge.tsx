import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  variant?: 'new' | 'sale' | 'default'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: Props) {
  const variants = {
    new: 'bg-black text-white',
    sale: 'bg-red-600 text-white',
    default: 'bg-gray-100 text-gray-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
