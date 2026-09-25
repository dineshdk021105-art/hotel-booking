// Booking Confirmation Page
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, Users, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Booking } from '../types'

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase
      .from('bookings')
      .select('*, hotel:hotels(*), booking_items(*, room_type:room_types(*))')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setBooking(data as Booking)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <div className="card-base p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(47,166,106,0.15)' }}>
            <CheckCircle2 size={36} style={{ color: 'var(--success)' }} />
          </div>

          <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Booking Confirmed!
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Your reservation has been confirmed. A confirmation email has been sent to you.
          </p>

          {booking ? (
            <div className="rounded-xl p-4 mb-6 text-left space-y-3" style={{ background: 'rgba(217,164,65,0.06)', border: '1px solid rgba(217,164,65,0.15)' }}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold tracking-wider" style={{ color: 'var(--accent-gold)' }}>BOOKING REFERENCE</span>
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{booking.reference}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Calendar size={14} style={{ color: 'var(--accent-gold)' }} />
                {booking.check_in} → {booking.check_out}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Users size={14} style={{ color: 'var(--accent-gold)' }} />
                {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
              </div>
              <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid rgba(217,164,65,0.1)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Total Paid</span>
                <span className="price-gold font-bold text-lg">₦{booking.total_amount?.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(217,164,65,0.06)', border: '1px solid rgba(217,164,65,0.15)' }}>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Booking ID: {id}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link to="/my-bookings" className="btn-gold w-full justify-center">
              View My Bookings <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn-ghost w-full justify-center">
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
