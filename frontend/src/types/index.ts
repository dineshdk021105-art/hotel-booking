// ===== USER / AUTH =====
export interface User {
  id: string
  email: string
  role: 'customer' | 'admin' | 'staff'
  full_name: string
  phone?: string
  avatar_url?: string
  created_at: string
}

// ===== HOTEL =====
export interface Hotel {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  facilities: string[]
  policies: string
  check_in_time: string
  check_out_time: string
  images: string[]
  rating?: number
  review_count?: number
  status: 'active' | 'inactive'
  created_at: string
}

// ===== ROOM TYPE =====
export interface RoomType {
  id: string
  hotel_id: string
  name: string
  description: string
  capacity: number
  bed_type: string
  size_sqft?: number
  amenities: string[]
  images: string[]
  cancellation_policy?: string
  status: 'active' | 'inactive'
  hotel?: Hotel
  rooms?: Room[]
  rates?: RoomRate[]
}

// ===== ROOM =====
export interface Room {
  id: string
  room_type_id: string
  room_number: string
  floor?: number
  status: 'available' | 'occupied' | 'maintenance' | 'blocked'
  notes?: string
  room_type?: RoomType
}

// ===== ROOM RATE =====
export interface RoomRate {
  id: string
  room_type_id: string
  season_name?: string
  start_date?: string
  end_date?: string
  base_price: number
  taxes_percent: number
  fees: number
  is_active: boolean
}

// ===== BOOKING =====
export interface Booking {
  id: string
  reference: string
  user_id: string
  hotel_id: string
  check_in: string
  check_out: string
  guests: number
  status: BookingStatus
  subtotal: number
  taxes: number
  fees: number
  discount: number
  total_amount: number
  special_requests?: string
  created_at: string
  updated_at: string
  user?: User
  hotel?: Hotel
  booking_items?: BookingItem[]
  payments?: Payment[]
  cancellation?: Cancellation
}

export type BookingStatus =
  | 'pending'
  | 'payment_pending'
  | 'confirmed'
  | 'cancelled'
  | 'checked_in'
  | 'checked_out'
  | 'refund_pending'
  | 'refunded'

// ===== BOOKING ITEM =====
export interface BookingItem {
  id: string
  booking_id: string
  room_type_id: string
  room_id?: string
  quantity: number
  unit_price: number
  total_price: number
  room_type?: RoomType
  room?: Room
}

// ===== PAYMENT =====
export interface Payment {
  id: string
  booking_id: string
  gateway: string
  gateway_order_id?: string
  gateway_payment_id?: string
  gateway_signature?: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed' | 'refunded'
  paid_at?: string
  created_at: string
}

// ===== CANCELLATION =====
export interface Cancellation {
  id: string
  booking_id: string
  reason?: string
  cancelled_by: string
  cancelled_at: string
  refund_status: 'not_applicable' | 'pending' | 'processed' | 'failed'
  refund_amount?: number
}

// ===== FOOD CATEGORY =====
export interface FoodCategory {
  id: string
  name: string
  description?: string
  image?: string
  display_order: number
  is_active: boolean
}

// ===== FOOD ITEM =====
export interface FoodItem {
  id: string
  category_id: string
  name: string
  description?: string
  price: number
  image?: string
  is_vegetarian: boolean
  is_available: boolean
  preparation_time?: number
  category?: FoodCategory
}

// ===== FOOD ORDER =====
export interface FoodOrder {
  id: string
  user_id: string
  booking_id?: string
  customer_name: string
  phone: string
  delivery_location: string
  special_instructions?: string
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
  total_amount: number
  created_at: string
  order_items?: FoodOrderItem[]
}

// ===== FOOD ORDER ITEM =====
export interface FoodOrderItem {
  id: string
  order_id: string
  food_item_id: string
  quantity: number
  unit_price: number
  total_price: number
  food_item?: FoodItem
}

// ===== REVIEW =====
export interface Review {
  id: string
  user_id: string
  hotel_id: string
  booking_id?: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user?: User
}

// ===== CART =====
export interface CartItem {
  food_item: FoodItem
  quantity: number
}

// ===== SEARCH PARAMS =====
export interface RoomSearchParams {
  check_in: string
  check_out: string
  guests: number
  room_type_id?: string
}

// ===== API RESPONSE =====
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// ===== AVAILABILITY =====
export interface AvailableRoom {
  room_type: RoomType
  available_count: number
  price_per_night: number
  total_for_stay: number
  nights: number
}
