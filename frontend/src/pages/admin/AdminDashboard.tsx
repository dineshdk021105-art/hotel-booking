import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BedDouble, DollarSign, Users, ShoppingBag, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Stats {
  totalBookings: number
  confirmedBookings: number
  totalRevenue: number
  availableRooms: number
  totalUsers: number
  foodOrders: number
  pendingBookings: number
  occupiedRooms: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0, confirmedBookings: 0, totalRevenue: 0,
    availableRooms: 0, totalUsers: 0, foodOrders: 0,
    pendingBookings: 0, occupiedRooms: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: totalBookings },
        { count: confirmedBookings },
        { count: pendingBookings },
        { data: revenueData },
        { count: availableRooms },
        { count: occupiedRooms },
        { count: totalUsers },
        { count: foodOrders },
        { data: recent },
      ] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('bookings').select('total_amount').in('status', ['confirmed', 'checked_in', 'checked_out']),
        supabase.from('rooms').select('*', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('rooms').select('*', { count: 'exact', head: true }).eq('status', 'occupied'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('food_orders').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*, user:profiles(full_name, email)').order('created_at', { ascending: false }).limit(5),
      ])

      const totalRevenue = (revenueData || []).reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0)

      setStats({
        totalBookings: totalBookings || 0,
        confirmedBookings: confirmedBookings || 0,
        pendingBookings: pendingBookings || 0,
        totalRevenue,
        availableRooms: availableRooms || 0,
        occupiedRooms: occupiedRooms || 0,
        totalUsers: totalUsers || 0,
        foodOrders: foodOrders || 0,
      })
      setRecentBookings(recent || [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  const STAT_CARDS = [
    { icon: Calendar, label: 'Total Bookings', value: stats.totalBookings, color: 'var(--accent-gold)' },
    { icon: CheckCircle2, label: 'Confirmed', value: stats.confirmedBookings, color: 'var(--success)' },
    { icon: AlertCircle, label: 'Pending', value: stats.pendingBookings, color: '#E88C2A' },
    { icon: DollarSign, label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'var(--accent-gold)' },
    { icon: BedDouble, label: 'Available Rooms', value: stats.availableRooms, color: 'var(--success)' },
    { icon: BedDouble, label: 'Occupied Rooms', value: stats.occupiedRooms, color: '#E88C2A' },
    { icon: Users, label: 'Total Guests', value: stats.totalUsers, color: 'var(--accent-gold)' },
    { icon: ShoppingBag, label: 'Food Orders', value: stats.foodOrders, color: 'var(--success)' },
  ]

  const STATUS_COLOR: Record<string, string> = {
    confirmed: 'badge-green', pending: 'badge-gold', cancelled: 'badge-red',
    payment_pending: 'badge-gold', checked_in: 'badge-green', checked_out: 'badge-gray',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Welcome to the ITC Grand Chola Admin Panel</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="card-base p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,164,65,0.08)' }}>
                <card.icon size={16} style={{ color: card.color }} />
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
            </div>
            <p className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {loading ? <span className="skeleton w-16 h-6 block rounded" /> : card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Recent Bookings</h2>
          <TrendingUp size={18} style={{ color: 'var(--accent-gold)' }} />
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 rounded-lg" />)}</div>
        ) : recentBookings.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Guest</th>
                  <th>Check-in</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id}>
                    <td className="font-semibold text-sm" style={{ color: 'var(--accent-gold)' }}>{b.reference}</td>
                    <td className="text-sm">{(b.user as any)?.full_name || '—'}</td>
                    <td className="text-sm">{new Date(b.check_in).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${STATUS_COLOR[b.status] || 'badge-gray'} text-xs`}>
                        {b.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="font-semibold" style={{ color: 'var(--accent-gold)' }}>₹{b.total_amount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
