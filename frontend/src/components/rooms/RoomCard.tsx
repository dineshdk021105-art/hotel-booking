import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wifi, Users, BedDouble } from 'lucide-react'
import type { RoomType } from '../../types'

interface RoomCardProps {
  room: RoomType
  pricePerNight?: number
  index?: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35 },
  }),
}

const ROOM_IMAGES: Record<string, string> = {
  'Standard Room': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'Deluxe Room': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
  'Executive Suite': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
  'Presidential Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80'

export default function RoomCard({ room, pricePerNight, index = 0 }: RoomCardProps) {
  const image = room.images?.[0] || ROOM_IMAGES[room.name] || FALLBACK_IMAGE
  const price = pricePerNight || room.rates?.[0]?.base_price || 12000

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="card-base group overflow-hidden flex flex-col justify-between bg-[#151C18] border border-[#28362D] rounded-xl shadow-md h-full"
    >
      <div>
        {/* Image Container */}
        <div className="relative overflow-hidden h-44 sm:h-48">
          <img
            src={image}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h3 className="font-serif text-lg font-bold text-white mb-1 leading-snug">
            {room.name}
          </h3>

          <p className="text-sm font-bold text-[#D9A441] mb-3">
            ₹{price.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ night</span>
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium mb-3">
            <span className="flex items-center gap-1">
              <Users size={13} className="text-[#D9A441]" />
              {room.capacity || 2} Guests
            </span>
            <span className="flex items-center gap-1">
              <BedDouble size={13} className="text-[#D9A441]" />
              {room.bed_type || '1 Bed'}
            </span>
            <span className="flex items-center gap-1">
              <Wifi size={13} className="text-[#D9A441]" />
              Free Wi-Fi
            </span>
          </div>

          {room.description && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {room.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer / Button */}
      <div className="p-5 pt-0 mt-auto">
        <Link
          to={`/rooms/${room.id}?book=1`}
          className="btn-gold w-full text-center justify-center text-xs py-2.5 font-bold"
        >
          Book Now
        </Link>
      </div>
    </motion.article>
  )
}
