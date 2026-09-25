import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminRooms() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('rooms')
      .select('*, room_type:room_types(name)')
      .order('room_number')
      .then(({ data }) => {
        setRooms(data || [])
        setLoading(false)
      })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('rooms').update({ status }).eq('id', id)
    toast.success('Room status updated')
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Room Inventory</h1>
        <button className="btn-gold">
          <Plus size={15} /> Add Room
        </button>
      </div>
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Room #</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Loading...</td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                    No rooms configured yet. Add room types first.
                  </td>
                </tr>
              ) : rooms.map(r => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.room_number}</td>
                  <td className="text-sm">{r.room_type?.name || '—'}</td>
                  <td className="text-sm">{r.floor || '—'}</td>
                  <td>
                    <span className="badge badge-gray text-xs">{r.status}</span>
                  </td>
                  <td>
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                      className="input-field py-1 px-2 text-xs w-32"
                    >
                      {['available', 'occupied', 'maintenance', 'blocked'].map(s => (
                        <option key={s} value={s}>{s}</option>
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
