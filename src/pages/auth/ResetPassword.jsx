import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../../lib/supabaseClient'
import { useState } from 'react'

const schema = z.object({ email: z.string().email() })

export default function ResetPassword() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    setError('')
    setMessage('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: window.location.origin + '/reset-password',
    })
    if (err) return setError(err.message)
    setMessage('Password reset link sent. Check your email.')
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
      {message && <div className="text-green-700 mb-2">{message}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" {...register('email')} />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">Send reset link</button>
      </form>
    </div>
  )
}
