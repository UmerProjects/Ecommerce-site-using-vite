import { useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const navigate = useNavigate()
  useEffect(() => {
    supabase.auth.signOut().finally(() => navigate('/login', { replace: true }))
  }, [navigate])
  return <div className="p-6">Signing out...</div>
}
