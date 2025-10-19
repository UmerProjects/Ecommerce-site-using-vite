import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../lib/api'
import { Link } from 'react-router-dom'
import { formatPriceCents } from '../utils/format'
import { ShoppingBag, Star, ArrowRight, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { TrendingProducts } from '../components/widgets/ProductRecommendations'
import NewsletterSignup from '../components/widgets/NewsletterSignup'

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery({ 
    queryKey: ['featured-products'], 
    queryFn: () => getProducts({ page: 1, perPage: 8 }) 
  })
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const products = featuredProducts?.items || []

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      title: "New Collection",
      subtitle: "Discover the latest trends",
      description: "Shop our newest arrivals and stay ahead of fashion",
      bg: "bg-gradient-to-r from-purple-600 to-pink-600"
    },
    {
      title: "Summer Sale",
      subtitle: "Up to 50% off",
      description: "Don't miss out on amazing deals this season",
      bg: "bg-gradient-to-r from-orange-500 to-red-500"
    },
    {
      title: "Premium Quality",
      subtitle: "Crafted with care",
      description: "Experience luxury and comfort in every product",
      bg: "bg-gradient-to-r from-blue-600 to-indigo-600"
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className={`${heroSlides[currentSlide].bg} text-white p-12 md:p-16 transition-all duration-1000 ease-in-out`}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
              {heroSlides[currentSlide].title}
            </h1>
            <h2 className="text-xl md:text-2xl mb-6 opacity-90 animate-fade-in-up animation-delay-200">
              {heroSlides[currentSlide].subtitle}
            </h2>
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
              {heroSlides[currentSlide].description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/categories" 
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
    <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">Handpicked items just for you</p>
          </div>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square overflow-hidden">
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
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(4.8)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPriceCents(product.price_cents, product.currency)}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories Showcase */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-gray-600">Find exactly what you're looking for</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Electronics", icon: "📱", color: "bg-blue-500" },
            { name: "Fashion", icon: "👗", color: "bg-pink-500" },
            { name: "Home & Garden", icon: "🏠", color: "bg-green-500" },
            { name: "Sports", icon: "⚽", color: "bg-orange-500" }
          ].map((category, index) => (
            <Link
              key={category.name}
              to="/categories"
              className="group relative overflow-hidden rounded-xl bg-white p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section>
        <NewsletterSignup />
      </section>

      {/* Trending Products */}
      <section>
        <TrendingProducts />
      </section>
    </div>
  )
}
