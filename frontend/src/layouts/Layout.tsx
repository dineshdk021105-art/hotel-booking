import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import CartSidebar from '../components/food/CartSidebar'

export default function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  // Always reset scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <Navbar scrolled={scrolled} />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
