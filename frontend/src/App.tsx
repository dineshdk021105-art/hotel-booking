import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Layout from './layouts/Layout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import HomePage from './pages/HomePage'
import RoomsPage from './pages/RoomsPage'
import RoomDetailPage from './pages/RoomDetailPage'
import DiningPage from './pages/DiningPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BookingConfirmationPage from './pages/BookingConfirmationPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Customer Pages
import DashboardPage from './pages/customer/DashboardPage'
import MyBookingsPage from './pages/customer/MyBookingsPage'
import MyOrdersPage from './pages/customer/MyOrdersPage'
import ProfilePage from './pages/customer/ProfilePage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBookings from './pages/admin/AdminBookings'
import AdminRooms from './pages/admin/AdminRooms'
import AdminRoomTypes from './pages/admin/AdminRoomTypes'
import AdminFood from './pages/admin/AdminFood'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminReviews from './pages/admin/AdminReviews'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'

import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />
              <Route path="/dining" element={<DiningPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/booking/confirmation/:id" element={<BookingConfirmationPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer Protected Routes */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/rooms" element={<AdminRooms />} />
              <Route path="/admin/room-types" element={<AdminRoomTypes />} />
              <Route path="/admin/food" element={<AdminFood />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#101A15',
                color: '#F5F2E8',
                border: '1px solid rgba(217,164,65,0.2)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#2FA66A', secondary: '#101A15' } },
              error: { iconTheme: { primary: '#C94444', secondary: '#101A15' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
