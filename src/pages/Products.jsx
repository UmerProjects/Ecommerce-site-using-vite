import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../lib/api'
import { Link } from 'react-router-dom'
import { formatPriceCents } from '../utils/format'
import { ShoppingBag, Star, Heart, Filter, Grid, List } from 'lucide-react'
import { useState } from 'react'

// Loading Skeleton Component
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState([0, 1000])
  
  const { data, isLoading, error } = useQuery({ 
    queryKey: ['products', sortBy], 
    queryFn: () => getProducts({ page: 1, perPage: 24 }) 
  })

  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-600 text-lg mb-4">Failed to load products</div>
      <p className="text-gray-600">{error.message}</p>
    </div>
  )

  const items = data?.items || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-gray-600">Discover our amazing collection</p>
        </div>
        
        {/* View Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Price Range:</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-24"
            />
            <span className="text-sm text-gray-600">${priceRange[1]}</span>
          </div>
          
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Clear All
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {[...Array(12)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {items.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                  
                  {/* Sale Badge */}
                  {index % 5 === 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      SALE
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(4.{Math.floor(Math.random() * 9) + 1})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPriceCents(product.price_cents, product.currency)}
                      </span>
                      {index % 7 === 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPriceCents(product.price_cents * 1.3, product.currency)}
                        </span>
                      )}
                    </div>
                    
                    <button className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && items.length > 0 && (
        <div className="text-center pt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Load More Products
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  )
}
