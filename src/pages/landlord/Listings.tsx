import { Link } from 'react-router-dom'
import { MapPin, Plus } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useMyRoom } from '../../hooks/useMyRoom'

export default function Listings() {
  const { session } = useAuth()
  const { room, loading, reload } = useMyRoom()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <p className="text-muted">Loading…</p>

  if (!room) {
    return (
      <div className="text-center mt-16">
        <h1 className="text-2xl font-bold">My Listing</h1>
        <p className="text-muted mt-2 mb-6">You haven't posted a room yet.</p>
        <Link
          to="/listings/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold"
        >
          <Plus size={18} /> Add Room
        </Link>
      </div>
    )
  }

  const toggleActive = async () => {
    setBusy(true)
    setError('')
    const { error } = await supabase.from('rooms').update({ is_active: !room.is_active }).eq('id', room.id)
    if (error) setError(error.message)
    await reload()
    setBusy(false)
  }

  const remove = async () => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    setBusy(true)
    setError('')
    // Remove the photo first, then the row
    await supabase.storage.from('room-photos').remove([`${session!.user.id}/room.jpg`])
    const { error } = await supabase.from('rooms').delete().eq('id', room.id)
    if (error) setError(error.message)
    await reload()
    setBusy(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Listing</h1>

      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        {room.photo_url && (
          <img src={room.photo_url} alt={room.title} className="w-full aspect-video object-cover" />
        )}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold text-lg">{room.title}</h2>
            <span
              className={`text-xs rounded-full px-3 py-1 shrink-0 ${
                room.is_active ? 'bg-success/20 text-success' : 'bg-surface-2 text-muted'
              }`}
            >
              {room.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-primary-soft font-semibold">R{room.price.toLocaleString()} / month</p>
          <p className="text-sm text-muted flex items-center gap-1">
            <MapPin size={14} /> {room.location}
          </p>
          <p className="text-sm text-muted capitalize">
            {room.room_type} · {room.rooms_available} room{room.rooms_available === 1 ? '' : 's'} available ·{' '}
            {room.max_people} per room
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Link to="/listings/edit" className="text-center rounded-xl bg-primary py-3 font-semibold">
          Edit
        </Link>
        <button disabled={busy} onClick={toggleActive} className="rounded-xl border border-border py-3 disabled:opacity-60">
          {room.is_active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
      <button disabled={busy} onClick={remove} className="mt-3 w-full rounded-xl border border-red-500/50 text-red-400 py-3 disabled:opacity-60">
        Delete listing
      </button>
    </div>
  )
}