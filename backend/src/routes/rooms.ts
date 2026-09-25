import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'

const router = Router()

// GET /api/rooms — list room types with availability check
router.get('/', async (req, res) => {
  const { check_in, check_out, guests } = req.query

  let query = supabaseAdmin
    .from('room_types')
    .select('*, rates:room_rates(*), rooms(*)')
    .eq('status', 'active')

  if (guests) {
    query = query.gte('capacity', Number(guests))
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: 'Failed to fetch rooms' })

  // If dates provided, filter by availability
  if (check_in && check_out && data) {
    const available = await Promise.all(data.map(async (rt: any) => {
      const totalRooms = (rt.rooms || []).filter((r: any) =>
        r.status === 'available' || r.status === 'occupied'
      ).length

      // Count rooms already booked for this date range
      const { count } = await supabaseAdmin
        .from('booking_items')
        .select('*, booking:bookings!inner(*)', { count: 'exact', head: true })
        .eq('room_type_id', rt.id)
        .not('booking.status', 'in', '("cancelled","refunded")')
        .lt('booking.check_in', check_out as string)
        .gt('booking.check_out', check_in as string)

      const bookedCount = count || 0
      const availableCount = Math.max(0, totalRooms - bookedCount)

      return { ...rt, available_count: availableCount }
    }))

    return res.json({ data: available.filter(r => r.available_count > 0) })
  }

  res.json({ data })
})

// GET /api/rooms/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('room_types')
    .select('*, rates:room_rates(*), hotel:hotels(*)')
    .eq('id', req.params.id)
    .single()
  if (error || !data) return res.status(404).json({ error: 'Room type not found' })
  res.json({ data })
})

export default router
