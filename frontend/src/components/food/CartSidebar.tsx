import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { Link } from 'react-router-dom'

export default function CartSidebar() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  useEffect(() => {
    const handler = () => setOpen(prev => !prev)
    window.addEventListener('toggle-cart', handler)
    return () => window.removeEventListener('toggle-cart', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.7)' }}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{
              background: 'var(--bg-card)',
              borderLeft: '1px solid rgba(217,164,65,0.15)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Food cart"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(217,164,65,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} style={{ color: 'var(--accent-gold)' }} />
                <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Your Order
                </h2>
                {itemCount > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: 'var(--accent-gold)', color: '#070A08' }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <ShoppingCart size={48} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                  <div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Your cart is empty</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add items from our dining menu</p>
                  </div>
                  <Link
                    to="/dining"
                    onClick={() => setOpen(false)}
                    className="btn-gold mt-2"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.food_item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.food_item.image || 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&q=80'}
                        alt={item.food_item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>
                        {item.food_item.name}
                      </p>
                      <p className="text-sm font-bold" style={{ color: 'var(--accent-gold)' }}>
                        ₦{(item.food_item.price * item.quantity).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.food_item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center"
                          style={{ background: 'rgba(217,164,65,0.1)', color: 'var(--accent-gold)' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center" style={{ color: 'var(--text-primary)' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.food_item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center"
                          style={{ background: 'rgba(217,164,65,0.1)', color: 'var(--accent-gold)' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.food_item.id)}
                      className="p-1 self-start rounded transition-colors hover:text-red-400"
                      style={{ color: 'var(--text-muted)' }}
                      aria-label={`Remove ${item.food_item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-6 py-5"
                style={{ borderTop: '1px solid rgba(217,164,65,0.1)' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Total</span>
                  <span className="font-display text-xl font-bold" style={{ color: 'var(--accent-gold)' }}>
                    ₦{total.toLocaleString()}
                  </span>
                </div>
                <Link
                  to="/dining?checkout=1"
                  onClick={() => setOpen(false)}
                  className="btn-gold w-full justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
