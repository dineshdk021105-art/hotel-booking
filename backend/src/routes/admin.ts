import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { AuthRequest, requireAdmin } from '../middleware/auth'

const router = Router()
router.use(requireAdmin)

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  const { status, search, page = '1', limit = '20' } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  let query = supabaseAdmin
    .from('bookings')
    .select('*, user:profiles(full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1)

  if (status) query = query.eq('status', status as string)
  if (search) query = query.ilike('reference', `%${search}%`)

  const { data, count, error } = await query
  if (error) return res.status(500).json({ error: 'Failed to fetch bookings' })
  res.json({ data, total: count, page: Number(page), limit: Number(limit) })
})

// PUT /api/admin/bookings/:id/status
router.put('/bookings/:id/status', async (req: AuthRequest, res) => {
  const { status } = req.body
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out', 'refund_pending', 'refunded']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const { error } = await supabaseAdmin.from('bookings').update({ status }).eq('id', req.params.id)
  if (error) return res.status(500).json({ error: 'Failed to update booking' })

  await supabaseAdmin.from('audit_logs').insert({
    actor_id: req.user!.id,
    action: `UPDATE_BOOKING_STATUS_${status.toUpperCase()}`,
    entity: 'bookings',
    entity_id: req.params.id,
  })

  res.json({ message: 'Booking status updated' })
})

// GET /api/admin/rooms
router.get('/rooms', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('rooms')
    .select('*, room_type:room_types(*)')
    .order('room_number')
  if (error) return res.status(500).json({ error: 'Failed to fetch rooms' })
  res.json({ data })
})

// POST /api/admin/rooms
router.post('/rooms', async (req: AuthRequest, res) => {
  const { room_type_id, room_number, floor, status } = req.body
  if (!room_type_id || !room_number) {
    return res.status(400).json({ error: 'room_type_id and room_number are required' })
  }
  const { data, error } = await supabaseAdmin
    .from('rooms')
    .insert({ room_type_id, room_number, floor: floor || null, status: status || 'available' })
    .select().single()
  if (error) return res.status(500).json({ error: 'Failed to create room' })
  res.status(201).json({ data })
})

// PUT /api/admin/rooms/:id
router.put('/rooms/:id', async (req, res) => {
  const { status, notes } = req.body
  const { error } = await supabaseAdmin.from('rooms').update({ status, notes }).eq('id', req.params.id)
  if (error) return res.status(500).json({ error: 'Failed to update room' })
  res.json({ message: 'Room updated' })
})

// GET /api/admin/reports
router.get('/reports', async (_req, res) => {
  const [
    { count: totalBookings },
    { data: revenueData },
    { count: confirmedBookings },
    { count: cancelledBookings },
    { count: foodOrders },
  ] = await Promise.all([
    supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('bookings').select('total_amount').in('status', ['confirmed', 'checked_in', 'checked_out']),
    supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    supabaseAdmin.from('food_orders').select('*', { count: 'exact', head: true }),
  ])

  const totalRevenue = (revenueData || []).reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0)

  res.json({
    data: {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      foodOrders,
    }
  })
})

// GET /api/admin/users
router.get('/users', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: 'Failed to fetch users' })
  res.json({ data })
})

// GET /api/admin/reviews
router.get('/reviews', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*, user:profiles(full_name)')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: 'Failed to fetch reviews' })
  res.json({ data })
})

// PUT /api/admin/reviews/:id
router.put('/reviews/:id', async (req, res) => {
  const { status } = req.body
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  const { error } = await supabaseAdmin.from('reviews').update({ status }).eq('id', req.params.id)
  if (error) return res.status(500).json({ error: 'Failed to update review' })
  res.json({ message: 'Review updated' })
})

export default router
