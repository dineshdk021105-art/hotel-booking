import { motion } from 'framer-motion'
import { Award, Users, Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const STATS = [
  { icon: Users, value: '10,000+', label: 'Happy Guests' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
  { icon: Award, value: '12+', label: 'Years of Service' },
  { icon: Clock, value: '24/7', label: 'Front Desk Support' },
]

export default function AboutPage() {
  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 min-h-screen bg-[#0A0E0B] text-white">
      {/* Hero Header */}
      <div className="relative py-14 sm:py-18 px-4 text-center overflow-hidden bg-[#101512] border-b border-[#202B24]">
        <div className="absolute inset-0 bg-radial-gradient from-[#D9A441]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-[#D9A441] text-xs uppercase tracking-widest font-bold mb-2">OUR STORY</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">About ITC Grand Chola</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            ITC Grand Chola provides comfortable accommodation, attentive service, and good food in Guindy, Chennai. We focus on making every guest feel at home.
          </p>
        </div>
      </div>

      {/* Image + Story Section */}
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <div className="relative rounded-2xl overflow-hidden h-80 lg:h-96 shadow-2xl border border-[#28362D] group bg-[#151C18]">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                alt="ITC Grand Chola luxury hotel lobby"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'
                }}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <p className="text-[#D9A441] text-xs uppercase tracking-widest font-bold mb-2">WHO WE ARE</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
              A Comfortable Stay for Every Visitor
            </h2>
            <div className="w-12 h-0.5 bg-[#D9A441] mb-5 rounded-full" />
            <p className="text-sm sm:text-base leading-relaxed mb-4 text-gray-300">
              ITC Grand Chola was established with a simple goal: offering well-maintained rooms, helpful staff, and dependable service. Whether you are traveling for business or with family, we work to make your trip smooth and stress-free.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300 mb-6">
              Our team is available 24/7 at the concierge desk to assist with room bookings, dining arrangements, and local guidance around Chennai.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/rooms" className="btn-gold px-6 py-2.5 text-xs font-bold">
                Explore Rooms
              </Link>
              <Link to="/contact" className="btn-outline px-6 py-2.5 text-xs font-semibold">
                Contact Concierge
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#151C18] border border-[#28362D] rounded-2xl p-6 text-center shadow-lg hover:border-[#D9A441]/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-[#1E2722] border border-[#28362D] text-[#D9A441] group-hover:scale-110 transition-transform">
                <stat.icon size={22} />
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold mb-1 text-white">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
