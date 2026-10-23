export type RoomType = 'single' | 'bachelor' | 'shared'

export type Room = {
  id: string
  landlord_id: string
  title: string
  description: string
  price: number
  room_type: RoomType
  max_people: number
  bedrooms: number
  bathrooms: number
  location: string
  available_from: string | null
  rooms_available: number
  photo_url: string | null
  is_active: boolean
  created_at: string
}

export type RoomWithLandlord = Room & {
  landlord: { full_name: string; phone: string | null } | null
}