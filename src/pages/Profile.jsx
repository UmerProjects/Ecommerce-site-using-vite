import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabaseClient'
import { useState, useEffect } from 'react'

export default function Profile() {
  const { user } = useAuth()
  const { register, handleSubmit, reset } = useForm()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.user_metadata) {
      reset({ full_name: user.user_metadata.full_name || '' })
    }
  }, [user, reset])

  const onSubmit = async (values) => {
    setMessage('')
    setError('')
    const { error: err } = await supabase.auth.updateUser({
      data: { full_name: values.full_name || '' },
    })
    if (err) return setError(err.message)
    setMessage('Profile updated!')
  }

  const onChangePassword = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const newPassword = form.get('new_password')
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    if (err) return setError(err.message)
    setMessage('Password changed!')
    e.currentTarget.reset()
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      {message && <div className="text-green-700 mb-2">{message}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mb-8">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input className="w-full border rounded px-3 py-2" type="text" {...register('full_name')} />
        </div>
        <button className="bg-black text-white px-4 py-2 rounded">Save</button>
      </form>

      <form onSubmit={onChangePassword} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">New password</label>
          <input className="w-full border rounded px-3 py-2" type="password" name="new_password" required minLength={6} />
        </div>
        <button className="bg-black text-white px-4 py-2 rounded">Change Password</button>
      </form>
    </div>
  )
}
