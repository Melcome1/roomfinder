import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { RoomType, RoomWithLandlord } from '../types/room'

export type Filters = {
  query: string
  type: RoomType | 'all'
  maxPrice: string
}

export function useRooms(filters: Filters) {
  const [rooms, setRooms] = useState<RoomWithLandlord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { query, type, maxPrice } = filters

  useEffect(() => {
    let cancelled = false
    // Debounce typing so we don't query on every keystroke
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')

      let q = supabase
        .from('rooms')
        .select('*, landlord:profiles!landlord_id(full_name, phone)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      const clean = query.trim().replace(/[,()%*]/g, ' ')
      if (clean) q = q.or(`location.ilike.%${clean}%,title.ilike.%${clean}%`)
      if (type !== 'all') q = q.eq('room_type', type)
      if (maxPrice && Number(maxPrice) > 0) q = q.lte('price', Number(maxPrice))

      const { data, error } = await q
      if (cancelled) return
      if (error) setError(error.message)
      else setRooms((data as unknown as RoomWithLandlord[]) ?? [])
      setLoading(false)
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, type, maxPrice])

  return { rooms, loading, error }
}