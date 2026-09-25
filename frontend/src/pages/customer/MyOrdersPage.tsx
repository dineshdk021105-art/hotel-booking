import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { FoodOrder } from '../../types'

export default function MyOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<FoodOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('food_orders').select('*, order_items:food_order_items(*, food_item:food_items(*))').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      setOrders((data || []) as FoodOrder[])
      setLoading(false)
    })
  }, [user])

  const STATUS_COLOR: Record<string, string> = {
    pending: 'badge-gold', confirmed: 'badge-green', preparing: 'badge-gold',
    delivered: 'badge-green', cancelled: 'badge-red',
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 bg-[#0A0E0B] text-white">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        <div>
          <span className="eyebrow block mb-1">ACCOUNT</span>
          <h1 className="font-serif text-3xl font-bold text-white">My Food Orders</h1>
        </div>

        {loading ? (
          <div className="space-y-4 mt-8">{[...Array(3)].map((_, i) => <div key={i} className="card-base h-20 skeleton" />)}</div>
        ) : orders.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full py-10 my-auto">
            <div className="w-full max-w-md bg-[#151C18] border border-[#28362D] rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center justify-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-[#1E2722] border border-[#28362D] flex items-center justify-center text-[#D9A441] mb-5">
                <ShoppingBag size={32} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mb-2">No food orders yet</h2>
              <p className="text-sm text-gray-400 mb-6">Order delicious meals directly to your room</p>
              <Link
                to="/dining"
                className="btn-gold px-8 py-3 text-sm font-bold shadow-lg hover:brightness-110 transition-all inline-flex items-center justify-center"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="card-base p-5 bg-[#151C18] border border-[#28362D] rounded-2xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-serif font-bold text-sm text-white">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString()}</p>
                    <p className="text-xs mt-0.5 text-gray-300">Delivery: {o.delivery_location}</p>
                  </div>
                  <span className={`badge ${STATUS_COLOR[o.status] || 'badge-gray'}`}>{o.status.toUpperCase()}</span>
                </div>
                <p className="font-bold text-[#D9A441]">₹{o.total_amount?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
