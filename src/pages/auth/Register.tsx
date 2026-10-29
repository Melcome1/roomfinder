import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth, type Role } from '../../context/AuthContext'
import Field from '../../components/Field'

export default function Register() {
  const { profile } = useAuth()
  const [role, setRole] = useState<Role>('tenant')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  if (profile) {
  return <Navigate to={from ?? (profile.role === 'landlord' ? '/listings' : '/')} replace />
}

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, full_name: fullName, phone } },
    })
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div className="mx-auto max-w-md min-h-full px-6 py-10">
      <h1 className="text-3xl font-bold">Create Account</h1>
      <p className="text-muted mt-1 mb-6">I want to…</p>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {(['tenant', 'landlord'] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-xl py-3 border font-semibold ${
              role === r ? 'bg-primary border-primary' : 'bg-surface border-border text-muted'
            }`}
          >
            {r === 'tenant' ? 'Find a room' : 'List rooms'}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <Field
          label="Phone (e.g. +27821234567)"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required={role === 'landlord'}
        />
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field
          label="Password (min 6 characters)"
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button disabled={busy} className="w-full rounded-xl bg-primary py-3 font-semibold disabled:opacity-60">
          {busy ? 'Creating…' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-muted text-center mt-6">
        Already have an account? <Link to="/login" state={location.state} className="text-primary-soft">Log in</Link> 
      </p>
    </div>
  )
}