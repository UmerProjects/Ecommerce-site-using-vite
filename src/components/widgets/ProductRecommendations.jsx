import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../lib/api'
import { formatPriceCents } from '../../utils/format'
import { ShoppingBag, Star, Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cart'
import { useToast } from '../ui/Toast'

export default function ProductRecommendations({ 
  title = "Recommended for You", 
  limit = 4,
  category = null,
  className = ""
}) {
  const { addItem } = useCartStore()
  const { success } = useToast()
  
  const { data, isLoading, error } = useQuery({ 
    queryKey: ['recommendations', category], 
    queryFn: () => getProducts({ page: 1, perPage: limit, category }) 
  })

  const handleAddToCart = (product) => {
    addItem({
      product_id: product.id,
      title: product.title,
      price_cents: product.price_cents,
      currency: product.currency,
      image_url: product.image_url,
      quantity: 1
    })
    success(`${product.title} added to cart`)
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-600">Unable to load recommendations</p>
        </div>
      </div>
    )
  }

  const products = data?.items || []

  if (products.length === 0) {
    return null
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Link to={`/products/${product.id}`} className="block">
              <div className="aspect-square overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">(4.8)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {formatPriceCents(product.price_cents, product.currency)}
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Quick Add Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                handleAddToCart(product)
              }}
              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Wishlist Button */}
            <button className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-sm">
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrendingProducts({ className = "" }) {
  return (
    <ProductRecommendations 
      title="🔥 Trending Now" 
      limit={6}
      className={className}
    />
  )
}

export function RecentlyViewed({ className = "" }) {
  return (
    <ProductRecommendations 
      title="👀 Recently Viewed" 
      limit={4}
      className={className}
    />
  )
}

export function SimilarProducts({ productId, className = "" }) {
  return (
    <ProductRecommendations 
      title="🛍️ You Might Also Like" 
      limit={4}
      className={className}
    />
  )
}
