import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useFavourites } from '../../hooks/useFavourites'
import RoomCard from '../../components/RoomCard'
import type { Room } from '../../types/room'

export default function Saved() {
  const { session } = useAuth()
  const userId = session?.user.id
  const { ids, toggle } = useFavourites()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('favourites')
      .select('room:rooms(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = (data ?? [])
          .map((row) => (row as unknown as { room: Room | null }).room)
          .filter((r): r is Room => !!r)
        setRooms(list)
        setLoading(false)
      })
  }, [userId])

  // Removing a heart here drops the card from the list straight away
  const visible = rooms.filter((r) => ids.has(r.id))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Saved Rooms</h1>
      {loading && <p className="text-muted">Loading…</p>}
      <div className="space-y-4">
        {visible.map((room) => (
          <RoomCard key={room.id} room={room} isFav onToggleFav={toggle} />
        ))}
      </div>
      {!loading && visible.length === 0 && (
        <p className="text-center text-muted mt-12">
          Nothing saved yet. Tap the heart on a room to keep it here.
        </p>
      )}
    </div>
  )
}