import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, BedDouble, UtensilsCrossed, ShoppingBag,
  Users, Star, BarChart2, Settings, LogOut, ChevronLeft, Menu
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/admin/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/admin/room-types', icon: BedDouble, label: 'Room Types' },
  { to: '/admin/food', icon: UtensilsCrossed, label: 'Food Menu' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Food Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/reports', icon: BarChart2, label: 'Reports' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid rgba(217,164,65,0.1)',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 h-16 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(217,164,65,0.1)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
            style={{ background: 'var(--accent-gold)', color: '#070A08' }}
          >
            ITC
          </div>
          {!collapsed && (
            <div>
              <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Admin Panel</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ITC Grand Chola</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded transition-colors hover:bg-white/5"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
                style={{
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(217,164,65,0.1)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                }}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User + Sign Out */}
        <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(217,164,65,0.08)' }}>
          {!collapsed && user && (
            <div className="px-3 py-2 mb-1">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {user.full_name}
              </p>
              <p className="text-xs capitalize" style={{ color: 'var(--accent-gold)' }}>{user.role}</p>
            </div>
          )}
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm hover:bg-white/5"
            style={{ color: 'var(--text-muted)' }}
            title={collapsed ? 'View Site' : undefined}
          >
            <ChevronLeft size={18} style={{ flexShrink: 0 }} />
            {!collapsed && 'View Site'}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm hover:bg-white/5 text-left"
            style={{ color: 'var(--error)' }}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
