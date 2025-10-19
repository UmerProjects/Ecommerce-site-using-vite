import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../../lib/supabaseClient'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword(values)
    if (signInError) {
      setError(signInError.message)
      return
    }
    navigate('/')
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
        <button disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">Sign in</button>
      </form>
      <div className="text-sm mt-3 flex justify-between">
        <Link to="/reset-password" className="underline">Forgot password?</Link>
        <Link to="/register" className="underline">Create account</Link>
      </div>
    </div>
  )
}
