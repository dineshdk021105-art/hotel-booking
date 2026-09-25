import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, XCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Booking } from '../../types'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'badge-green',
  pending: 'badge-gold',
  cancelled: 'badge-red',
  payment_pending: 'badge-gold',
  checked_in: 'badge-green',
  checked_out: 'badge-gray',
  refund_pending: 'badge-gold',
  refunded: 'badge-gray',
}

export default function MyBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    if (!user) return
    const { data } = await supabase
      .from('bookings')
      .select('*, hotel:hotels(*), booking_items(*, room_type:room_types(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setBookings((data || []) as Booking[])
    setLoading(false)
  }

  useEffect(() => { fetchBookings() }, [user])

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    if (error) {
      toast.error('Could not cancel booking. Please contact support.')
    } else {
      toast.success('Booking cancelled.')
      fetchBookings()
    }
  }

  const canCancel = (b: Booking) => ['confirmed', 'pending', 'payment_pending'].includes(b.status) && new Date(b.check_in) > new Date()

  return (
    <div className="min-h-[calc(100vh-80px)] flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 bg-[#0A0E0B] text-white">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        <div>
          <span className="eyebrow block mb-1">ACCOUNT</span>
          <h1 className="font-serif text-3xl font-bold text-white">My Bookings</h1>
        </div>

        {loading ? (
          <div className="space-y-4 mt-8">
            {[...Array(3)].map((_, i) => <div key={i} className="card-base h-24 skeleton" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full py-10 my-auto">
            <div className="w-full max-w-md bg-[#151C18] border border-[#28362D] rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center justify-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-[#1E2722] border border-[#28362D] flex items-center justify-center text-[#D9A441] mb-5">
                <Calendar size={32} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mb-2">No bookings yet</h2>
              <p className="text-sm text-gray-400 mb-6">Book a room to get started</p>
              <Link
                to="/rooms"
                className="btn-gold px-8 py-3 text-sm font-bold shadow-lg hover:brightness-110 transition-all inline-flex items-center justify-center"
              >
                Browse Rooms
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-8">
            {bookings.map(b => (
              <div key={b.id} className="card-base p-5 bg-[#151C18] border border-[#28362D] rounded-xl">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-white">{b.reference}</p>
                    <p className="text-sm mt-0.5 text-gray-400">
                      Check-in: {new Date(b.check_in).toDateString()} · Check-out: {new Date(b.check_out).toDateString()}
                    </p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[b.status] || 'badge-gray'}`}>
                    {b.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#D9A441]">₹{b.total_amount?.toLocaleString()}</p>
                  {canCancel(b) && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                    >
                      <XCircle size={14} /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
