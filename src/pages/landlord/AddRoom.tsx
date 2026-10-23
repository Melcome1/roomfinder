import { Navigate } from 'react-router-dom'
import RoomForm from '../../components/RoomForm'
import { useMyRoom } from '../../hooks/useMyRoom'

export default function AddRoom() {
  const { room, loading } = useMyRoom()
  if (loading) return <p className="text-muted">Loading…</p>
  if (room) return <Navigate to="/listings/edit" replace />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Room</h1>
      <RoomForm />
    </div>
  )
}