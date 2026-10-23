import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useFavourites() {
  const { session } = useAuth()
  const userId = session?.user.id
  const [ids, setIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!userId) return
    supabase
      .from('favourites')
      .select('room_id')
      .eq('user_id', userId)
      .then(({ data }) => setIds(new Set((data ?? []).map((r) => r.room_id as string))))
  }, [userId])

  const toggle = useCallback(
    async (roomId: string) => {
      if (!userId) return
      const isFav = ids.has(roomId)

      // Update the UI immediately, roll back if the database call fails
      setIds((prev) => {
        const next = new Set(prev)
        if (isFav) next.delete(roomId)
        else next.add(roomId)
        return next
      })

      const { error } = isFav
        ? await supabase.from('favourites').delete().eq('user_id', userId).eq('room_id', roomId)
        : await supabase.from('favourites').insert({ user_id: userId, room_id: roomId })

      if (error) {
        setIds((prev) => {
          const next = new Set(prev)
          if (isFav) next.add(roomId)
          else next.delete(roomId)
          return next
        })
      }
    },
    [userId, ids]
  )

  return { ids, toggle }
}