import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Field from '../../components/Field'

export default function Login() {
  const { profile } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (profile) return <Navigate to={profile.role === 'landlord' ? '/listings' : '/'} replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div className="mx-auto max-w-md min-h-full px-6 py-10">
      <h1 className="text-3xl font-bold">Log In</h1>
      <p className="text-muted mt-1 mb-6">Welcome back.</p>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button disabled={busy} className="w-full rounded-xl bg-primary py-3 font-semibold disabled:opacity-60">
          {busy ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <p className="text-sm text-muted text-center mt-6">
        No account yet? <Link to="/register" className="text-primary-soft">Create one</Link>
      </p>
    </div>
  )
}