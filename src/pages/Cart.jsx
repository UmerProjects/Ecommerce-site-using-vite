import { useCartStore } from '../store/cart'
import { useToast } from '../components/ui/Toast'
import { formatPriceCents } from '../utils/format'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Cart() {
  const { items, removeItem, clear } = useCartStore()
  const { success, error } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId, variantId)
      success('Item removed from cart')
    } else {
      // Update quantity logic would go here
      success('Quantity updated')
    }
  }

  const handleRemoveItem = (productId, variantId, title) => {
    removeItem(productId, variantId)
    success(`${title} removed from cart`)
  }

  const handleClearCart = () => {
    clear()
    success('Cart cleared')
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = items.reduce((acc, item) => acc + (item.price_cents * item.quantity), 0)

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Start Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
    <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div
              key={`${item.product_id}-${item.variant_id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  {item.variant_name && (
                    <p className="text-sm text-gray-600 mb-2">Variant: {item.variant_name}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPriceCents(item.price_cents, item.currency)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                        disabled={isUpdating}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                        disabled={isUpdating}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.product_id, item.variant_id, item.title)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatPriceCents(totalPrice, 'USD')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPriceCents(totalPrice * 0.08, 'USD')}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPriceCents(totalPrice * 1.08, 'USD')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Proceed to Checkout
              </button>
              <Link 
                to="/products"
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Secure checkout guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Recommended Product {i + 1}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">$29.99</span>
                  <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
