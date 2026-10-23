import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRooms, type Filters } from '../../hooks/useRooms'
import { useFavourites } from '../../hooks/useFavourites'
import RoomCard from '../../components/RoomCard'

const types: { value: Filters['type']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'single', label: 'Single Room' },
  { value: 'bachelor', label: 'Bachelor' },
  { value: 'shared', label: 'Shared' },
]

export default function TenantHome() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<Filters['type']>('all')
  const [maxPrice, setMaxPrice] = useState('')

  const { rooms, loading, error } = useRooms({ query, type, maxPrice })
  const { ids, toggle } = useFavourites()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Find a Room</h1>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by location, area or suburb"
          className="w-full rounded-xl bg-surface border border-border pl-11 pr-4 py-3 outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-4 px-4">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm border ${
              type === t.value ? 'bg-primary border-primary' : 'bg-surface border-border text-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-muted">Max price R</span>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Any"
          className="w-32 rounded-lg bg-surface border border-border px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <p className="mt-6 mb-3 text-sm text-muted">
        {loading ? 'Searching…' : `${rooms.length} room${rooms.length === 1 ? '' : 's'} found`}
      </p>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="space-y-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} isFav={ids.has(room.id)} onToggleFav={toggle} />
        ))}
      </div>

      {!loading && !error && rooms.length === 0 && (
        <p className="text-center text-muted mt-12">No rooms match your search.</p>
      )}
    </div>
  )
}