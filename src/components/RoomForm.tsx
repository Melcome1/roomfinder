import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { compressImage } from '../lib/image'
import Field from './Field'
import type { Room, RoomType } from '../types/room'

export default function RoomForm({ initial }: { initial?: Room }) {
  const { session } = useAuth()
  const navigate = useNavigate()
  const userId = session!.user.id

  const [title, setTitle] = useState(initial?.title ?? '')
  const [price, setPrice] = useState(String(initial?.price ?? ''))
  const [roomType, setRoomType] = useState<RoomType>(initial?.room_type ?? 'single')
  const [maxPeople, setMaxPeople] = useState(String(initial?.max_people ?? 1))
  const [roomsAvailable, setRoomsAvailable] = useState(String(initial?.rooms_available ?? 1))
  const [bedrooms, setBedrooms] = useState(String(initial?.bedrooms ?? 1))
  const [bathrooms, setBathrooms] = useState(String(initial?.bathrooms ?? 1))
  const [location, setLocation] = useState(initial?.location ?? '')
  const [availableFrom, setAvailableFrom] = useState(initial?.available_from ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initial?.photo_url ?? null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const pickFile = (f: File | undefined) => {
    if (!f) return
    if (!f.type.startsWith('image/')) return setError('Please choose an image file.')
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!initial && !file) return setError('Please add a photo of the room.')
    setBusy(true)

    try {
      let photoUrl = initial?.photo_url ?? null

      if (file) {
        const blob = await compressImage(file)
        const path = `${userId}/room.jpg`
        const { error: upErr } = await supabase.storage
          .from('room-photos')
          .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
        if (upErr) throw upErr
        const { data } = supabase.storage.from('room-photos').getPublicUrl(path)
        photoUrl = `${data.publicUrl}?v=${Date.now()}` // bust the cache after replacing
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        room_type: roomType,
        max_people: Number(maxPeople),
        rooms_available: Number(roomsAvailable),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        location: location.trim(),
        available_from: availableFrom || null,
        photo_url: photoUrl,
      }

      const { error: dbErr } = initial
        ? await supabase.from('rooms').update(payload).eq('id', initial.id)
        : await supabase.from('rooms').insert({ ...payload, landlord_id: userId })

      if (dbErr) {
        if (dbErr.code === '23505') throw new Error('You already have a listing. Edit it instead.')
        throw dbErr
      }

      navigate('/listings', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Photo */}
      <label className="block cursor-pointer">
        <span className="text-sm text-muted">Photo</span>
        <div className="mt-1 aspect-video rounded-xl bg-surface border border-dashed border-border overflow-hidden grid place-items-center">
          {preview ? (
            <img src={preview} alt="Room preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              <ImagePlus size={32} />
              <span className="text-sm">Tap to add a photo</span>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </label>
      {preview && <p className="text-xs text-muted -mt-2">Tap the photo to replace it.</p>}

      <Field label="Room title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Spacious room in Makhado" />
      <Field label="Price per month (R)" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} required />

      <label className="block">
        <span className="text-sm text-muted">Room type</span>
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value as RoomType)}
          className="mt-1 w-full rounded-xl bg-surface border border-border px-4 py-3 outline-none focus:border-primary"
        >
          <option value="single">Single room</option>
          <option value="bachelor">Bachelor</option>
          <option value="shared">Shared</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Rooms available" type="number" min={0} value={roomsAvailable} onChange={(e) => setRoomsAvailable(e.target.value)} required />
        <Field label="People per room" type="number" min={1} value={maxPeople} onChange={(e) => setMaxPeople(e.target.value)} required />
        <Field label="Bedrooms" type="number" min={0} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required />
        <Field label="Bathrooms" type="number" min={0} value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required />
      </div>

      <Field label="Location (area, town)" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Makhado, Limpopo" />
      <Field label="Available from" type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />

      <label className="block">
        <span className="text-sm text-muted">Description</span>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Safe area, close to shops and transport, water and electricity included…"
          className="mt-1 w-full rounded-xl bg-surface border border-border px-4 py-3 outline-none focus:border-primary"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button disabled={busy} className="w-full rounded-xl bg-primary py-3 font-semibold disabled:opacity-60">
        {busy ? 'Saving…' : initial ? 'Save Changes' : 'Post Room'}
      </button>
    </form>
  )
}