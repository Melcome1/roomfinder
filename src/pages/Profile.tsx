import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { profile, session, signOut } = useAuth()

  if (!session) {
  return (
    <div className="text-center mt-16">
      <p className="text-muted mb-6">You're not signed in.</p>
      <Link to="/login" className="inline-block rounded-xl bg-primary px-6 py-3 font-semibold">Sign in</Link>
    </div>
  )
}

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="mt-6 rounded-xl bg-surface border border-border p-4 space-y-2">
        <p className="font-semibold">{profile?.full_name}</p>
        <p className="text-sm text-muted">{session?.user.email}</p>
        <p className="text-sm text-muted">{profile?.phone}</p>
        <span className="inline-block text-xs rounded-full bg-surface-2 px-3 py-1 capitalize">
          {profile?.role}
        </span>
      </div>

      <button onClick={signOut} className="mt-6 w-full rounded-xl border border-border py-3">
        Log out
      </button>
    </div>
  )
}