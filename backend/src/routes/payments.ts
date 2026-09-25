import { Router } from 'express'
import crypto from 'crypto'
import { supabaseAdmin } from '../lib/supabase'
import authMiddleware, { AuthRequest } from '../middleware/auth'

const router = Router()

// Razorpay instance (lazy init to avoid crash if key not configured)
const getRazorpay = () => {
  const Razorpay = require('razorpay')
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  })
}

// POST /api/payments/create-order
router.post('/create-order', authMiddleware, async (req: AuthRequest, res) => {
  const { booking_id } = req.body
  if (!booking_id) return res.status(400).json({ error: 'booking_id is required' })

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', booking_id)
    .single()

  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  if (booking.user_id !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  if (!['pending', 'payment_pending'].includes(booking.status)) {
    return res.status(400).json({ error: 'Booking is not awaiting payment' })
  }

  try {
    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount: Math.round(booking.total_amount * 100), // paise/kobo
      currency: 'INR', // Change to NGN once Razorpay NGN supported
      receipt: booking.reference,
      notes: { booking_id: booking.id, user_id: req.user!.id },
    })

    // Store payment record
    await supabaseAdmin.from('payments').insert({
      booking_id: booking.id,
      gateway: 'razorpay',
      gateway_order_id: order.id,
      amount: booking.total_amount,
      currency: 'INR',
      status: 'pending',
    })

    res.json({
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      }
    })
  } catch (err: any) {
    console.error('[Create Razorpay Order]', err)
    res.status(500).json({ error: 'Payment order creation failed. Please try again.' })
  }
})

// POST /api/payments/verify
router.post('/verify', authMiddleware, async (req: AuthRequest, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
    return res.status(400).json({ error: 'Missing payment verification parameters.' })
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    console.warn('[Payment Verify] Signature mismatch for booking:', booking_id)
    return res.status(400).json({ error: 'Payment verification failed. Signature mismatch.' })
  }

  // Update payment record
  const { error: payErr } = await supabaseAdmin
    .from('payments')
    .update({
      gateway_payment_id: razorpay_payment_id,
      gateway_signature: razorpay_signature,
      status: 'success',
      paid_at: new Date().toISOString(),
    })
    .eq('gateway_order_id', razorpay_order_id)

  if (payErr) {
    console.error('[Payment Verify] Could not update payment', payErr)
    return res.status(500).json({ error: 'Payment recorded but could not update booking. Contact support.' })
  }

  // Confirm booking
  await supabaseAdmin
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', booking_id)

  // Audit log
  await supabaseAdmin.from('audit_logs').insert({
    actor_id: req.user!.id,
    action: 'PAYMENT_VERIFIED',
    entity: 'payments',
    metadata: { booking_id, razorpay_payment_id },
  })

  res.json({ message: 'Payment verified and booking confirmed.', data: { booking_id } })
})

export default router
