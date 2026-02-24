import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../../lib/supabaseClient'
import { useState, useEffect } from 'react'

const schema = z.object({ email: z.string().email() })

export default function ResetPassword() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isRecovery, setIsRecovery] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  // When user comes from the email link, Supabase adds parameters in the hash
  // like #access_token=...&type=recovery. Detect that mode.
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('type=recovery')) {
      setIsRecovery(true)
    }
  }, [])

  const onRequestReset = async (values) => {
    setError('')
    setMessage('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: window.location.origin + '/reset-password',
    })
    if (err) return setError(err.message)
    setMessage('Password reset link sent. Check your email.')
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const form = new FormData(e.currentTarget)
    const password = form.get('password')
    const confirmPassword = form.get('confirm_password')

    if (!password || typeof password !== 'string' || password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setError(err.message)
      return
    }

    setMessage('Your password has been reset. You can now log in with your new password.')
    e.currentTarget.reset()
  }

  if (isRecovery) {
    // User clicked the email link and is now setting a new password
    return (
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Set new password</h1>
        {message && <div className="text-green-700 mb-2">{message}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={onSubmitNewPassword} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">New password</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              name="password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm new password</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              name="confirm_password"
              required
              minLength={6}
            />
          </div>
          <button className="w-full bg-black text-white py-2 rounded">Update password</button>
        </form>
      </div>
    )
  }

  // Default: user is requesting a reset email
  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
      {message && <div className="text-green-700 mb-2">{message}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit(onRequestReset)} className="space-y-3">
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
