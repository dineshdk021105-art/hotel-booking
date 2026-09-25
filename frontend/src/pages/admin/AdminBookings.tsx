import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const STATUS_COLOR: Record<string, string> = {
  confirmed: 'badge-green', pending: 'badge-gold', cancelled: 'badge-red',
  payment_pending: 'badge-gold', checked_in: 'badge-green', checked_out: 'badge-gray',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    setLoading(true)
    let q = supabase.from('bookings').select('*, user:profiles(full_name, email)').order('created_at', { ascending: false })
    if (status) q = (q as any).eq('status', status)
    if (search) q = (q as any).ilike('reference', `%${search}%`)
    const { data } = await q
    setBookings(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchBookings() }, [status, search])

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('bookings').update({ status: newStatus }).eq('id', id)
    toast.success('Booking updated')
    fetchBookings()
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Bookings Management
      </h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by reference..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field max-w-xs"
        />
        <select value={status} onChange={e => setStatus(e.target.value)} className="input-field w-44">
          <option value="">All Status</option>
          {['pending', 'payment_pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(s => (
            <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Guest</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Loading...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8" style={{ color: 'var(--text-muted)' }}>No bookings found</td>
                </tr>
              ) : bookings.map(b => (
                <tr key={b.id}>
                  <td className="font-semibold text-sm" style={{ color: 'var(--accent-gold)' }}>{b.reference}</td>
                  <td className="text-sm">{b.user?.full_name || '—'}</td>
                  <td className="text-sm">{new Date(b.check_in).toLocaleDateString()}</td>
                  <td className="text-sm">{new Date(b.check_out).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${STATUS_COLOR[b.status] || 'badge-gray'} text-xs`}>
                      {b.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="font-semibold" style={{ color: 'var(--accent-gold)' }}>
                    {b.total_amount ? `₹${b.total_amount.toLocaleString()}` : '—'}
                  </td>
                  <td>
                    <select
                      value={b.status}
                      onChange={e => updateStatus(b.id, e.target.value)}
                      className="input-field py-1 px-2 text-xs w-36"
                    >
                      {['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
