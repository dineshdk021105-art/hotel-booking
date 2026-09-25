import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../lib/supabase'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export default async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Please provide a valid token.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token.' })
    }

    // Get role from profiles table
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    req.user = {
      id: user.id,
      email: user.email || '',
      role: profile?.role || 'customer',
    }

    next()
  } catch (err) {
    console.error('[Auth Middleware]', err)
    return res.status(401).json({ error: 'Authentication failed.' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || !['admin', 'staff'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden. Admin access required.' })
  }
  next()
}
