import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'
import { formatPriceCents } from '../utils/format'
import { ShoppingBag, Star, Heart, Filter, Grid, List, Eye } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../store/cart'

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
  const [page, setPage] = useState(1)
  const perPage = 12

  const navigate = useNavigate()
  const addItem = useCartStore(s => s.addItem)

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { sortBy, page }],
    queryFn: () => getProducts({ page, perPage }),
    keepPreviousData: true,
  })

  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-600 text-lg mb-4">Failed to load products</div>
      <p className="text-gray-600">{error.message}</p>
    </div>
  )

  const items = data?.items || []
  const total = data?.count || 0
  const totalPages = total > 0 ? Math.ceil(total / perPage) : 1

  const handleAddToCart = (event, product) => {
    event.preventDefault()
    event.stopPropagation()
    if (product.stock_quantity === 0) return
    addItem({ product_id: product.id, quantity: 1 })
  }

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
          {[...Array(perPage)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {items.map((product, index) => {
            const hasDiscount =
              typeof product.sale_price_cents === 'number' &&
              product.sale_price_cents > 0 &&
              product.sale_price_cents < product.price_cents
            const discountPercent = hasDiscount
              ? Math.round(100 - (product.sale_price_cents / product.price_cents) * 100)
              : null
            const primaryImage = (product.image_urls && product.image_urls[0]) || product.image_url
            const secondaryImage =
              (product.image_urls && product.image_urls[1]) || primaryImage

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    {primaryImage ? (
                      <>
                        <img
                          src={primaryImage}
                          alt={product.title}
                          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                        />
                        {secondaryImage && (
                          <img
                            src={secondaryImage}
                            alt={product.title}
                            className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    {/* Discount badge */}
                    {hasDiscount && discountPercent !== null && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discountPercent}%
                      </div>
                    )}

                    {/* Out of stock badge */}
                    {product.stock_quantity === 0 && (
                      <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Out of stock
                      </div>
                    )}

                    {/* Quick View icon */}
                    <button
                      type="button"
                      onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        navigate(`/products/${product.id}`)
                      }}
                      className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-sm"
                      aria-label="Quick view"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
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
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPriceCents(
                              hasDiscount ? product.sale_price_cents : product.price_cents,
                              product.currency
                            )}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPriceCents(product.price_cents, product.currency)}
                            </span>
                          )}
                        </div>
                        {product.stock_quantity > 0 && (
                          <span className="text-xs text-gray-500">
                            {product.stock_quantity} in stock
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={event => handleAddToCart(event, product)}
                        disabled={product.stock_quantity === 0}
                        className={`bg-blue-600 text-white px-3 py-2 rounded-full flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                          product.stock_quantity === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-blue-700 hover:scale-105 hover:shadow-lg'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              page === 1
                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              page === totalPages
                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            Next
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
