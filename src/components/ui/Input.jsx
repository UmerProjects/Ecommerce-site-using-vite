import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

export default function Input({ className, ...props }) {
  return <input className={twMerge(clsx('flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50', className))} {...props} />
}
