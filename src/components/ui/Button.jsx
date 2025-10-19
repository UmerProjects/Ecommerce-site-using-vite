import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

export default function Button({ 
  className, 
  variant = 'default', 
  size = 'default',
  loading = false,
  children,
  ...props 
}) {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-lg',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400',
    ghost: 'text-gray-700 hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 hover:shadow-lg',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 hover:scale-105 hover:shadow-lg',
  }
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 py-1 text-xs',
    lg: 'h-12 px-8 py-3 text-base',
    xl: 'h-14 px-10 py-4 text-lg',
    icon: 'h-10 w-10 p-0',
  }
  
  return (
    <button 
      className={twMerge(clsx(base, variants[variant], sizes[size], className))} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  )
}
