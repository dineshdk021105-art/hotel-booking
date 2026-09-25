import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Users, ChevronDown, Search } from 'lucide-react'

const ROOM_TYPES = [
  { value: '', label: 'All Room Types' },
  { value: 'standard', label: 'Standard Room' },
  { value: 'deluxe', label: 'Deluxe Room' },
  { value: 'executive', label: 'Executive Suite' },
  { value: 'presidential', label: 'Presidential Suite' },
]

export default function BookingSearchPanel() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [guests, setGuests] = useState(1)
  const [roomType, setRoomType] = useState('')
  const [error, setError] = useState('')

  const handleSearch = () => {
    setError('')
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.')
      return
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out date must be after check-in date.')
      return
    }
    if (guests < 1) {
      setError('Please select at least 1 guest.')
      return
    }
    navigate(`/rooms?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}&room_type=${roomType}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35 }}
      className="w-full max-w-[1220px] mx-auto"
    >
      <div
        className="rounded-2xl p-6 md:p-8 bg-[#121714] border border-[#28362D] shadow-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Check-in */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#D9A441] uppercase">
              <Calendar size={13} />
              CHECK-IN
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={e => setCheckIn(e.target.value)}
              className="input-field bg-[#0F1411] border-[#28362D] text-white"
              aria-label="Check-in date"
            />
          </div>

          {/* Check-out */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#D9A441] uppercase">
              <Calendar size={13} />
              CHECK-OUT
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={e => setCheckOut(e.target.value)}
              className="input-field bg-[#0F1411] border-[#28362D] text-white"
              aria-label="Check-out date"
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#D9A441] uppercase">
              <Users size={13} />
              GUESTS
            </label>
            <div className="relative">
              <select
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                className="input-field bg-[#0F1411] border-[#28362D] text-white appearance-none pr-8"
                aria-label="Number of guests"
              >
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n} className="bg-[#121714] text-white">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Room Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-wider text-[#D9A441] uppercase">
              ROOM TYPE
            </label>
            <div className="relative">
              <select
                value={roomType}
                onChange={e => setRoomType(e.target.value)}
                className="input-field bg-[#0F1411] border-[#28362D] text-white appearance-none pr-8"
                aria-label="Room type"
              >
                {ROOM_TYPES.map(rt => (
                  <option key={rt.value} value={rt.value} className="bg-[#121714] text-white">{rt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={handleSearch} className="btn-gold gap-2 px-8 py-3 text-sm font-bold">
            <Search size={16} />
            Check Availability
          </button>
        </div>
      </div>
    </motion.div>
  )
}
