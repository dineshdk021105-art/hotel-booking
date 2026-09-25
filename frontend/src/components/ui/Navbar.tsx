import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import toast from 'react-hot-toast'

interface NavbarProps {
  scrolled: boolean
}

export default function Navbar({ scrolled }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/dining', label: 'Dining' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(10, 14, 11, 0.96)'
          : 'rgba(10, 14, 11, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(217,164,65,0.15)',
      }}
    >
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-extrabold tracking-wider"
              style={{ background: 'var(--accent-green)', color: '#FFFFFF' }}
            >
              ITC
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
                ITC Grand Chola
              </div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#E5B869] uppercase mt-0.5">
                LUXURY HOTEL & SUITES
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={() => {
                const evt = new CustomEvent('toggle-cart')
                window.dispatchEvent(evt)
              }}
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: 'var(--accent-gold)', color: '#070A08' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(217,164,65,0.08)', border: '1px solid rgba(217,164,65,0.2)' }}
                >
                  <User size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {user.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-xl py-2 z-50"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid rgba(217,164,65,0.15)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <LayoutDashboard size={15} style={{ color: 'var(--accent-gold)' }} />
                        Dashboard
                      </Link>
                      <Link
                        to="/my-bookings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <User size={15} style={{ color: 'var(--accent-gold)' }} />
                        My Bookings
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'var(--accent-gold)' }}
                        >
                          <Shield size={15} />
                          Admin Panel
                        </Link>
                      )}
                      <div className="my-1 border-t" style={{ borderColor: 'rgba(217,164,65,0.1)' }} />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 text-left"
                        style={{ color: 'var(--error)' }}
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}

            <Link to="/rooms" className="btn-green text-sm">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => {
                const evt = new CustomEvent('toggle-cart')
                window.dispatchEvent(evt)
              }}
              className="relative p-2"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: 'var(--accent-gold)', color: '#070A08', fontSize: '10px' }}
                >
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden"
            style={{
              background: 'rgba(7, 10, 8, 0.98)',
              borderTop: '1px solid rgba(217,164,65,0.1)',
            }}
          >
            <div className="px-4 pb-6 pt-4 space-y-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-white' : ''}`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(217,164,65,0.08)' : 'transparent',
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost w-full justify-center">
                      Login
                    </Link>
                    <Link to="/rooms" onClick={() => setMobileOpen(false)} className="btn-gold w-full justify-center">
                      Book Now
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn-ghost w-full justify-center">
                      Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="btn-ghost w-full justify-center" style={{ color: 'var(--error)' }}>
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
