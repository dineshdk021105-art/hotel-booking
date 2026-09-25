import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wifi, Users, BedDouble, Maximize2, CheckCircle2, ArrowLeft, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { RoomType } from '../types'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const STATIC_DETAIL: Record<string, RoomType> = {
  'static-1': {
    id: 'static-1', hotel_id: '1', name: 'Standard Room', status: 'active',
    description: 'A comfortable and thoughtfully designed room ideal for solo travellers and couples. Enjoy a peaceful ambience with essential amenities that make your stay convenient and memorable.',
    capacity: 2, bed_type: 'Queen Bed', size_sqft: 280,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini-bar', 'Work Desk', 'Safe Deposit Box', 'Daily Housekeeping'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85',
      'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&q=85',
    ],
    cancellation_policy: 'Free cancellation up to 48 hours before check-in. After that, the first night is non-refundable.',
    rates: [{ id: '1', room_type_id: 'static-1', base_price: 25000, taxes_percent: 7.5, fees: 500, is_active: true }],
  },
  'static-2': {
    id: 'static-2', hotel_id: '1', name: 'Deluxe Room', status: 'active',
    description: 'Spacious and elegantly furnished, our Deluxe Rooms feature premium bedding and a serene garden or city view. Perfect for those who appreciate space and style.',
    capacity: 2, bed_type: 'King Bed', size_sqft: 380,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Bathtub', 'Room Service', 'Mini-bar', 'Balcony', 'Smart TV', 'Coffee Maker'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=85',
    ],
    cancellation_policy: 'Free cancellation up to 72 hours before check-in.',
    rates: [{ id: '2', room_type_id: 'static-2', base_price: 35000, taxes_percent: 7.5, fees: 500, is_active: true }],
  },
  'static-3': {
    id: 'static-3', hotel_id: '1', name: 'Executive Suite', status: 'active',
    description: 'An expansive suite with a separate living area and premium views. Designed for business travellers and those seeking extra space, luxury and personal attention.',
    capacity: 3, bed_type: 'King Bed', size_sqft: 580,
    amenities: ['Free Wi-Fi', 'Jacuzzi', 'Separate Living Room', 'Premium Bar', 'Butler Service', 'City View', 'Smart Home Controls'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=85',
      'https://images.unsplash.com/photo-1630585604459-71a89fa9a1a6?w=800&q=85',
    ],
    cancellation_policy: 'Free cancellation up to 5 days before check-in. Partial refund within 5 days.',
    rates: [{ id: '3', room_type_id: 'static-3', base_price: 55000, taxes_percent: 7.5, fees: 1000, is_active: true }],
  },
  'static-4': {
    id: 'static-4', hotel_id: '1', name: 'Presidential Suite', status: 'active',
    description: 'The pinnacle of luxury at ITC Grand Chola — a lavish presidential suite featuring panoramic city views, a private dining area, personal butler service, and unmatched hospitality.',
    capacity: 4, bed_type: 'Super King Bed', size_sqft: 1200,
    amenities: ['Free Wi-Fi', 'Private Pool Access', 'Jacuzzi', 'Dining Room', 'Full Bar', 'Panoramic View', 'Private Chef Available', 'Limousine Service', 'Dedicated Butler'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=85',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=85',
    ],
    cancellation_policy: 'Non-refundable within 7 days of check-in. Full refund more than 7 days before arrival.',
    rates: [{ id: '4', room_type_id: 'static-4', base_price: 85000, taxes_percent: 7.5, fees: 2000, is_active: true }],
  },
}

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [room, setRoom] = useState<RoomType | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [bookingForm, setBookingForm] = useState({
    checkIn: searchParams.get('check_in') || new Date().toISOString().split('T')[0],
    checkOut: searchParams.get('check_out') || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: Number(searchParams.get('guests')) || 1,
  })
  const [bookError, setBookError] = useState('')

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return
      const { data } = await supabase
        .from('room_types')
        .select('*, rates:room_rates(*)')
        .eq('id', id)
        .single()

      if (data) {
        setRoom(data as RoomType)
      } else if (STATIC_DETAIL[id]) {
        setRoom(STATIC_DETAIL[id])
      }
      setLoading(false)
    }
    fetchRoom()
  }, [id])

  const nights = room ? Math.max(1, Math.floor(
    (new Date(bookingForm.checkOut).getTime() - new Date(bookingForm.checkIn).getTime()) / 86400000
  )) : 0

  const basePrice = room?.rates?.[0]?.base_price || 0
  const taxRate = room?.rates?.[0]?.taxes_percent || 7.5
  const fees = room?.rates?.[0]?.fees || 0
  const subtotal = basePrice * nights
  const taxes = (subtotal * taxRate) / 100
  const total = subtotal + taxes + fees

  const handleBook = () => {
    setBookError('')
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      setBookError('Please select your check-in and check-out dates.')
      return
    }
    if (new Date(bookingForm.checkOut) <= new Date(bookingForm.checkIn)) {
      setBookError('Check-out must be after check-in.')
      return
    }
    if (bookingForm.guests < 1 || (room && bookingForm.guests > room.capacity)) {
      setBookError(`Guest count must be between 1 and ${room?.capacity}.`)
      return
    }
    if (!user) {
      toast('Please login to book a room', { icon: '🔐' })
      navigate('/login', { state: { from: { pathname: `/rooms/${id}` } } })
      return
    }
    // Navigate to checkout with all booking params
    navigate(`/rooms/${id}/checkout?check_in=${bookingForm.checkIn}&check_out=${bookingForm.checkOut}&guests=${bookingForm.guests}`)
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="font-display text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>Room not found</h1>
          <Link to="/rooms" className="btn-gold">Browse Rooms</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-32 sm:pt-36 min-h-screen bg-[#0A0E0B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link to="/rooms" className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Rooms
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="relative overflow-hidden rounded-2xl h-72 sm:h-96">
                <img
                  src={room.images?.[activeImg] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85'}
                  alt={`${room.name} - View ${activeImg + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {room.images && room.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {room.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all"
                      style={{ borderColor: activeImg === i ? 'var(--accent-gold)' : 'transparent' }}
                    >
                      <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <div className="card-base p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{room.name}</h1>
                <div>
                  <span className="price-gold text-2xl">₦{basePrice.toLocaleString()}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/night</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 mb-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {room.capacity && (
                  <span className="flex items-center gap-2"><Users size={15} style={{ color: 'var(--accent-gold)' }} /> Up to {room.capacity} guests</span>
                )}
                {room.bed_type && (
                  <span className="flex items-center gap-2"><BedDouble size={15} style={{ color: 'var(--accent-gold)' }} /> {room.bed_type}</span>
                )}
                {room.size_sqft && (
                  <span className="flex items-center gap-2"><Maximize2 size={15} style={{ color: 'var(--accent-gold)' }} /> {room.size_sqft} sq ft</span>
                )}
                <span className="flex items-center gap-2"><Wifi size={15} style={{ color: 'var(--accent-gold)' }} /> Free Wi-Fi</span>
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{room.description}</p>

              {/* Amenities */}
              <div>
                <h3 className="font-display font-semibold mb-3 text-base" style={{ color: 'var(--text-primary)' }}>Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {room.amenities?.map(a => (
                    <div key={a} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      {a}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy */}
              {room.cancellation_policy && (
                <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(47,166,106,0.07)', border: '1px solid rgba(47,166,106,0.18)' }}>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--success)' }}>Cancellation Policy</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{room.cancellation_policy}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Panel */}
          <div className="lg:col-span-1">
            <div
              className="card-base p-6 sticky top-24"
              style={{ boxShadow: '0 0 30px rgba(217,164,65,0.1)' }}
            >
              <h2 className="font-display text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Reserve This Room</h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold mb-1.5 tracking-wider" style={{ color: 'var(--accent-gold)' }}>
                    <Calendar size={12} /> CHECK-IN
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setBookingForm(p => ({ ...p, checkIn: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold mb-1.5 tracking-wider" style={{ color: 'var(--accent-gold)' }}>
                    <Calendar size={12} /> CHECK-OUT
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkOut}
                    min={bookingForm.checkIn}
                    onChange={e => setBookingForm(p => ({ ...p, checkOut: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold mb-1.5 tracking-wider block" style={{ color: 'var(--accent-gold)' }}>
                    GUESTS (max {room.capacity})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={room.capacity}
                    value={bookingForm.guests}
                    onChange={e => setBookingForm(p => ({ ...p, guests: Number(e.target.value) }))}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-5 space-y-2 py-4" style={{ borderTop: '1px solid rgba(217,164,65,0.1)', borderBottom: '1px solid rgba(217,164,65,0.1)' }}>
                <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>₦{basePrice.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>Taxes ({taxRate}%)</span>
                  <span>₦{Math.round(taxes).toLocaleString()}</span>
                </div>
                {fees > 0 && (
                  <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span>Service fee</span>
                    <span>₦{fees.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2" style={{ color: 'var(--text-primary)' }}>
                  <span>Total</span>
                  <span className="price-gold text-lg">₦{Math.round(total).toLocaleString()}</span>
                </div>
              </div>

              {bookError && (
                <p className="mt-3 text-xs" style={{ color: 'var(--error)' }} role="alert">{bookError}</p>
              )}

              <button onClick={handleBook} className="btn-gold w-full justify-center mt-4 py-3.5">
                Book Now
              </button>

              <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                You won't be charged yet · Secure payment via Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
