import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  arrow?: boolean
  as?: 'button' | 'span'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  children,
  className,
  as: Tag = 'button',
  ...rest
}: Props) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-full transition-all duration-200 cursor-pointer'

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    outline: 'bg-white text-black border border-black hover:bg-gray-50',
    ghost: 'text-black hover:underline',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <Tag className={cn(base, variants[variant], sizes[size], className)} {...(rest as any)}>
      {children}
      {arrow && <ArrowUpRight size={16} className="rtl:-scale-x-100" />}
    </Tag>
  )
}
