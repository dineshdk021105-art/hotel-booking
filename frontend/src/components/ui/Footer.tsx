import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid rgba(217,164,65,0.12)' }}>
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-extrabold tracking-wider"
                style={{ background: 'var(--accent-gold)', color: '#070A08' }}
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
            </div>
            <p className="body-text text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Comfortable rooms, good food and friendly service in one convenient place.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider mb-5 uppercase" style={{ color: 'var(--accent-gold)', letterSpacing: '0.12em' }}>
              QUICK LINKS
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/rooms', label: 'Rooms & Suites' },
                { to: '/dining', label: 'Dining' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/rooms', label: 'Book Now' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="transition-colors hover:text-amber-400"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider mb-5 uppercase" style={{ color: 'var(--accent-gold)', letterSpacing: '0.12em' }}>
              CONTACT US
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>+91 (044) 2220 0000</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>24/7 Front Desk & Concierge</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>reservations@itcgrandchola.com</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reservations & Inquiries</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>63 Mount Road, Guindy</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Chennai, Tamil Nadu 600032</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider mb-5 uppercase" style={{ color: 'var(--accent-gold)', letterSpacing: '0.12em' }}>
              POLICIES
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms & Conditions' },
                { to: '/cancellation-policy', label: 'Cancellation Policy' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="transition-colors hover:text-amber-400"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: '1px solid rgba(217,164,65,0.08)',
            color: 'var(--text-muted)',
          }}
        >
          <p>© {currentYear} ITC Grand Chola. All rights reserved.</p>
          <p>Comfortable rooms, good food and friendly service.</p>
        </div>
      </div>
    </footer>
  )
}
