import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const update = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'

    // Indian mobile number validation (10 digits starting with 6, 7, 8, or 9, optional +91 or 0 prefix)
    const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/
    const cleanPhone = form.phone.replace(/[\s-]/g, '')
    if (!form.phone.trim()) {
      e.phone = 'Indian mobile number is required'
    } else if (!indianPhoneRegex.test(cleanPhone)) {
      e.phone = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210)'
    }

    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.fullName, form.phone)
    setLoading(false)
    if (error) {
      toast.error(error.includes('already') ? 'An account with this email already exists.' : error)
    } else {
      toast.success('Account created! Welcome to ITC Grand Chola.')
      navigate('/dashboard')
    }
  }

  const fields = [
    { id: 'fullName', label: 'FULL NAME *', type: 'text', icon: User, placeholder: 'John Doe', autocomplete: 'name' },
    { id: 'email', label: 'EMAIL ADDRESS *', type: 'email', icon: Mail, placeholder: 'your@email.com', autocomplete: 'email' },
    { id: 'phone', label: 'INDIAN MOBILE NUMBER *', type: 'tel', icon: Phone, placeholder: '+91 98765 43210', autocomplete: 'tel' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-28 bg-[#0A0E0B] text-white">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(217,164,65,0.06) 0%, transparent 60%)' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-extrabold tracking-wider flex-shrink-0 bg-[#D9A441] text-[#070A08]">ITC</div>
            <div className="text-left">
              <p className="font-serif font-bold text-xl leading-tight text-white">ITC Grand Chola</p>
              <p className="text-[9px] font-semibold tracking-widest text-[#D9A441]">LUXURY HOTEL & SUITES</p>
            </div>
          </Link>
        </div>

        <div className="rounded-2xl p-8 bg-[#151C18] border border-[#28362D] shadow-xl">
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-bold mb-1 text-white">Create account</h1>
            <p className="text-sm text-gray-400">Join ITC Grand Chola for a luxury stay experience</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {fields.map(field => {
              const Icon = field.icon
              const val = form[field.id as keyof typeof form]
              return (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#D9A441]">
                    {field.label}
                  </label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id={field.id}
                      type={field.type}
                      autoComplete={field.autocomplete}
                      value={val}
                      onChange={e => update(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-field input-field-icon bg-[#0F1411] border-[#28362D] text-white"
                      aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                      aria-invalid={!!errors[field.id]}
                    />
                  </div>
                  {errors[field.id] && (
                    <p id={`${field.id}-error`} className="mt-1 text-xs text-red-400" role="alert">{errors[field.id]}</p>
                  )}
                </div>
              )
            })}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#D9A441]">PASSWORD *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="At least 8 characters"
                  className="input-field input-field-icon pr-10 bg-[#0F1411] border-[#28362D] text-white"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  aria-invalid={!!errors.password}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="mt-1 text-xs text-red-400" role="alert">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold mb-1.5 tracking-wider uppercase text-[#D9A441]">CONFIRM PASSWORD *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className="input-field input-field-icon bg-[#0F1411] border-[#28362D] text-white"
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  aria-invalid={!!errors.confirmPassword}
                />
              </div>
              {errors.confirmPassword && <p id="confirmPassword-error" className="mt-1 text-xs text-red-400" role="alert">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 mt-2 font-bold disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-[#070A08] border-t-transparent" />
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#D9A441] hover:underline">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
