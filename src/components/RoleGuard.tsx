import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, type Role } from '../context/AuthContext'

export default function RoleGuard({ allow }: { allow: Role }) {
  const { role } = useAuth()
  if (role !== allow) {
    return <Navigate to={role === 'landlord' ? '/listings' : '/'} replace />
  }
  return <Outlet />
}