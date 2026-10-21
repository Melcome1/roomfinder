import { Link, Navigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Welcome() {
  const { profile } = useAuth()
  if (profile) return <Navigate to={profile.role === 'landlord' ? '/listings' : '/'} replace />

  return (
    <div className="mx-auto max-w-md min-h-full flex flex-col items-center justify-center px-6 gap-3">
      <Home size={64} className="text-primary" />
      <h1 className="text-4xl font-bold">
        Room<span className="text-primary-soft">Finder</span>
      </h1>
      <p className="text-muted mb-8">Find Your Next Home</p>

      <Link to="/register" className="w-full text-center rounded-xl bg-primary py-3 font-semibold">
        Create Account
      </Link>
      <Link to="/login" className="w-full text-center rounded-xl border border-primary py-3 font-semibold">
        Log In
      </Link>
    </div>
  )
}