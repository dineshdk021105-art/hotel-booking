import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('notifications').insert({
      type: 'support_request',
      title: form.subject || 'Contact Form',
      message: `From: ${form.name} (${form.email})\n\n${form.message}`,
      status: 'unread',
    }).select()
    setLoading(false)
    if (error) {
      console.error(error)
    }
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 min-h-screen bg-[#0A0E0B] text-white">
      {/* Header Banner */}
      <div className="relative py-14 sm:py-18 px-4 text-center overflow-hidden bg-[#101512] border-b border-[#202B24]">
        <div className="absolute inset-0 bg-radial-gradient from-[#D9A441]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-[#D9A441] text-xs uppercase tracking-widest font-bold mb-2">GET IN TOUCH</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-lg mx-auto leading-relaxed">
            We're here to help. Reach out with any questions, room availability inquiries, or feedback.
          </p>
        </div>
      </div>

      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-5">
            {[
              { icon: Phone, title: 'Phone', info: '+91 (044) 2220 0000', desc: '24/7 Front Desk & Support' },
              { icon: Mail, title: 'Email', info: 'reservations@itcgrandchola.com', desc: 'Room Reservations & General' },
              { icon: MapPin, title: 'Address', info: '63 Mount Road, Guindy', desc: 'Chennai, Tamil Nadu 600032' },
            ].map(item => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card-base p-6 flex items-start gap-4 bg-[#151C18] border border-[#28362D] rounded-2xl shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#101512] border border-[#28362D] text-[#D9A441]">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="font-serif font-bold text-sm text-white mb-0.5">{item.title}</p>
                  <p className="text-sm font-semibold text-[#D9A441]">{item.info}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 card-base p-8 bg-[#151C18] border border-[#28362D] rounded-2xl shadow-sm"
          >
            <h2 className="font-serif text-2xl font-bold mb-6 text-white">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#8C7249]">YOUR NAME *</label>
                  <input id="name" type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" className="input-field" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#8C7249]">EMAIL ADDRESS *</label>
                  <input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" className="input-field" required />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#8C7249]">SUBJECT</label>
                <input id="subject" type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Room booking inquiry, feedback..." className="input-field" />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#8C7249]">MESSAGE *</label>
                <textarea id="message" rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="How can we help you?" className="input-field resize-none" required />
              </div>
              <button type="submit" disabled={loading} className="btn-gold disabled:opacity-60 disabled:cursor-not-allowed px-8 py-3 text-sm font-semibold flex items-center gap-2">
                {loading ? 'Sending...' : <><Send size={15} /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
