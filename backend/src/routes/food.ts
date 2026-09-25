import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import authMiddleware, { AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/food — all food items
router.get('/', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('food_items')
    .select('*, category:food_categories(*)')
    .eq('is_available', true)
    .order('category_id')
  if (error) return res.status(500).json({ error: 'Failed to fetch food menu' })
  res.json({ data })
})

// GET /api/food/categories
router.get('/categories', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('food_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  if (error) return res.status(500).json({ error: 'Failed to fetch categories' })
  res.json({ data })
})

// POST /api/food/orders
router.post('/orders', authMiddleware, async (req: AuthRequest, res) => {
  const { items, customer_name, phone, delivery_location, special_instructions, booking_id } = req.body

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items in order.' })
  }
  if (!customer_name || !phone || !delivery_location) {
    return res.status(400).json({ error: 'Customer name, phone, and delivery location are required.' })
  }

  // Fetch item prices from DB (never trust frontend prices)
  const itemIds = items.map((i: any) => i.food_item_id)
  const { data: foodItems } = await supabaseAdmin
    .from('food_items')
    .select('id, price, is_available, name')
    .in('id', itemIds)

  if (!foodItems) return res.status(500).json({ error: 'Failed to verify items.' })

  const unavailable = foodItems.filter(f => !f.is_available)
  if (unavailable.length > 0) {
    return res.status(400).json({ error: `The following items are not available: ${unavailable.map(f => f.name).join(', ')}` })
  }

  const total_amount = items.reduce((sum: number, item: any) => {
    const foodItem = foodItems.find(f => f.id === item.food_item_id)
    return sum + (foodItem ? foodItem.price * item.quantity : 0)
  }, 0)

  const { data: order, error: orderErr } = await supabaseAdmin
    .from('food_orders')
    .insert({
      user_id: req.user!.id,
      booking_id: booking_id || null,
      customer_name,
      phone,
      delivery_location,
      special_instructions: special_instructions || null,
      status: 'pending',
      total_amount,
    })
    .select()
    .single()

  if (orderErr || !order) return res.status(500).json({ error: 'Failed to create order.' })

  // Create order items
  const orderItems = items.map((item: any) => {
    const foodItem = foodItems.find(f => f.id === item.food_item_id)!
    return {
      order_id: order.id,
      food_item_id: item.food_item_id,
      quantity: item.quantity,
      unit_price: foodItem.price,
      total_price: foodItem.price * item.quantity,
    }
  })

  await supabaseAdmin.from('food_order_items').insert(orderItems)

  res.status(201).json({ data: order })
})

// GET /api/food/orders/my
router.get('/orders/my', authMiddleware, async (req: AuthRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('food_orders')
    .select('*, order_items:food_order_items(*, food_item:food_items(*))')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: 'Failed to fetch orders' })
  res.json({ data })
})

export default router
