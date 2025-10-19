import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../../lib/supabaseClient'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(2),
})

export default function Register() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    setError('')
    setMessage('')
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.full_name },
        emailRedirectTo: window.location.origin + '/verify-email',
      }
    })
    if (signUpError) return setError(signUpError.message)
    if (data?.user) setMessage('Check your email to verify your account.')
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {message && <div className="text-green-700 mb-2">{message}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input className="w-full border rounded px-3 py-2" type="text" {...register('full_name')} />
          {errors.full_name && <p className="text-red-600 text-sm">{errors.full_name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" {...register('email')} />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input className="w-full border rounded px-3 py-2" type="password" {...register('password')} />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">Create account</button>
      </form>
      <div className="text-sm mt-3">
        <Link to="/login" className="underline">Already have an account? Sign in</Link>
      </div>
    </div>
  )
}
