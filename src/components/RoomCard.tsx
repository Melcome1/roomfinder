import { Link } from 'react-router-dom'
import { Heart, MapPin, BedDouble, Bath } from 'lucide-react'
import type { Room } from '../types/room'

type Props = {
  room: Room
  isFav: boolean
  onToggleFav: (id: string) => void
}

export default function RoomCard({ room, isFav, onToggleFav }: Props) {
  const full = room.rooms_available === 0

  return (
    <div className="relative rounded-2xl bg-surface border border-border overflow-hidden">
      <Link to={`/room/${room.id}`} className="block">
        <div className="relative aspect-video bg-surface-2">
          {room.photo_url && (
            <img
              src={room.photo_url}
              alt={room.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          )}
          {full && (
            <span className="absolute left-3 top-3 text-xs font-semibold rounded-full bg-black/70 px-3 py-1">
              Full
            </span>
          )}
        </div>
        <div className="p-4 space-y-1.5">
          <h3 className="font-semibold">{room.title}</h3>
          <p className="text-primary-soft font-semibold">R{room.price.toLocaleString()} / month</p>
          <p className="text-sm text-muted flex items-center gap-1">
            <MapPin size={14} /> {room.location}
          </p>
          <p className="text-sm text-muted flex items-center gap-3">
            <span className="flex items-center gap-1"><BedDouble size={14} /> {room.bedrooms} bed{room.bedrooms === 1 ? '' : 's'}</span>
            <span className="flex items-center gap-1"><Bath size={14} /> {room.bathrooms} bath</span>
            <span className="capitalize">{room.room_type}</span>
          </p>
        </div>
      </Link>

      <button
        onClick={() => onToggleFav(room.id)}
        aria-label={isFav ? 'Remove from saved' : 'Save room'}
        className="absolute right-3 top-3 grid place-items-center size-9 rounded-full bg-black/50 backdrop-blur"
      >
        <Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : 'text-white'} />
      </button>
    </div>
  )
}