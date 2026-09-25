import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, SlidersHorizontal } from 'lucide-react'
import RoomCard from '../components/rooms/RoomCard'
import BookingSearchPanel from '../components/booking/BookingSearchPanel'
import { supabase } from '../lib/supabase'
import type { RoomType } from '../types'

const STATIC_ROOMS: RoomType[] = [
  {
    id: 'static-1',
    hotel_id: '1',
    name: 'Standard Room',
    description: 'A comfortable room ideal for solo travellers or couples, equipped with all essential amenities for a pleasant stay.',
    capacity: 2,
    bed_type: 'Queen Bed',
    size_sqft: 280,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini-bar'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'],
    status: 'active',
    rates: [{ id: '1', room_type_id: 'static-1', base_price: 25000, taxes_percent: 7.5, fees: 500, is_active: true }],
  },
  {
    id: 'static-2',
    hotel_id: '1',
    name: 'Deluxe Room',
    description: 'Spacious and elegantly furnished, our Deluxe Rooms feature premium furnishings and a city or garden view.',
    capacity: 2,
    bed_type: 'King Bed',
    size_sqft: 380,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Bathtub', 'Room Service', 'Mini-bar'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80'],
    status: 'active',
    rates: [{ id: '2', room_type_id: 'static-2', base_price: 35000, taxes_percent: 7.5, fees: 500, is_active: true }],
  },
  {
    id: 'static-3',
    hotel_id: '1',
    name: 'Executive Suite',
    description: 'An expansive suite with a separate living area, designed for business travellers and those seeking extra space and luxury.',
    capacity: 3,
    bed_type: 'King Bed',
    size_sqft: 580,
    amenities: ['Free Wi-Fi', 'Jacuzzi', 'Living Room', 'Premium Bar', 'Butler Service', 'City View'],
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80'],
    status: 'active',
    rates: [{ id: '3', room_type_id: 'static-3', base_price: 55000, taxes_percent: 7.5, fees: 1000, is_active: true }],
  },
  {
    id: 'static-4',
    hotel_id: '1',
    name: 'Presidential Suite',
    description: 'The pinnacle of luxury — a lavish presidential suite featuring panoramic views, a private dining area, and world-class amenities.',
    capacity: 4,
    bed_type: 'Super King Bed',
    size_sqft: 1200,
    amenities: ['Free Wi-Fi', 'Private Pool Access', 'Jacuzzi', 'Dining Room', 'Full Bar', 'Panoramic View', 'Private Chef Available'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80'],
    status: 'active',
    rates: [{ id: '4', room_type_id: 'static-4', base_price: 85000, taxes_percent: 7.5, fees: 2000, is_active: true }],
  },
]

export default function RoomsPage() {
  const [searchParams] = useSearchParams()
  const checkIn = searchParams.get('check_in')
  const checkOut = searchParams.get('check_out')
  const guestsParam = Number(searchParams.get('guests')) || 1

  const [rooms, setRooms] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'capacity'>('price_asc')
  const [maxPrice] = useState<number>(500000)
  const [minCapacity, setMinCapacity] = useState<number>(guestsParam)

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('room_types')
        .select('*, rates:room_rates(*), rooms(*)')
        .eq('status', 'active')

      if (error || !data || data.length === 0) {
        setRooms(STATIC_ROOMS)
      } else {
        setRooms(data as RoomType[])
      }
      setLoading(false)
    }
    fetchRooms()
  }, [])

  const filtered = rooms
    .filter(r => {
      const price = r.rates?.[0]?.base_price || 0
      return price <= maxPrice && r.capacity >= minCapacity
    })
    .sort((a, b) => {
      const pa = a.rates?.[0]?.base_price || 0
      const pb = b.rates?.[0]?.base_price || 0
      if (sortBy === 'price_asc') return pa - pb
      if (sortBy === 'price_desc') return pb - pa
      if (sortBy === 'capacity') return b.capacity - a.capacity
      return 0
    })

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 min-h-screen bg-[#0A0E0B] text-white">
      {/* Hero Header */}
      <div
        className="relative py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden bg-[#101512] border-b border-[#202B24]"
      >
        <div className="absolute inset-0 bg-radial-gradient from-[#D9A441]/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-[#D9A441] text-xs uppercase tracking-widest font-bold mb-2">RELAX IN STYLE</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">Rooms & Suites</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Each room is thoughtfully designed for comfort, with premium furnishings, modern amenities, and attentive service.
          </p>
        </div>
      </div>

      {/* Search Panel Container */}
      <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-[1220px] mx-auto">
        <BookingSearchPanel />
      </div>

      {/* Results */}
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter size={16} style={{ color: 'var(--accent-gold)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {filtered.length} room{filtered.length !== 1 ? 's' : ''} available
              {checkIn && checkOut && ` · ${checkIn} → ${checkOut}`}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
              <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Min Guests:</label>
              <select
                value={minCapacity}
                onChange={e => setMinCapacity(Number(e.target.value))}
                className="input-field py-1.5 px-2 text-xs w-20"
              >
                {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Sort:</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="input-field py-1.5 px-2 text-xs w-36"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="card-base h-80 skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No rooms match your filters</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your search criteria</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
