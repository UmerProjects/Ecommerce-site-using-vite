import { useState } from 'react'
import { ShoppingCart, Heart, User, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cart'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const cartCount = useCartStore(s => s.items.reduce((acc, i) => acc + i.quantity, 0))

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action Buttons */}
      <div className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <Link
          to="/cart"
          className="relative w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
        
        <button className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700 transition-all duration-300 hover:scale-110">
          <Heart className="w-6 h-6" />
        </button>
        
        <Link
          to="/profile"
          className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110"
        >
          <User className="w-6 h-6" />
        </Link>
      </div>

      {/* Main FAB */}
      <div className="flex flex-col items-end">
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110 mb-2"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${isOpen ? 'rotate-45' : ''}`}
        >
          <span className="text-2xl font-bold">+</span>
        </button>
      </div>
    </div>
  )
}
