import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '' })
  const [loading, setLoading] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    const { error } = await supabase.from('profiles').update({ full_name: form.full_name, phone: form.phone }).eq('id', user.id)
    setLoading(false)
    if (error) toast.error('Could not update profile.')
    else toast.success('Profile updated!')
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 lg:pt-44 pb-20 bg-[#0A0E0B] text-white">
      <div className="max-w-xl mx-auto">
        <div className="mb-8 text-center sm:text-left">
          <span className="eyebrow block mb-1">ACCOUNT</span>
          <h1 className="font-serif text-3xl font-bold text-white">My Profile</h1>
        </div>

        <div className="card-base p-8 bg-[#151C18] border border-[#28362D] rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold bg-[#D9A441] text-[#070A08]">
              {user?.full_name?.charAt(0) || 'G'}
            </div>
            <div>
              <p className="font-serif font-bold text-lg text-white">{user?.full_name}</p>
              <p className="text-xs uppercase font-semibold text-[#D9A441]">{user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#D9A441]">FULL NAME</label>
              <input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="input-field bg-[#0F1411] border-[#28362D] text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#D9A441]">EMAIL ADDRESS</label>
              <input type="email" value={user?.email || ''} disabled className="input-field bg-[#0F1411] border-[#28362D] text-gray-500 opacity-60 cursor-not-allowed" />
              <p className="text-xs mt-1 text-gray-400">Email cannot be changed here</p>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#D9A441]">INDIAN MOBILE NUMBER</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field bg-[#0F1411] border-[#28362D] text-white" placeholder="+91 98765 43210" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold disabled:opacity-60 font-bold px-6 py-3 text-sm flex items-center gap-2">
              <Save size={15} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
