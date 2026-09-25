// Customer Dashboard
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ShoppingBag, User, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Booking, FoodOrder } from '../../types'

export default function DashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [orders, setOrders] = useState<FoodOrder[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3).then(({ data }) => setBookings(data || []))
    supabase.from('food_orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3).then(({ data }) => setOrders(data || []))
  }, [user])

  const STATUS_COLOR: Record<string, string> = {
    confirmed: 'text-emerald-400', pending: 'text-[#D9A441]', cancelled: 'text-red-400',
    checked_in: 'text-emerald-400', checked_out: 'text-gray-400',
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 lg:pt-44 pb-20 bg-[#0A0E0B] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center sm:text-left">
          <span className="eyebrow block mb-1">WELCOME BACK</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            {user?.full_name || 'Guest'}
          </h1>
          <p className="text-sm mt-1 text-gray-400">{user?.email}</p>
        </div>

        {/* Quick Option Cards (Centered & Spaced below Navbar) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {[
            { icon: Calendar, label: 'My Bookings', to: '/my-bookings', count: bookings.length },
            { icon: ShoppingBag, label: 'Food Orders', to: '/my-orders', count: orders.length },
            { icon: User, label: 'Profile', to: '/profile', count: null },
          ].map(card => (
            <Link
              key={card.label}
              to={card.to}
              className="card-base p-6 flex items-center gap-4 bg-[#151C18] border border-[#28362D] rounded-2xl group transition-all hover:border-[#D9A441]/40"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#1E2722] text-[#D9A441] border border-[#28362D] shrink-0">
                <card.icon size={22} />
              </div>
              <div className="flex-1">
                <p className="font-serif font-bold text-base text-white">{card.label}</p>
                {card.count !== null && (
                  <p className="text-xs text-gray-400 mt-0.5">{card.count} record{card.count !== 1 ? 's' : ''}</p>
                )}
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-[#D9A441] transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="card-base p-6 sm:p-8 bg-[#151C18] border border-[#28362D] rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Recent Bookings</h2>
            <Link to="/my-bookings" className="text-xs sm:text-sm font-semibold text-[#D9A441] hover:underline">View all</Link>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400 mb-4">No bookings yet</p>
              <Link to="/rooms" className="btn-gold px-6 py-2.5 text-xs font-bold">Book a Room</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0F1411] border border-[#243028]">
                  <div>
                    <p className="font-serif font-bold text-sm text-[#D9A441]">{b.reference}</p>
                    <p className="text-xs text-gray-400 mt-1">{b.check_in} → {b.check_out}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">₹{b.total_amount?.toLocaleString()}</p>
                    <p className={`text-xs capitalize font-medium ${STATUS_COLOR[b.status] || 'text-gray-400'}`}>{b.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card-base p-6 sm:p-8 bg-[#151C18] border border-[#28362D] rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Recent Food Orders</h2>
            <Link to="/my-orders" className="text-xs sm:text-sm font-semibold text-[#D9A441] hover:underline">View all</Link>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400 mb-4">No food orders yet</p>
              <Link to="/dining" className="btn-gold px-6 py-2.5 text-xs font-bold">Browse Menu</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0F1411] border border-[#243028]">
                  <div>
                    <p className="font-serif font-bold text-sm text-white">Order #{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#D9A441]">₹{o.total_amount?.toLocaleString()}</p>
                    <p className="text-xs capitalize text-gray-400">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
