import React, { createContext, useContext, useState, useEffect } from 'react'
import type { CartItem, FoodItem } from '../types'

interface CartContextType {
  items: CartItem[]
  addItem: (foodItem: FoodItem) => void
  removeItem: (foodItemId: string) => void
  updateQuantity: (foodItemId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = 'hotel_food_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (foodItem: FoodItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.food_item.id === foodItem.id)
      if (existing) {
        return prev.map(i =>
          i.food_item.id === foodItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { food_item: foodItem, quantity: 1 }]
    })
  }

  const removeItem = (foodItemId: string) => {
    setItems(prev => prev.filter(i => i.food_item.id !== foodItemId))
  }

  const updateQuantity = (foodItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(foodItemId)
      return
    }
    setItems(prev =>
      prev.map(i => i.food_item.id === foodItemId ? { ...i, quantity } : i)
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.food_item.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
