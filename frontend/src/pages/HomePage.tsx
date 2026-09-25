import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BedDouble, CheckCircle2,
  MapPin, Users, Wifi,
  Sparkles, ShieldCheck, UtensilsCrossed, Zap, ParkingCircle, PartyPopper, ShoppingCart
} from 'lucide-react'
import BookingSearchPanel from '../components/booking/BookingSearchPanel'
import RoomCard from '../components/rooms/RoomCard'
import { supabase } from '../lib/supabase'
import type { RoomType, FoodItem } from '../types'
import { useCart } from '../contexts/CartContext'

/* ─── 4. WHY CHOOSE US CARDS (5 Items) ─── */
const WHY_CHOOSE_US = [
  {
    icon: BedDouble,
    title: 'Luxury & Comfort',
    desc: 'Well-furnished rooms designed for relaxation.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Great Food',
    desc: 'Delicious meals made with the best ingredients.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Service',
    desc: 'Excellent customer service you can always count on.',
  },
  {
    icon: MapPin,
    title: 'Prime Location',
    desc: 'Conveniently located for easy access and comfort.',
  },
  {
    icon: Sparkles,
    title: 'Affordable Rates',
    desc: 'Enjoy premium service at the best prices.',
  },
]

/* ─── 7. BOTTOM CONVENIENCES ─── */
const CONVENIENCES = [
  { icon: Zap, title: '24/7 Electricity', desc: 'Always on power' },
  { icon: Wifi, title: 'Free Wi-Fi', desc: 'Stay connected' },
  { icon: ShieldCheck, title: 'Security', desc: 'Your safety is our priority' },
  { icon: ParkingCircle, title: 'Ample Parking', desc: 'Secure & spacious' },
  { icon: PartyPopper, title: 'Event Hall', desc: 'Perfect for events' },
]

const FALLBACK_FOOD_IMG = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function HomePage() {
  const [rooms, setRooms] = useState<RoomType[]>([])
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [foodCategories, setFoodCategories] = useState<string[]>(['All'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Fetch rooms
      const { data: roomData } = await supabase
        .from('room_types')
        .select('*, rates:room_rates(*)')
        .eq('status', 'active')
        .limit(4)

      // Fetch food items
      const { data: foodData } = await supabase
        .from('food_items')
        .select('*, category:food_categories(*)')
        .eq('is_available', true)
        .limit(5)

      if (roomData && roomData.length > 0) setRooms(roomData as RoomType[])
      if (foodData && foodData.length > 0) {
        setFoodItems(foodData as FoodItem[])
        const cats = ['All', ...new Set((foodData as FoodItem[]).map(f => f.category?.name).filter(Boolean))] as string[]
        setFoodCategories(cats)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredFood = activeCategory === 'All'
    ? foodItems
    : foodItems.filter(f => f.category?.name === activeCategory)

  return (
    <div className="overflow-hidden bg-[#0A0E0B] text-white">
      {/* ─── 1. HERO SECTION ─── */}
      <section
        className="relative min-h-[75vh] flex items-center justify-center pt-28 pb-20"
        aria-label="Hero"
      >
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=85"
            alt="ITC Grand Chola luxury hotel interior"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark Luxury Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(10,14,11,0.85) 0%, rgba(10,14,11,0.78) 50%, rgba(10,14,11,0.96) 100%)',
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 text-left py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="font-serif italic text-lg sm:text-xl text-[#D9A441] mb-1">
              Welcome to
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-1 tracking-tight">
              ITC GRAND CHOLA
            </h1>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#D9A441] mb-4">
              HOTEL & SUITES
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8">
              Luxury, Comfort & Great Taste – All in One Place.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/rooms" className="btn-gold px-7 py-3 text-sm font-bold">
                Book a Room
              </Link>
              <Link to="/dining" className="btn-outline px-7 py-3 text-sm font-semibold">
                Order Food
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. BOOKING SEARCH PANEL ─── */}
      <section className="relative z-20 max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-20">
        <BookingSearchPanel />
      </section>

      {/* ─── 3. SPLIT FEATURE CARDS ("Book Your Stay" & "Order Delicious Food") ─── */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1220px] mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Book Your Stay */}
          <div className="card-base p-6 sm:p-8 bg-[#151C18] border border-[#28362D] rounded-2xl flex flex-col sm:flex-row justify-between gap-6 items-center">
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold text-[#D9A441] mb-2">
                Book Your Stay
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mb-5 leading-relaxed">
                Experience premium comfort in our modern rooms and suites.
              </p>

              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#D9A441]" />
                  <span>Free Wi-Fi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#D9A441]" />
                  <span>24/7 Power Supply</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#D9A441]" />
                  <span>Secure Environment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#D9A441]" />
                  <span>Best Rate Guarantee</span>
                </li>
              </ul>

              <Link to="/rooms" className="btn-gold text-xs px-5 py-2.5 inline-flex">
                View Rooms
              </Link>
            </div>

            <div className="w-full sm:w-44 h-44 rounded-xl overflow-hidden shrink-0 border border-[#28362D]">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&q=80"
                alt="Room interior"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMG }}
              />
            </div>
          </div>

          {/* Card 2: Order Delicious Food */}
          <div className="card-base p-6 sm:p-8 bg-[#151C18] border border-[#28362D] rounded-2xl flex flex-col sm:flex-row justify-between gap-6 items-center">
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold text-[#D9A441] mb-2">
                Order Delicious Food
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mb-5 leading-relaxed">
                Enjoy a variety of meals, snacks and drinks delivered fast.
              </p>

              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#D9A441]" />
                  <span>Local & Continental Meals</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#D9A441]" />
                  <span>Snacks & Drinks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#D9A441]" />
                  <span>Fast & Reliable Service</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#D9A441]" />
                  <span>Hygienic & Tasty</span>
                </li>
              </ul>

              <Link to="/dining" className="btn-gold text-xs px-5 py-2.5 inline-flex">
                Order Now
              </Link>
            </div>

            <div className="w-full sm:w-44 h-44 rounded-xl overflow-hidden shrink-0 border border-[#28362D]">
              <img
                src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80"
                alt="Dining dish"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMG }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. WHY CHOOSE US (5 Items Grid) ─── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1220px] mx-auto mb-20" aria-label="Why Choose Us">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow block mb-2">THE BEST OF COMFORT & CUISINE</span>
          <h2 className="section-heading mb-3">Why Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.title}
              className="card-base p-5 text-center flex flex-col justify-start items-center bg-[#151C18] border border-[#28362D] rounded-xl"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-[#D9A441] bg-[#1E2722]">
                <item.icon size={22} />
              </div>
              <h3 className="font-serif text-base font-bold text-white mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. OUR ROOMS & SUITES (4 Cards Grid) ─── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1220px] mx-auto mb-20" aria-label="Our Rooms & Suites">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="eyebrow block mb-1">RELAX IN STYLE</span>
            <h2 className="section-heading">Our Rooms & Suites</h2>
          </div>
          <Link to="/rooms" className="btn-outline text-xs px-4 py-2">
            View All Rooms
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="card-base h-80 skeleton" />)}
          </div>
        ) : rooms.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATIC_ROOMS.map((room, i) => (
              <StaticRoomCard key={room.name} room={room} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.slice(0, 4).map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ─── 6. POPULAR MEALS ─── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1220px] mx-auto mb-20" aria-label="Popular Meals">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-4">
          <div>
            <span className="eyebrow block mb-1">TASTY & FRESH</span>
            <h2 className="section-heading">Popular Meals</h2>
          </div>
          <Link to="/dining" className="btn-outline text-xs px-4 py-2">
            View Full Menu
          </Link>
        </div>

        {/* Category Filters (Clean margin & generous padding) */}
        <div className="flex flex-wrap gap-2.5 mt-3 mb-8">
          {foodCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#D9A441] text-[#070A08] shadow-md font-bold'
                  : 'bg-[#151C18] text-gray-300 hover:bg-[#1C2520] border border-[#28362D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {[...Array(5)].map((_, i) => <div key={i} className="card-base h-72 skeleton" />)}
          </div>
        ) : filteredFood.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {STATIC_FOOD.map((f) => <StaticFoodCard key={f.name} food={f} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {filteredFood.map((food) => (
              <FoodCardSmall key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* ─── 7. BOTTOM CONVENIENCES BAR ─── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1220px] mx-auto mb-20 border-t border-b border-[#243028]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {CONVENIENCES.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#151C18] border border-[#28362D] flex items-center justify-center text-[#D9A441] shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white leading-tight">{item.title}</h4>
                <p className="text-[11px] text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


    </div>
  )
}

/* ─── Static room fallback ─── */
const STATIC_ROOMS = [
  { name: 'Standard Room', price: 12000, guests: 2, bed: '1 Bed', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80' },
  { name: 'Deluxe Room', price: 18000, guests: 2, bed: '1 Bed', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80' },
  { name: 'Executive Suite', price: 28000, guests: 2, bed: '1 Bed', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80' },
  { name: 'Presidential Suite', price: 45000, guests: 4, bed: '1 Bed', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80' },
]

function StaticRoomCard({ room }: { room: typeof STATIC_ROOMS[0]; index?: number }) {
  return (
    <article className="card-base group overflow-hidden flex flex-col justify-between bg-[#151C18] border border-[#28362D] rounded-xl shadow-md h-full">
      <div>
        <div className="relative overflow-hidden h-44 sm:h-48">
          <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </div>
        <div className="p-5">
          <h3 className="font-serif text-lg font-bold text-white mb-1 leading-snug">{room.name}</h3>
          <p className="text-sm font-bold text-[#D9A441] mb-3">₹{room.price.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ night</span></p>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1"><Users size={13} className="text-[#D9A441]" />{room.guests} Guests</span>
            <span className="flex items-center gap-1"><BedDouble size={13} className="text-[#D9A441]" />{room.bed}</span>
            <span className="flex items-center gap-1"><Wifi size={13} className="text-[#D9A441]" />Free Wi-Fi</span>
          </div>
        </div>
      </div>
      <div className="p-5 pt-0 mt-auto">
        <Link to="/rooms" className="btn-gold w-full text-center justify-center text-xs py-2.5">
          Book Now
        </Link>
      </div>
    </article>
  )
}

const STATIC_FOOD = [
  { name: 'Jollof Rice & Chicken', price: 1250, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80' },
  { name: 'Fried Rice & Chicken', price: 1250, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80' },
  { name: 'Egusi Soup & Pounded Yam', price: 1400, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80' },
  { name: 'Peppered Meat', price: 1000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80' },
  { name: 'Chicken Shawarma', price: 750, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&q=80' },
]

function StaticFoodCard({ food }: { food: typeof STATIC_FOOD[0] }) {
  return (
    <div className="card-base group overflow-hidden flex flex-col justify-between bg-[#151C18] border border-[#28362D] rounded-xl shadow-md h-full">
      <div>
        <div className="relative overflow-hidden h-36">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMG }}
          />
        </div>
        <div className="p-4">
          <h4 className="font-bold text-xs text-white mb-1 truncate">{food.name}</h4>
          <p className="font-bold text-xs text-[#D9A441] mb-2">₹{food.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <Link to="/dining" className="btn-outline w-full justify-center text-xs py-2">Add to Cart</Link>
      </div>
    </div>
  )
}

function FoodCardSmall({ food }: { food: FoodItem }) {
  const { addItem } = useCart()
  const FOOD_IMAGES: Record<string, string> = {
    'Royal Jollof Rice with Grilled Croaker Fish': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
    'Truffle Ribeye Steak (300g)': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    'Creamy Wild Mushroom Penne': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80',
    'Suya Spiced Lamb Skewers': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    'Crispy Peppered Calamari': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
    'Lumière Signature Gold Cocktail': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
    'Freshly Squeezed Citrus Passion Juice': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80',
    'Warm Valrhona Chocolate Fondant': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
    'Saffron & Pistachio Kulfi Delice': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
  }
  const imgSrc = food.image || FOOD_IMAGES[food.name] || FALLBACK_FOOD_IMG

  return (
    <div className="card-base group overflow-hidden flex flex-col justify-between bg-[#151C18] border border-[#28362D] rounded-xl shadow-md h-full">
      <div>
        <div className="relative overflow-hidden h-36">
          <img
            src={imgSrc}
            alt={food.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMG }}
          />
        </div>
        <div className="p-4">
          <h4 className="font-bold text-xs text-white mb-1 truncate">{food.name}</h4>
          <p className="font-bold text-xs text-[#D9A441] mb-2">₹{food.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <button onClick={() => addItem(food)} className="btn-outline w-full justify-center text-xs py-2">
          <ShoppingCart size={12} className="mr-1" /> Add to Cart
        </button>
      </div>
    </div>
  )
}
