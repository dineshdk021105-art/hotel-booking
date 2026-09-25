import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Search, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'
import type { FoodItem, FoodCategory } from '../types'
import toast from 'react-hot-toast'

// Curated unique high-resolution images for every single menu item
const ITEM_FALLBACK_IMAGES: Record<string, string> = {
  // Database menu items
  'Suya Spiced Lamb Skewers': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  'Crispy Peppered Calamari': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
  'Freshly Squeezed Citrus Passion Juice': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80',
  'Lumière Signature Gold Cocktail': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
  'Creamy Wild Mushroom Penne': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80',
  'Royal Jollof Rice with Grilled Croaker Fish': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
  'Truffle Ribeye Steak (300g)': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  'Warm Valrhona Chocolate Fondant': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
  'Saffron & Pistachio Kulfi Delice': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',

  // Static fallback menu items
  'Jollof Rice & Chicken': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
  'Fried Rice & Chicken': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80',
  'Coconut Rice': 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&q=80',
  'Pounded Yam & Egusi Soup': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
  'Eba & Okra Soup': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80',
  'Banga Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  'Ofe Onugbu': 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
  'Peppered Meat': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  'Chicken Shawarma': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&q=80',
  'Spring Rolls (6 pcs)': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'Fresh Zobo Drink': 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=600&q=80',
  'Chapman Cocktail': 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80',
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Gourmet Mains': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  'Artisanal Starters & Snacks': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  'Beverages & Cellar': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
  'Decadent Desserts': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
}

const UNIQUE_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80',
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
  'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80',
]

function getItemImage(item: FoodItem, index: number): string {
  if (item.image && item.image.trim() !== '') return item.image
  if (ITEM_FALLBACK_IMAGES[item.name]) return ITEM_FALLBACK_IMAGES[item.name]
  const catName = (item as any).category?.name || item.category_id
  if (catName && CATEGORY_IMAGES[catName]) return CATEGORY_IMAGES[catName]
  return UNIQUE_IMAGE_POOL[index % UNIQUE_IMAGE_POOL.length]
}

const STATIC_FOOD: FoodItem[] = [
  { id: 'f1', category_id: 'rice', name: 'Jollof Rice & Chicken', description: 'Aromatic tomato-based rice cooked to perfection, served with tender grilled chicken.', price: 2500, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', is_vegetarian: false, is_available: true },
  { id: 'f2', category_id: 'rice', name: 'Fried Rice & Chicken', description: 'Stir-fried rice with vegetables, egg and choice of protein.', price: 2500, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80', is_vegetarian: false, is_available: true },
  { id: 'f3', category_id: 'rice', name: 'Coconut Rice', description: 'Fragrant rice cooked in rich coconut milk, served with fried plantain.', price: 2200, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&q=80', is_vegetarian: true, is_available: true },
  { id: 'f4', category_id: 'swallow', name: 'Pounded Yam & Egusi Soup', description: 'Smooth pounded yam served with rich egusi soup loaded with assorted meat.', price: 2800, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', is_vegetarian: false, is_available: true },
  { id: 'f5', category_id: 'swallow', name: 'Eba & Okra Soup', description: 'Cassava fufu with thick okra soup and fried fish.', price: 2500, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80', is_vegetarian: false, is_available: true },
  { id: 'f6', category_id: 'soup', name: 'Banga Soup', description: 'Rich and flavorful palm fruit soup with assorted proteins.', price: 3000, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', is_vegetarian: false, is_available: true },
  { id: 'f7', category_id: 'soup', name: 'Ofe Onugbu', description: 'Bitter leaf soup slow-cooked with ofe onugbu and cocoyam.', price: 2800, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80', is_vegetarian: false, is_available: true },
  { id: 'f8', category_id: 'snack', name: 'Peppered Meat', description: 'Succulent cuts of beef and offal, marinated and grilled in a spicy pepper sauce.', price: 2000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', is_vegetarian: false, is_available: true },
  { id: 'f9', category_id: 'snack', name: 'Chicken Shawarma', description: 'Toasted flatbread filled with seasoned chicken, fresh veggies and garlic sauce.', price: 1500, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&q=80', is_vegetarian: false, is_available: true },
  { id: 'f10', category_id: 'snack', name: 'Spring Rolls (6 pcs)', description: 'Crispy spring rolls stuffed with vegetables and served with sweet chilli sauce.', price: 1200, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', is_vegetarian: true, is_available: true },
  { id: 'f11', category_id: 'drink', name: 'Fresh Zobo Drink', description: 'Chilled hibiscus flower drink, naturally sweetened with ginger and cloves.', price: 500, image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=600&q=80', is_vegetarian: true, is_available: true },
  { id: 'f12', category_id: 'drink', name: 'Chapman Cocktail', description: 'The classic Nigerian cocktail with a blend of fruity flavours.', price: 800, image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80', is_vegetarian: true, is_available: true },
]

const STATIC_CATS: FoodCategory[] = [
  { id: 'rice', name: 'Gourmet Mains', display_order: 1, is_active: true },
  { id: 'snack', name: 'Artisanal Starters & Snacks', display_order: 2, is_active: true },
  { id: 'drink', name: 'Beverages & Cellar', display_order: 3, is_active: true },
  { id: 'dessert', name: 'Decadent Desserts', display_order: 4, is_active: true },
]

export default function DiningPage() {
  const [categories, setCategories] = useState<FoodCategory[]>(STATIC_CATS)
  const [items, setItems] = useState<FoodItem[]>(STATIC_FOOD)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { addItem, items: cartItems } = useCart()

  useEffect(() => {
    const fetchMenu = async () => {
      const { data: cats } = await supabase
        .from('food_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      const { data: food } = await supabase
        .from('food_items')
        .select('*, category:food_categories(*)')
        .eq('is_available', true)

      if (cats && cats.length > 0) setCategories(cats)
      if (food && food.length > 0) setItems(food as FoodItem[])
    }
    fetchMenu()
  }, [])

  const filtered = items.filter(item => {
    const catName = (item as any).category?.name || item.category_id
    const matchCat = activeCategory === 'All' || catName === activeCategory || item.category_id === activeCategory
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const cartCount = (id: string) => cartItems.find(c => c.food_item.id === id)?.quantity || 0

  const handleAdd = (item: FoodItem, imageToUse: string) => {
    addItem({ ...item, image: imageToUse })
    toast.success(`${item.name} added to cart!`)
  }

  return (
    <div className="pt-28 sm:pt-32 min-h-screen bg-[#0A0E0B] text-white">
      {/* Hero Header */}
      <div className="relative py-12 px-4 text-center overflow-hidden bg-[#101512] border-b border-[#202B24]">
        <div className="absolute inset-0 bg-radial-gradient from-[#D9A441]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-[#D9A441] text-xs uppercase tracking-widest font-bold mb-2">FROM OUR KITCHEN</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-3">Hotel Dining & Gourmet Menu</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Savour authentic Indian and continental cuisine prepared with the finest ingredients. Order directly to your room or enjoy in our luxury restaurant.
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">
          {/* Search Bar with zero overlap guaranteed */}
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D9A441] z-10">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.85rem', paddingRight: '1rem' }}
              className="w-full bg-[#0F1411] border border-[#28362D] focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] text-white placeholder-gray-400 py-3 rounded-xl text-sm transition-all outline-none shadow-inner"
              aria-label="Search food items"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-[#D9A441] text-[#070A08] shadow-md font-bold'
                  : 'bg-[#151C18] border border-[#28362D] text-gray-300 hover:border-[#D9A441] hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.name
                    ? 'bg-[#D9A441] text-[#070A08] shadow-md font-bold'
                    : 'bg-[#151C18] border border-[#28362D] text-gray-300 hover:border-[#D9A441] hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#151C18] border border-[#28362D] rounded-2xl max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#1E2722] border border-[#28362D] flex items-center justify-center text-[#D9A441] mx-auto mb-4">
              <Search size={24} />
            </div>
            <p className="text-lg font-serif font-bold text-white mb-1">No items found</p>
            <p className="text-sm text-gray-400 mb-6">Try searching for something else or pick a different category.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All') }}
              className="btn-gold text-xs px-6 py-2.5"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item, i) => {
              const qty = cartCount(item.id)
              const imageSrc = getItemImage(item, i)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 8) * 0.04 }}
                  className="bg-[#151C18] border border-[#28362D] rounded-2xl overflow-hidden hover:border-[#D9A441]/50 hover:shadow-xl hover:shadow-[#D9A441]/5 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Food Photo Container */}
                    <div className="relative overflow-hidden h-48 bg-[#0D120F]">
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = UNIQUE_IMAGE_POOL[i % UNIQUE_IMAGE_POOL.length]
                        }}
                      />
                      {/* Dietary Tag */}
                      {item.is_vegetarian && (
                        <span className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-400 border border-emerald-700/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-md">
                          Veg
                        </span>
                      )}
                      {/* Category or Prep time */}
                      {item.preparation_time && (
                        <span className="absolute top-3 right-3 bg-[#0A0E0B]/85 text-gray-300 border border-[#28362D] text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                          <Clock size={11} className="text-[#D9A441]" />
                          {item.preparation_time}m
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <h3 className="font-serif font-bold text-white text-base sm:text-lg mb-1.5 group-hover:text-[#D9A441] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed min-h-[32px]">
                          {item.description}
                        </p>
                      )}
                      <p className="font-bold text-base text-[#D9A441]">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Add to Cart Action */}
                  <div className="px-5 pb-5 pt-0">
                    <button
                      onClick={() => handleAdd(item, imageSrc)}
                      className={`w-full flex items-center justify-center gap-2 text-xs py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                        qty > 0
                          ? 'bg-[#D9A441] text-[#070A08] hover:brightness-110 shadow-md'
                          : 'bg-[#1E2722] border border-[#28362D] text-gray-200 hover:bg-[#D9A441] hover:text-[#070A08] hover:border-[#D9A441]'
                      }`}
                    >
                      <ShoppingCart size={14} />
                      {qty > 0 ? `In Cart (${qty})` : 'Add to Cart'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
