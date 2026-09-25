import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/bookings/my
router.get('/my', async (req: AuthRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*, hotel:hotels(*), booking_items(*, room_type:room_types(*))')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: 'Failed to fetch bookings' })
  res.json({ data })
})

// GET /api/bookings/:id
router.get('/:id', async (req: AuthRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*, hotel:hotels(*), booking_items(*, room_type:room_types(*)), payments(*)')
    .eq('id', req.params.id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Booking not found' })
  // Ensure user can only see own booking (unless admin)
  if (data.user_id !== req.user!.id && !['admin', 'staff'].includes(req.user!.role)) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  res.json({ data })
})

// POST /api/bookings — create booking
router.post('/', async (req: AuthRequest, res) => {
  const { room_type_id, hotel_id, check_in, check_out, guests, special_requests } = req.body

  // Validate input
  if (!room_type_id || !hotel_id || !check_in || !check_out || !guests) {
    return res.status(400).json({ error: 'Missing required booking fields.' })
  }

  if (new Date(check_out) <= new Date(check_in)) {
    return res.status(400).json({ error: 'Check-out must be after check-in.' })
  }

  const nights = Math.ceil((new Date(check_out).getTime() - new Date(check_in).getTime()) / 86400000)

  // Fetch rate
  const { data: rate } = await supabaseAdmin
    .from('room_rates')
    .select('*')
    .eq('room_type_id', room_type_id)
    .eq('is_active', true)
    .single()

  if (!rate) return res.status(400).json({ error: 'No active rate for this room type.' })

  // Check capacity
  const { data: roomType } = await supabaseAdmin.from('room_types').select('capacity').eq('id', room_type_id).single()
  if (roomType && guests > roomType.capacity) {
    return res.status(400).json({ error: `Guest count exceeds room capacity of ${roomType.capacity}.` })
  }

  // Check availability (prevent double booking)
  const { count } = await supabaseAdmin
    .from('booking_items')
    .select('*, booking:bookings!inner(*)', { count: 'exact', head: true })
    .eq('room_type_id', room_type_id)
    .not('booking.status', 'in', '("cancelled","refunded")')
    .lt('booking.check_in', check_out)
    .gt('booking.check_out', check_in)

  const { count: totalRooms } = await supabaseAdmin
    .from('rooms')
    .select('*', { count: 'exact', head: true })
    .eq('room_type_id', room_type_id)
    .in('status', ['available', 'occupied'])

  if ((count || 0) >= (totalRooms || 0)) {
    return res.status(409).json({ error: 'No rooms are available for the selected dates.' })
  }

  // Calculate totals
  const subtotal = rate.base_price * nights
  const taxes = (subtotal * rate.taxes_percent) / 100
  const fees = rate.fees
  const total_amount = subtotal + taxes + fees

  // Generate reference
  const { data: refData } = await supabaseAdmin.rpc('generate_booking_reference')
  const reference = refData || `HTL-${Date.now()}`

  // Create booking
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .insert({
      reference,
      user_id: req.user!.id,
      hotel_id,
      check_in,
      check_out,
      guests,
      status: 'payment_pending',
      subtotal,
      taxes,
      fees,
      discount: 0,
      total_amount,
      special_requests: special_requests || null,
    })
    .select()
    .single()

  if (bookingError || !booking) {
    console.error('[Create Booking]', bookingError)
    return res.status(500).json({ error: 'Failed to create booking.' })
  }

  // Create booking item
  await supabaseAdmin.from('booking_items').insert({
    booking_id: booking.id,
    room_type_id,
    quantity: 1,
    unit_price: rate.base_price,
    total_price: subtotal,
  })

  // Audit log
  await supabaseAdmin.from('audit_logs').insert({
    actor_id: req.user!.id,
    action: 'CREATE_BOOKING',
    entity: 'bookings',
    entity_id: booking.id,
    metadata: { reference, total_amount },
  })

  res.status(201).json({ data: booking })
})

// POST /api/bookings/:id/cancel
router.post('/:id/cancel', async (req: AuthRequest, res) => {
  const { reason } = req.body

  const { data: booking } = await supabaseAdmin.from('bookings').select('*').eq('id', req.params.id).single()
  if (!booking) return res.status(404).json({ error: 'Booking not found.' })
  if (booking.user_id !== req.user!.id && !['admin', 'staff'].includes(req.user!.role)) {
    return res.status(403).json({ error: 'Forbidden.' })
  }
  if (!['pending', 'payment_pending', 'confirmed'].includes(booking.status)) {
    return res.status(400).json({ error: 'This booking cannot be cancelled.' })
  }

  await supabaseAdmin.from('bookings').update({ status: 'cancelled' }).eq('id', req.params.id)
  await supabaseAdmin.from('cancellations').insert({
    booking_id: req.params.id,
    reason: reason || null,
    cancelled_by: req.user!.id,
    refund_status: booking.status === 'confirmed' ? 'pending' : 'not_applicable',
  })

  await supabaseAdmin.from('audit_logs').insert({
    actor_id: req.user!.id,
    action: 'CANCEL_BOOKING',
    entity: 'bookings',
    entity_id: req.params.id,
  })

  res.json({ message: 'Booking cancelled successfully.' })
})

export default router
