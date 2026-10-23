import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Room } from '../types/room'

export function useMyRoom() {
  const { session } = useAuth()
  const userId = session?.user.id
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('landlord_id', userId)
      .maybeSingle()
    setRoom((data as Room) ?? null)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    reload()
  }, [reload])

  return { room, loading, reload }
}