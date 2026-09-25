import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/dashboard'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      toast.error(error.includes('credentials') ? 'Invalid email or password.' : error)
    } else {
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(217,164,65,0.06) 0%, transparent 60%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-extrabold tracking-wider flex-shrink-0"
              style={{ background: 'var(--accent-gold)', color: '#070A08' }}
            >
              ITC
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-xl leading-tight" style={{ color: 'var(--text-primary)' }}>ITC Grand Chola</p>
              <p className="text-[9px] font-semibold tracking-widest" style={{ color: 'var(--accent-gold)' }}>LUXURY HOTEL & SUITES</p>
            </div>
          </Link>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(217,164,65,0.15)',
          }}
        >
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Sign in to manage your bookings and orders
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold mb-1.5 tracking-wider" style={{ color: 'var(--accent-gold)' }}>
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field input-field-icon"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs" style={{ color: 'var(--error)' }} role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold mb-1.5 tracking-wider" style={{ color: 'var(--accent-gold)' }}>
                PASSWORD
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field input-field-icon pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs" style={{ color: 'var(--error)' }} role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full justify-center py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#070A08', borderTopColor: 'transparent' }} />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold" style={{ color: 'var(--accent-gold)' }}>
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
