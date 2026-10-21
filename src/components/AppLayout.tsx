import { Navigate, Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import { useAuth } from '../context/AuthContext'

export default function AppLayout() {
  const { role, loading } = useAuth()

  if (loading) {
    return <div className="min-h-full grid place-items-center text-muted">Loading…</div>
  }
  if (!role) return <Navigate to="/welcome" replace />

  return (
    <div className="mx-auto max-w-md min-h-full bg-bg">
      <main className="pb-24 px-4 pt-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}