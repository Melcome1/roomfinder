import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, type Role } from '../context/AuthContext'

export default function RoleGuard({ allow }: { allow: Role }) {
  const { role } = useAuth()

  if (role === allow) return <Outlet />
  if (allow === 'tenant' && role === null) return <Outlet /> // guests can browse

  if (role === 'landlord') return <Navigate to="/listings" replace />
  if (role === 'tenant') return <Navigate to="/" replace />
  return <Navigate to="/login" replace />
}