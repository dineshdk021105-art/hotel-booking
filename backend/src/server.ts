import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ─── Security Middleware ───
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// ─── Rate Limiting ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

// ─── Body Parsing ───
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Logging ───
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'))
}

// ─── Routes ───
import hotelRoutes from './routes/hotels'
import roomRoutes from './routes/rooms'
import bookingRoutes from './routes/bookings'
import paymentRoutes from './routes/payments'
import foodRoutes from './routes/food'
import adminRoutes from './routes/admin'
import authMiddleware from './middleware/auth'

app.use('/api/hotels', hotelRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/bookings', authMiddleware, bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/admin', authMiddleware, adminRoutes)

// ─── Welcome / Root Route ───
app.get('/', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ITC Grand Chola - Backend API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0A0E0B;
      color: #E2DFD2;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #151C18;
      border: 1px solid #28362D;
      border-radius: 16px;
      padding: 40px;
      max-width: 520px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .badge {
      display: inline-block;
      background: #1E2722;
      color: #D9A441;
      border: 1px solid #28362D;
      padding: 5px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      color: #FFFFFF;
      margin: 0 0 10px;
      font-size: 26px;
    }
    p {
      color: #A3AFA8;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 24px;
    }
    .btn {
      display: inline-block;
      background: #D9A441;
      color: #070A08;
      font-weight: 700;
      font-size: 14px;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      transition: 0.2s;
    }
    .btn:hover {
      background: #c59336;
    }
    .endpoints {
      margin-top: 30px;
      text-align: left;
      background: #0D120F;
      border: 1px solid #202B24;
      border-radius: 8px;
      padding: 14px;
      font-size: 12px;
      color: #8C9992;
    }
    .endpoints code {
      color: #D9A441;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">API Server Active · Port 3001</div>
    <h1>ITC Grand Chola Backend API</h1>
    <p>This server provides the REST API endpoints and database connection for the hotel booking system.</p>
    <a href="http://localhost:5173" class="btn">Open Hotel Website (Frontend) &rarr;</a>
    <div class="endpoints">
      <strong>Available API Endpoints:</strong><br>
      • <code>GET /health</code> - Server health check<br>
      • <code>GET /api/food</code> - Food menu & categories<br>
      • <code>GET /api/hotels</code> - Hotel details<br>
      • <code>GET /api/rooms</code> - Available room types
    </div>
  </div>
</body>
</html>`)
})

app.get('/api', (_req, res) => {
  res.json({
    status: 'online',
    service: 'ITC Grand Chola Hotel API',
    version: '1.0.0',
    frontend: 'http://localhost:5173',
    endpoints: ['/api/hotels', '/api/rooms', '/api/food', '/api/bookings', '/api/payments', '/health']
  })
})

// ─── Health Check ───
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── 404 Handler ───
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Error Handler ───
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err.message)
  res.status(500).json({ error: 'An internal error occurred. Please try again.' })
})

// ─── Start ───
app.listen(PORT, () => {
  console.log(`✅ ITC Grand Chola API running on http://localhost:${PORT}`)
})

export default app
