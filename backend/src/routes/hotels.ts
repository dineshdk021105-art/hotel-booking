import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'

const router = Router()

// GET /api/hotels
router.get('/', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('hotels')
    .select('*')
    .eq('status', 'active')
  if (error) return res.status(500).json({ error: 'Failed to fetch hotels' })
  res.json({ data })
})

// GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('hotels')
    .select('*, room_types(*)')
    .eq('id', req.params.id)
    .single()
  if (error || !data) return res.status(404).json({ error: 'Hotel not found' })
  res.json({ data })
})

export default router
