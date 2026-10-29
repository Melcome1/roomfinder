import { useEffect, useState } from 'react'
import { ArrowLeft, BedDouble, Bath, CalendarDays, Heart, MapPin, Phone, MessageCircle, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useFavourites } from '../../hooks/useFavourites'
import { toTelNumber, toWhatsAppNumber } from '../../lib/phone'
import type { RoomWithLandlord } from '../../types/room'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RoomDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { ids, toggle } = useFavourites()
  const [room, setRoom] = useState<RoomWithLandlord | null>(null)
  const [loading, setLoading] = useState(true)
  const { session } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!id) return
    supabase
      .from('rooms')
      .select('*, landlord:profiles!landlord_id(full_name, phone)')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setRoom((data as unknown as RoomWithLandlord) ?? null)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p className="text-muted">Loading…</p>
  if (!room) {
    return (
      <div className="text-center mt-16">
        <p className="text-muted mb-4">This room is no longer available.</p>
        <button onClick={() => navigate('/')} className="rounded-xl bg-primary px-6 py-3 font-semibold">
          Back to search
        </button>
      </div>
    )
  }

  const phone = room.landlord?.phone
  const isFav = ids.has(room.id)
  const waText = encodeURIComponent(`Hi, I'm interested in "${room.title}" on RoomFinder. Is it still available?`)

  return (
    <div className="-mx-4 -mt-6">
      <div className="relative aspect-[4/3] bg-surface-2">
        {room.photo_url && <img src={room.photo_url} alt={room.title} className="w-full h-full object-cover" />}
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="absolute left-4 top-4 grid place-items-center size-10 rounded-full bg-black/50 backdrop-blur"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => toggle(room.id)}
          aria-label={isFav ? 'Remove from saved' : 'Save room'}
          className="absolute right-4 top-4 grid place-items-center size-10 rounded-full bg-black/50 backdrop-blur"
        >
          <Heart size={20} className={isFav ? 'fill-red-500 text-red-500' : ''} />
        </button>
      </div>

      <div className="px-4 py-5 space-y-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold">{room.title}</h1>
            {room.rooms_available === 0 && (
              <span className="shrink-0 text-xs rounded-full bg-surface-2 px-3 py-1 mt-1">Full</span>
            )}
          </div>
          <p className="text-xl text-primary-soft font-semibold mt-1">R{room.price.toLocaleString()} / month</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-muted">
          <span className="flex items-center gap-2"><BedDouble size={16} /> {room.bedrooms} bedroom{room.bedrooms === 1 ? '' : 's'}</span>
          <span className="flex items-center gap-2"><Bath size={16} /> {room.bathrooms} bathroom{room.bathrooms === 1 ? '' : 's'}</span>
          <span className="flex items-center gap-2"><Users size={16} /> {room.max_people} per room</span>
          <span className="flex items-center gap-2 capitalize"><BedDouble size={16} /> {room.room_type}</span>
          <span className="flex items-center gap-2 col-span-2"><MapPin size={16} /> {room.location}</span>
          {room.available_from && (
            <span className="flex items-center gap-2 col-span-2">
              <CalendarDays size={16} /> Available from {new Date(room.available_from).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
          <span className="col-span-2 text-white">
            {room.rooms_available} room{room.rooms_available === 1 ? '' : 's'} available
          </span>
        </div>

        {room.description && (
          <div>
            <h2 className="font-semibold mb-1">About this room</h2>
            <p className="text-sm text-muted whitespace-pre-line">{room.description}</p>
          </div>
        )}

        <div className="rounded-2xl bg-surface border border-border p-4">
  {!session ? (
    <>
      <p className="font-semibold">Sign in to contact the landlord</p>
      <p className="text-sm text-muted mt-1">
        Create a free account or log in to see how to reach them.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-4">
              <button disabled className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold opacity-40 cursor-not-allowed">
                <Phone size={18} /> Call
              </button>
              <button disabled className="flex items-center justify-center gap-2 rounded-xl bg-success py-3 font-semibold text-black opacity-40 cursor-not-allowed">
                <MessageCircle size={18} /> WhatsApp
              </button>
            </div>

            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="mt-3 block text-center rounded-xl border border-primary py-3 font-semibold"
            >
              Sign in
            </Link>
            <p className="text-sm text-muted text-center mt-3">
              New here?{' '}
              <Link to="/register" state={{ from: location.pathname }} className="text-primary-soft">
                Create an account
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-muted">Landlord</p>
            <p className="font-semibold">{room.landlord?.full_name || 'Landlord'}</p>

            {phone ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <a href={`tel:${toTelNumber(phone)}`} className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold">
                  <Phone size={18} /> Call
                </a>
                <a
                  href={`https://wa.me/${toWhatsAppNumber(phone)}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-success py-3 font-semibold text-black"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted mt-3">This landlord hasn't added a phone number.</p>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  )
}